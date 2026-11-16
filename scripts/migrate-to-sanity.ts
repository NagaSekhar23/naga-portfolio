/**
 * Copies the content in /data into your Sanity dataset. Safe to re-run.
 *
 *   npm run cms:seed -- --dry-run   → validates references and prints the commit plan (no network writes)
 *   npm run cms:seed                → creates documents that don't exist yet; never overwrites edits
 *   npm run cms:seed -- --force     → also overwrites existing documents with the /data version (destroys CMS edits)
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_API_WRITE_TOKEN
 * in .env.local. The write token is used only by this script, locally.
 */
import { createClient } from "@sanity/client";
import { buildDocuments } from "./seed-docs";
import { planSeed, runSeed, SeedPlanError, type SeedClient } from "./seed-plan";

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const dryRun = args.has("--dry-run");

async function main() {
  const docs = buildDocuments();
  let plan;
  try {
    plan = planSeed(docs);
  } catch (e) {
    if (e instanceof SeedPlanError) return fail(e);
    throw e;
  }
  const byType = docs.reduce<Record<string, number>>((m, d) => ((m[d._type] = (m[d._type] ?? 0) + 1), m), {});
  console.log(`Prepared ${docs.length} documents, ${plan.referenceCount} references (all resolve within the set).`);
  console.log("By type:", byType);
  console.log(`Commit plan: ${plan.groups.length} transactions, in dependency order:`);
  plan.groups.forEach((g, i) => {
    const types = [...new Set(g.docs.map((d) => d._type))].join(", ");
    console.log(`  ${String(i + 1).padStart(2)}. level ${g.level}  ${String(g.docs.length).padStart(2)} docs  (${types})`);
  });
  if (dryRun) return console.log("\nDry run: nothing was written.");

  const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset = "production", SANITY_API_WRITE_TOKEN: token } = process.env;
  if (!projectId || !token) {
    console.error("✗ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local");
    process.exit(1);
  }
  if (force) console.log("\n⚠ --force: existing documents will be overwritten with the /data version.");

  const client = createClient({ projectId, dataset, token, apiVersion: "2026-01-01", useCdn: false });
  console.log(`\nSeeding ${projectId}/${dataset}…`);
  try {
    const r = await runSeed(client as unknown as SeedClient, docs, { force, log: (l) => console.log(l) });
    console.log(`\n✓ Done. created ${r.created}, already present ${r.skipped}${force ? `, replaced ${r.replaced}` : ""} (${r.groups} transactions).`);
    console.log("Next: npm run cms:doctor, then open /studio.");
  } catch (e) {
    if (e instanceof SeedPlanError) return fail(e);
    throw e;
  }
}

function fail(e: SeedPlanError): never {
  console.error(`\n✗ ${e.message}`);
  if (e.documentId) console.error(`  document:  ${e.documentId}`);
  if (e.missingReference) console.error(`  missing:   ${e.missingReference}`);
  console.error("  Nothing from the failing transaction was written. Re-running is safe.");
  process.exit(1);
}

main().catch((e) => {
  console.error("✗ Migration failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
