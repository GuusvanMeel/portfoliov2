// Runs a command with the TEST database settings from .env.test.local, e.g.
//   node scripts/runWithTestEnv.ts next dev
// Refuses to start when the settings are missing or point at the live database.
import { spawn } from "node:child_process";
import { loadLocalTestEnvFile, readTestEnvironment } from "../lib/testEnvironment.ts";

loadLocalTestEnvFile();
readTestEnvironment();

const [command, ...args] = process.argv.slice(2);
if (!command) {
  console.error("Usage: node scripts/runWithTestEnv.ts <command> [...args]");
  process.exit(1);
}

const child = spawn(command, args, { stdio: "inherit", shell: true, env: process.env });
child.on("exit", (code) => process.exit(code ?? 1));
