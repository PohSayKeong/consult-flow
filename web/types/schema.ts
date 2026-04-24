export type ItemKind = "task" | "blocker" | "risk" | "waiting";
export type ItemStatus = "todo" | "doing" | "waiting" | "done";
export type DueFlag = "soon" | "overdue" | null;

export interface ConsultItem {
  id: string;
  title: string;
  kind: ItemKind;
  status: ItemStatus;
  owner: string;
  ownerName: string;
  due: string;
  dueFlag: DueFlag;
  tags: string[];
  waiting: boolean;
  quote: string | null;
  suggested_action?: string;
  suggested_owner?: string;
}

export interface Stats {
  total: number;
  waiting: number;
  blockers: number;
  risks: number;
}

export interface ClientDigest {
  nextFromClient: string;
  nextFromUs: string;
  flags: string;
}

export interface SummaryData {
  execSummary: string;
  clientDigest: ClientDigest;
  provenance: string;
}

export interface ExtractResponse {
  items: ConsultItem[];
  stats: Stats;
}

export interface SummarizeResponse {
  execSummary: string;
  clientDigest: ClientDigest;
  provenance: string;
}
