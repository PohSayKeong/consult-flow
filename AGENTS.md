# ConsultFlow – AI Agent Coordination Protocol

This project uses multiple AI agents (Claude and Codex) to collaboratively build a consulting workflow system.

All coordination happens through `tasks.json`.

---

# 🧠 Roles

## Claude (Planner / Reviewer)
Responsible for:
- Task decomposition
- Assigning ownership
- Managing dependencies
- Reviewing completed work
- Maintaining consistency with workflow stages

Claude MUST NOT:
- Write or modify implementation code
- Execute tasks assigned to Codex

---

## Codex (Executor)
Responsible for:
- Implementing tasks assigned to it
- Writing code (UI, API, integration)
- Updating task status and outputs

Codex MUST NOT:
- Modify task structure
- Reassign tasks
- Work on tasks not assigned to it

---

# 🔁 Workflow Loop

1. Claude reads `tasks.json`
2. Claude refines tasks and updates plan
3. Codex reads `tasks.json`
4. Codex executes eligible tasks
5. Codex updates completed tasks
6. Claude reviews results and adjusts tasks
7. Repeat until completion

---

# 📦 Task Schema

All tasks must follow this structure:

```json
{
  "id": "TASK-XXX",
  "title": "string",
  "description": "string",
  "stage": "ingest | plan | execute | communicate",
  "owner": "claude | codex",
  "status": "todo | doing | done",
  "dependencies": ["TASK-XXX"],
  "output": "string",
  "files": ["file paths"],
  "updated_at": "timestamp"
}