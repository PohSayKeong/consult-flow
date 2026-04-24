import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "..", "tasks.json");
    const content = readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    return NextResponse.json(data ?? { project: "Tasks", last_updated: "", tasks: [] });
  } catch (err) {
    console.error("Failed to read tasks.json:", err);
    return NextResponse.json({ project: "Tasks", last_updated: "", tasks: [] });
  }
}