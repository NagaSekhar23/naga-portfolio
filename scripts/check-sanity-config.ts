/**
 * Pre-flight check for the Sanity setup. Run: npm run cms:doctor
 *
 * Verifies project/dataset, dataset visibility, CORS, and each token's *actual* permissions
 * (write test is a dry run — nothing is written). Never prints token values.
 * Run it before `npm run cms:seed`.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

const API_VERSION = "2026-01-01";
const env = process.env;
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";

type Level = "ok" | "warn" | "fail" | "info";
const results: { level: Level; text: string }[] = [];
const say = (level: Level, text: string) => {
  results.push({ level, text });
  const icon = { ok: "✓", warn: "!", fail: "✗", info: "·" }[level];
  console.log(`  ${icon} ${text}`);
};
const msg = (e: unknown) => (e instanceof Error ? e.message : String(e)).replace(/Bearer\s+\S+/g, "Bearer ***");
const status = (e: unknown) => (e as { statusCode?: number })?.statusCode;

const client = (token?: string) =>
  createClient({ projectId, dataset, apiVersion: API_VERSION, useCdn: false, token });

async function canWrite(token: string) {
  try {
    await client(token).mutate([{ createIfNotExists: { _id: "doctor.probe", _type: "doctorProbe" } }], { dryRun: true });
    return "yes" as const;
  } catch (e) {
    return status(e) === 401 ? ("invalid" as const) : ("no" as const);
  }
}

async function main() {
  console.log("\nEnvironment file");
  if (!existsSync(".env.local")) say("fail", ".env.local was not found in the project folder.");
  else {
    const keys = readFileSync(".env.local", "utf8").split("\n").map((l) => l.split("=")[0]?.trim()).filter((k) => k && !k.startsWith("#"));
    say("ok", `.env.local found; keys present: ${keys.join(", ")}`);
    const empty = ["SANITY_API_WRITE_TOKEN", "SANITY_API_READ_TOKEN"].filter((k) => !process.env[k]);
    if (empty.length) say("info", `Empty or not loaded: ${empty.join(", ")}. If you just saved a value, run the doctor again in a fresh terminal.`);
  }

  console.log("\nProject & dataset");
  if (!projectId) {
    say("fail", "NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local");
    return;
  }
  if (!/^[a-z0-9]{6,12}$/.test(projectId)) say("warn", `Project ID “${projectId}” looks unusual (expected ~8 lowercase letters/digits).`);
  say("ok", `Project ID: ${projectId}   Dataset: ${dataset}`);

  let reachable = false;
  try {
    const total = await client().fetch<number>("count(*)");
    reachable = true;
    say("ok", "Project and dataset exist and are reachable");
    say("info", `Dataset visibility: PUBLIC — published content is readable without a token (${total} document${total === 1 ? "" : "s"} now). Anonymous writes are not allowed.`);
    const seeded = await client().fetch<number>('count(*[_id == "profile"])');
    say(seeded ? "ok" : "info", seeded ? "Dataset is already seeded (a profile document exists)" : "Dataset is empty — ready to seed");
  } catch (e) {
    if (status(e) === 404) say("fail", `Dataset “${dataset}” not found for project ${projectId}. Check the dataset name in Manage → Datasets.`);
    else if (status(e) === 401 || status(e) === 403) say("warn", "Dataset is PRIVATE (anonymous reads rejected). The public site needs a read token for published content, and private datasets may require a paid plan. Recommended: keep the dataset public.");
    else say("fail", `Could not reach Sanity: ${msg(e)}`);
  }
  if (!reachable && results.some((r) => r.level === "fail")) return;

  console.log("\nCORS (Studio sign-in)");
  for (const origin of ["http://localhost:3000"]) {
    try {
      const res = await fetch(`https://${projectId}.api.sanity.io/v${API_VERSION}/users/me`, {
        method: "OPTIONS",
        headers: { Origin: origin, "Access-Control-Request-Method": "GET", "Access-Control-Request-Headers": "authorization" },
      });
      const allowed = res.headers.get("access-control-allow-origin");
      const credentials = res.headers.get("access-control-allow-credentials") === "true";
      if (allowed !== origin && allowed !== "*") say("fail", `${origin} is NOT an allowed CORS origin. Manage → API → CORS origins → Add origin.`);
      else if (!credentials) say("fail", `${origin} is allowed, but “Allow credentials” is OFF. The Studio signs in with credentials, so it will be blocked. Manage → API → CORS origins → edit ${origin} → tick “Allow credentials”.`);
      else say("ok", `${origin} is an allowed origin with credentials (Studio sign-in will work)`);
    } catch (e) {
      say("warn", `Could not test CORS: ${msg(e)}`);
    }
  }
  say("info", "Production URL: add it to CORS origins (with “Allow credentials”) when you deploy.");

  console.log("\nTokens");
  const write = env.SANITY_API_WRITE_TOKEN;
  if (!write) say("fail", "SANITY_API_WRITE_TOKEN is empty — needed once, locally, to run the seed (Editor role).");
  else {
    const w = await canWrite(write);
    if (w === "yes") say("ok", "SANITY_API_WRITE_TOKEN works and can write (dry-run test, nothing written)");
    else if (w === "invalid") say("fail", "SANITY_API_WRITE_TOKEN was rejected (typo, truncated, or revoked). Create a new one.");
    else say("fail", "SANITY_API_WRITE_TOKEN is valid but cannot write. Create it with the Editor role.");
  }

  const read = env.SANITY_API_READ_TOKEN;
  if (!read) say("info", "SANITY_API_READ_TOKEN is empty — only needed for draft Preview. The public site works without it.");
  else {
    try {
      await client(read).withConfig({ perspective: "drafts" }).fetch("count(*)");
      say("ok", "SANITY_API_READ_TOKEN works (draft read test)");
      const w = await canWrite(read);
      if (w === "yes") say("warn", "SANITY_API_READ_TOKEN can WRITE. Use a Viewer-role token for least privilege.");
      else say("ok", "SANITY_API_READ_TOKEN is read-only (least privilege)");
    } catch (e) {
      say("fail", status(e) === 401 ? "SANITY_API_READ_TOKEN was rejected. Create a new Viewer token." : `SANITY_API_READ_TOKEN test failed: ${msg(e)}`);
    }
  }

  const secret = env.SANITY_REVALIDATE_SECRET;
  if (!secret) say("info", "SANITY_REVALIDATE_SECRET is empty — only needed once the webhook is created (after deploy).");
  else say(secret.length >= 32 ? "ok" : "warn", secret.length >= 32 ? "SANITY_REVALIDATE_SECRET is set (long enough)" : "SANITY_REVALIDATE_SECRET is short; use `openssl rand -hex 32`.");

  console.log("\nSecret hygiene");
  const leaky = Object.keys(env).filter((k) => k.startsWith("NEXT_PUBLIC_") && /(TOKEN|SECRET|PASSWORD|PRIVATE)/i.test(k));
  say(leaky.length ? "fail" : "ok", leaky.length ? `Secrets exposed to the browser via: ${leaky.join(", ")} — remove the NEXT_PUBLIC_ prefix.` : "No secret is exposed through a NEXT_PUBLIC_ variable");
  try {
    execFileSync("git", ["check-ignore", "-q", ".env.local"]);
    say("ok", ".env.local is git-ignored");
  } catch {
    say("fail", ".env.local is NOT git-ignored — add `.env*` to .gitignore before committing anything.");
  }
}

main()
  .catch((e) => say("fail", `Unexpected error: ${msg(e)}`))
  .finally(() => {
    const fails = results.filter((r) => r.level === "fail").length;
    const warns = results.filter((r) => r.level === "warn").length;
    const writeOk = results.some((r) => r.level === "ok" && r.text.startsWith("SANITY_API_WRITE_TOKEN works"));
    console.log(
      `\n${fails ? "✗" : "✓"} ${fails} problem${fails === 1 ? "" : "s"}, ${warns} warning${warns === 1 ? "" : "s"}.` +
        (writeOk && !fails ? "  Ready to seed → npm run cms:seed" : "  Not ready to seed yet."),
    );
    process.exit(fails ? 1 : 0);
  });
