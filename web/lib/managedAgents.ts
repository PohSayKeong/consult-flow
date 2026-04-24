import Anthropic from "@anthropic-ai/sdk";

import { getAnthropicClient } from "@/lib/anthropic";

const MANAGED_AGENT_BETA = "managed-agents-2026-04-01" as const;
const MANAGED_ENVIRONMENT_ID_ENV = "MANAGED_ENVIRONMENT_ID";

type RunManagedAgentOptions = {
  agentId: string;
  title: string;
  input: string;
};

export class ManagedAgentError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ManagedAgentError";
    this.status = status;
  }
}

function getEnvironmentId() {
  const environmentId = process.env[MANAGED_ENVIRONMENT_ID_ENV];

  if (!environmentId) {
    throw new ManagedAgentError(
      `${MANAGED_ENVIRONMENT_ID_ENV} is not set.`,
      500,
    );
  }

  return environmentId;
}

function getMessageText(event: Anthropic.Beta.Sessions.BetaManagedAgentsAgentMessageEvent) {
  return event.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
}

export async function runManagedAgent({
  agentId,
  title,
  input,
}: RunManagedAgentOptions) {
  const client = getAnthropicClient();
  const environmentId = getEnvironmentId();

  const session = await client.beta.sessions.create({
    agent: agentId,
    environment_id: environmentId,
    title,
    betas: [MANAGED_AGENT_BETA],
  });

  const stream = await client.beta.sessions.events.stream(session.id, {
    betas: [MANAGED_AGENT_BETA],
  });

  const chunks: string[] = [];
  let idleStopReason:
    | Anthropic.Beta.Sessions.BetaManagedAgentsSessionStatusIdleEvent["stop_reason"]
    | null = null;
  let terminatedMessage: string | null = null;

  await client.beta.sessions.events.send(
    session.id,
    {
      events: [
        {
          type: "user.message",
          content: [{ type: "text", text: input }],
        },
      ],
      betas: [MANAGED_AGENT_BETA],
    },
    { headers: { "anthropic-beta": MANAGED_AGENT_BETA } },
  );

  for await (const event of stream) {
    if (event.type === "agent.message") {
      chunks.push(getMessageText(event));
    }

    if (event.type === "session.status_idle") {
      idleStopReason = event.stop_reason;
      break;
    }

    if (event.type === "session.status_terminated") {
      terminatedMessage = "Managed agent session terminated unexpectedly.";
      break;
    }

    if (event.type === "session.error") {
      throw new ManagedAgentError(event.error.message, 502);
    }
  }

  if (terminatedMessage) {
    throw new ManagedAgentError(terminatedMessage, 502);
  }

  if (!idleStopReason) {
    throw new ManagedAgentError(
      "Managed agent session ended before producing a complete response.",
      502,
    );
  }

  if (idleStopReason.type === "requires_action") {
    throw new ManagedAgentError(
      "Managed agent requested tool or user action that is not wired in this route.",
      502,
    );
  }

  if (idleStopReason.type === "retries_exhausted") {
    throw new ManagedAgentError(
      "Managed agent exhausted retries before completing the turn.",
      502,
    );
  }

  return chunks.join("").trim();
}

export function parseJSONResponse<T>(text: string): T {
  const trimmed = text.trim();

  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const jsonText = fencedMatch ? fencedMatch[1].trim() : trimmed;

  return JSON.parse(jsonText) as T;
}

export { MANAGED_AGENT_BETA, MANAGED_ENVIRONMENT_ID_ENV };
