/**
 * Offline tests for the migration. No network, no Sanity account needed.
 * The in-memory double enforces Sanity's rule: a committed document may only reference
 * documents that are already committed (atomically, per transaction).
 *   npm run cms:test
 */
import { buildDocuments } from "./seed-docs";
import { planSeed, referencesOf, runSeed, SeedPlanError, BATCH_SIZE, type SeedDoc } from "./seed-plan";

let failures = 0;
const ok = (name: string) => console.log(`  ✓ ${name}`);
const bad = (name: string, why: string) => {
  failures++;
  console.log(`  ✗ ${name}\n      ${why}`);
};
const expect = (name: string, cond: boolean, why = "assertion failed") => (cond ? ok(name) : bad(name, why));

class FakeSanity {
  store = new Map<string, SeedDoc>();
  commits = 0;
  failOnCommit = -1; // inject a network failure on this commit number (1-based)
  fetch = async (_q: string, params: { ids: string[] }) => params.ids.filter((id) => this.store.has(id));
  transaction() {
    const ops: { kind: "create" | "replace"; doc: SeedDoc }[] = [];
    return {
      createIfNotExists: (doc: SeedDoc) => ops.push({ kind: "create", doc }),
      createOrReplace: (doc: SeedDoc) => ops.push({ kind: "replace", doc }),
      commit: async () => {
        this.commits++;
        if (this.commits === this.failOnCommit) throw new Error("network timeout (injected)");
        // Sanity validates strong references against committed documents, all-or-nothing.
        for (const { doc } of ops)
          for (const target of referencesOf(doc))
            if (!this.store.has(target))
              throw new Error(`Document "${doc._id}" references non-existent document "${target}"`);
        for (const { kind, doc } of ops) {
          if (kind === "create" && this.store.has(doc._id)) continue;
          this.store.set(doc._id, structuredClone(doc));
        }
        return { results: ops.length };
      },
    };
  }
  asClient() {
    return this as unknown as Parameters<typeof runSeed>[0];
  }
}

