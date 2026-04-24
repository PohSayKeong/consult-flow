import fs from "node:fs";
import path from "node:path";

import Anthropic from "@anthropic-ai/sdk";

const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env.local");
const promptsDir = path.join(rootDir, "prompts");
const managedBeta = "managed-agents-2026-04-01" as const;

const envKeys = {
  extractor: "EXTRACTOR_AGENT_ID",
  execution: "EXECUTION_AGENT_ID",
  email: "EMAIL_AGENT_ID",
  autoaction: "AUTO_ACTION_AGENT_ID",
  environment: "MANAGED_ENVIRONMENT_ID",
} as const;

function readEnvFile() {
  if (!fs.existsSync(envPath)) {
    return {};
  }

  return fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .reduce<Record<string, string>>((acc, line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        return acc;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        return acc;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      acc[key] = value;
      return acc;
    }, {});
}

function upsertEnvValue(content: string, key: string, value: string) {
  const entry = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");

  if (pattern.test(content)) {
    return content.replace(pattern, entry);
  }

  const suffix = content.endsWith("\n") || content.length === 0 ? "" : "\n";
  return `${content}${suffix}${entry}\n`;
}

function writeEnvValues(values: Record<string, string>) {
  const initial = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

  const next = Object.entries(values).reduce(
    (content, [key, value]) => upsertEnvValue(content, key, value),
    initial,
  );

  fs.writeFileSync(envPath, next);
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is required to create managed agents.");
  }

  const envValues = readEnvFile();
  const client = new Anthropic({ apiKey });

  let environmentId = envValues[envKeys.environment];

  if (!environmentId) {
    const environment = await client.beta.environments.create({
      name: "ConsultFlow Managed Agents",
      description: "Managed agent environment for ConsultFlow workflows.",
      betas: [managedBeta],
    });
    environmentId = environment.id;
  }

  const ensureAgent = async (
    key: keyof typeof envKeys,
    name: string,
    promptFile: string,
  ) => {
    const envKey = envKeys[key];
    const existingId = envValues[envKey];

    if (existingId) {
      return existingId;
    }

    const system = fs.readFileSync(path.join(promptsDir, promptFile), "utf8");
    const agent = await client.beta.agents.create({
      name,
      model: "claude-haiku-4-5",
      system,
      betas: [managedBeta],
    });

    return agent.id;
  };

  const extractorId = await ensureAgent(
    "extractor",
    "ConsultFlow Extractor",
    "agent-extractor.txt",
  );
  const executionId = await ensureAgent(
    "execution",
    "ConsultFlow Execution",
    "agent-execution.txt",
  );
  const emailId = await ensureAgent(
    "email",
    "ConsultFlow Email",
    "agent-email.txt",
  );
  const autoactionId = await ensureAgent(
    "autoaction",
    "ConsultFlow Auto-Action",
    "agent-autoaction.txt",
  );

  writeEnvValues({
    [envKeys.environment]: environmentId,
    [envKeys.extractor]: extractorId,
    [envKeys.execution]: executionId,
    [envKeys.email]: emailId,
    [envKeys.autoaction]: autoactionId,
  });

  console.log(`${envKeys.environment}=${environmentId}`);
  console.log(`${envKeys.extractor}=${extractorId}`);
  console.log(`${envKeys.execution}=${executionId}`);
  console.log(`${envKeys.email}=${emailId}`);
  console.log(`${envKeys.autoaction}=${autoactionId}`);
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Failed to set up managed agents.",
  );
  process.exit(1);
});
