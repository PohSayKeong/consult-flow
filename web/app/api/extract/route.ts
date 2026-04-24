import { NextResponse } from "next/server";

import {
  ManagedAgentError,
  parseJSONResponse,
  runManagedAgent,
} from "@/lib/managedAgents";
import type { ConsultItem, ExtractResponse, Stats } from "@/types/schema";

function buildStats(items: ConsultItem[]): Stats {
  return {
    total: items.length,
    waiting: items.filter((item) => item.waiting).length,
    blockers: items.filter((item) => item.kind === "blocker").length,
    risks: items.filter((item) => item.kind === "risk").length,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { input?: string };
    const input = body.input?.trim();

    if (!input) {
      return NextResponse.json(
        { error: "Request body must include a non-empty input string." },
        { status: 400 },
      );
    }

    const agentId = process.env.EXTRACTOR_AGENT_ID;

    if (!agentId) {
      return NextResponse.json(
        { error: "EXTRACTOR_AGENT_ID is not set." },
        { status: 500 },
      );
    }

    const responseText = await runManagedAgent({
      agentId,
      title: "ConsultFlow extraction",
      input,
    });

    let items: ConsultItem[];

    try {
      items = parseJSONResponse<ConsultItem[]>(responseText);
    } catch {
      return NextResponse.json(
        {
          error: "Managed agent response could not be parsed as JSON.",
          raw: responseText,
        },
        { status: 422 },
      );
    }

    const payload: ExtractResponse = {
      items,
      stats: buildStats(items),
    };

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof ManagedAgentError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Unexpected extraction error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