async function main() {
  const docs = buildDocuments();
  console.log(`\nSeed set: ${docs.length} documents`);

  console.log("\n1. Reproduce the original bug");
  {
    const fake = new FakeSanity();
    let threw: Error | null = null;
    try {
      // The original behaviour: send documents in list order, 50 per transaction.
      for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const tx = fake.transaction();
        docs.slice(i, i + BATCH_SIZE).forEach((d) => tx.createIfNotExists(d));
        await tx.commit();
      }
    } catch (e) {
      threw = e as Error;
    }
    expect(
      "list-order creation fails as reported",
      !!threw && /siteSettings.*references non-existent document "professionalLink-github"/.test(threw.message),
      `expected the reported failure, got: ${threw?.message ?? "no error"}`,
    );
    expect("the failed transaction wrote nothing", fake.store.size === 0, `store has ${fake.store.size} docs`);
  }

  console.log("\n2. Dependency-aware planning");
  {
    const plan = planSeed(docs);
    const placed = plan.groups.flatMap((g) => g.docs.map((d) => d._id));
    expect("every document is planned exactly once", placed.length === docs.length && new Set(placed).size === docs.length);
    expect("no transaction exceeds the batch size", plan.groups.every((g) => g.docs.length <= BATCH_SIZE));
    const pos = new Map(placed.map((id, i) => [id, i]));
    const violations = docs.filter((d) => referencesOf(d).some((t) => pos.get(t)! >= pos.get(d._id)!));
    expect("every reference is committed before the document that uses it", violations.length === 0, violations.map((d) => d._id).join(", "));
    expect(`all ${plan.referenceCount} references are checked`, plan.referenceCount > 0);
  }

  console.log("\n3. Fresh seed");
  const fake = new FakeSanity();
  {
    const r = await runSeed(fake.asClient(), docs);
    expect(`creates all ${docs.length} documents`, r.created === docs.length && fake.store.size === docs.length, `created ${r.created}, stored ${fake.store.size}`);
    expect("nothing is skipped on a fresh dataset", r.skipped === 0);
  }

  console.log("\n4. Idempotent re-run");
  {
    const edited = structuredClone(fake.store.get("profile")!);
    edited.headline = "CMS EDIT — must survive a re-run";
    fake.store.set("profile", edited);
    const before = JSON.stringify([...fake.store.entries()]);
    const r = await runSeed(fake.asClient(), docs);
    expect("re-run creates nothing", r.created === 0, `created ${r.created}`);
    expect("re-run skips all existing documents", r.skipped === docs.length, `skipped ${r.skipped}`);
    expect("a CMS edit is not overwritten", (fake.store.get("profile") as unknown as { headline: string }).headline === "CMS EDIT — must survive a re-run");
    expect("store is unchanged by the re-run", JSON.stringify([...fake.store.entries()]) === before);
  }

  console.log("\n5. Recovery from a mid-run failure");
  {
    const f = new FakeSanity();
    f.failOnCommit = 3;
    let failed = false;
    try {
      await runSeed(f.asClient(), docs);
    } catch (e) {
      failed = e instanceof SeedPlanError;
    }
    expect("failure is reported as a SeedPlanError", failed);
    const partial = f.store.size;
    expect("partial progress is kept (committed transactions only)", partial > 0 && partial < docs.length, `stored ${partial}`);
    f.failOnCommit = -1;
    const r = await runSeed(f.asClient(), docs);
    expect("re-run completes the seed with no duplicates", f.store.size === docs.length && r.created === docs.length - partial, `stored ${f.store.size}, created ${r.created}`);
  }

  console.log("\n6. Error reporting");
  {
    const broken: SeedDoc[] = [...docs, { _id: "project-ghost", _type: "project", category: { _type: "reference", _ref: "projectCategory-nope" } }];
    let err: SeedPlanError | null = null;
    const f = new FakeSanity();
    try {
      await runSeed(f.asClient(), broken);
    } catch (e) {
      err = e as SeedPlanError;
    }
    expect("a missing reference is caught before writing", !!err && f.store.size === 0 && f.commits === 0, `commits ${f.commits}`);
    expect("the error names the document and the missing reference", !!err && err.documentId === "project-ghost" && err.missingReference === "projectCategory-nope", err?.message);

    const cyc: SeedDoc[] = [
      { _id: "a", _type: "x", r: { _type: "reference", _ref: "b" } },
      { _id: "b", _type: "x", r: { _type: "reference", _ref: "a" } },
    ];
    let cycErr: Error | null = null;
    try {
      planSeed(cyc);
    } catch (e) {
      cycErr = e as Error;
    }
    expect("reference cycles are detected", /cycle/i.test(cycErr?.message ?? ""), cycErr?.message ?? "no error");

    const dup: SeedDoc[] = [{ _id: "same", _type: "x" }, { _id: "same", _type: "x" }];
    let dupErr: Error | null = null;
    try {
      planSeed(dup);
    } catch (e) {
      dupErr = e as Error;
    }
    expect("duplicate IDs are detected", /Duplicate document ID/.test(dupErr?.message ?? ""), dupErr?.message ?? "no error");
  }

  console.log("\n7. Force mode");
  {
    const f = new FakeSanity();
    await runSeed(f.asClient(), docs);
    const edited = structuredClone(f.store.get("profile")!);
    edited.headline = "to be replaced";
    f.store.set("profile", edited);
    const r = await runSeed(f.asClient(), docs, { force: true });
    expect("force overwrites existing documents", (f.store.get("profile") as unknown as { headline: string }).headline !== "to be replaced");
    expect("force reports replacements", r.replaced >= 1, `replaced ${r.replaced}`);
  }

  console.log(failures ? `\n✗ ${failures} test(s) failed` : "\n✓ All migration tests passed");
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
