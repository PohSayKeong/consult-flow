import { NextResponse } from "next/server";

import {
  ManagedAgentError,
  parseJSONResponse,
  runManagedAgent,
} from "@/lib/managedAgents";
import { MOCK_EMAIL } from "@/lib/mocks";
import type { ConsultItem, SummaryData } from "@/types/schema";

type EmailResponse = {
  subject: string;
  body: string;
  tone: string;
};

export async function POST(request: Request) {
  try {
    if (process.env.MOCK_AI === "true") {
      return NextResponse.json(MOCK_EMAIL);
    }

    const body = (await request.json()) as {
      items?: ConsultItem[];
      summary?: SummaryData;
    };

    if (!Array.isArray(body.items) || !body.summary) {
      return NextResponse.json(
        { error: "Request body must include items and summary." },
        { status: 400 },
      );
    }

    const agentId = process.env.EMAIL_AGENT_ID;

    if (!agentId) {
      return NextResponse.json(
        { error: "EMAIL_AGENT_ID is not set." },
        { status: 500 },
      );
    }

    const responseText = await runManagedAgent({
      agentId,
      title: "ConsultFlow email draft",
      input: JSON.stringify({ items: body.items, summary: body.summary }),
    });

    let emailDraft: EmailResponse;

    try {
      emailDraft = parseJSONResponse<EmailResponse>(responseText);
    } catch {
      return NextResponse.json(
        {
          error: "Managed agent response could not be parsed as JSON.",
          raw: responseText,
        },
        { status: 422 },
      );
    }

    return NextResponse.json(emailDraft);
  } catch (error) {
    if (error instanceof ManagedAgentError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Unexpected email drafting error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
