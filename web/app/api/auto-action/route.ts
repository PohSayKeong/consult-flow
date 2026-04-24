import { NextResponse } from "next/server";

import {
  ManagedAgentError,
  parseJSONResponse,
  runManagedAgent,
} from "@/lib/managedAgents";
import { MOCK_AUTO_ACTIONS, type AutoActionResult } from "@/lib/mocks";

export async function POST(request: Request) {
  try {
    if (process.env.MOCK_AI === "true") {
      const body = (await request.json()) as { action?: string };
      const action = body.action ?? "draft_memo";
      const result = MOCK_AUTO_ACTIONS[action] ?? MOCK_AUTO_ACTIONS["draft_memo"];
      return NextResponse.json(result);
    }

    const body = (await request.json()) as {
      item?: unknown;
      action?: string;
    };
    const { item, action } = body;

    if (!item || !action) {
      return NextResponse.json(
        { error: "Request body must include item and action." },
        { status: 400 },
      );
    }

    const agentId = process.env.AUTO_ACTION_AGENT_ID;

    if (!agentId) {
      return NextResponse.json(
        { error: "AUTO_ACTION_AGENT_ID is not set." },
        { status: 500 },
      );
    }

    const responseText = await runManagedAgent({
      agentId,
      title: "ConsultFlow auto-action",
      input: JSON.stringify({ item, action }),
    });

    let result: AutoActionResult;

    try {
      result = parseJSONResponse<AutoActionResult>(responseText);
    } catch {
      return NextResponse.json(
        {
          error: "Managed agent response could not be parsed as JSON.",
          raw: responseText,
        },
        { status: 422 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ManagedAgentError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Unexpected auto-action error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}