import { NextResponse } from "next/server";

import {
  ManagedAgentError,
  parseJSONResponse,
  runManagedAgent,
} from "@/lib/managedAgents";
import { buildMockSummary, MOCK_SUMMARY } from "@/lib/mocks";
import type { ConsultItem, SummarizeResponse } from "@/types/schema";

export async function POST(request: Request) {
  try {
    if (process.env.MOCK_AI === "true") {
      try {
        const body = (await request.json()) as { items?: ConsultItem[] };
        const items = body.items;
        if (Array.isArray(items)) {
          return NextResponse.json(buildMockSummary(items));
        }
      } catch {
        // ignore
      }

      return NextResponse.json(MOCK_SUMMARY);
    }

    const body = (await request.json()) as { items?: ConsultItem[] };
    const items = body.items;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Request body must include an items array." },
        { status: 400 },
      );
    }

    const agentId = process.env.EXECUTION_AGENT_ID;

    if (!agentId) {
      return NextResponse.json(
        { error: "EXECUTION_AGENT_ID is not set." },
        { status: 500 },
      );
    }

    const responseText = await runManagedAgent({
      agentId,
      title: "ConsultFlow summary",
      input: JSON.stringify(items),
    });

    let summary: SummarizeResponse;

    try {
      summary = parseJSONResponse<SummarizeResponse>(responseText);
    } catch {
      return NextResponse.json(
        {
          error: "Managed agent response could not be parsed as JSON.",
          raw: responseText,
        },
        { status: 422 },
      );
    }

    return NextResponse.json(summary);
  } catch (error) {
    if (error instanceof ManagedAgentError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Unexpected summarization error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
