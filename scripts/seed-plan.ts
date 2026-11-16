/**
 * Dependency-aware seeding for Sanity.
 *
 * Why this exists: Sanity rejects a document whose strong reference points at a document
 * that does not exist yet ("Document X references non-existent document Y"). Creation
 * order therefore matters. This module:
 *   1. collects every reference in the documents and checks each target exists in the set,
 *   2. assigns each document a "level" (0 = no references; otherwise 1 + the highest level
 *      of anything it references, so targets always come first),
 *   3. commits level by level, in batches, so a document is only sent after everything it
 *      references has been committed in an earlier transaction,
 *   4. skips documents that already exist (never overwrites) unless `force` is set,
 *   5. reports failures with the document ID and the missing reference.
 */

export type SeedDoc = { _id: string; _type: string; [key: string]: unknown };

export class SeedPlanError extends Error {
  constructor(message: string, readonly documentId?: string, readonly missingReference?: string) {
    super(message);
    this.name = "SeedPlanError";
  }
}

/** Minimal client surface used here (satisfied by @sanity/client and by the test double). */
export interface SeedClient {
  fetch<T>(query: string, params?: Record<string, unknown>): Promise<T>;
  transaction(): {
    createIfNotExists(doc: SeedDoc): unknown;
    createOrReplace(doc: SeedDoc): unknown;
    commit(): Promise<unknown>;
  };
}

export const BATCH_SIZE = 50;

/** Every `_ref` target found anywhere inside a document (at any depth). */
export function referencesOf(doc: SeedDoc): string[] {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (o._type === "reference" && typeof o._ref === "string") out.push(o._ref);
      Object.values(o).forEach(walk);
    }
  };
  Object.entries(doc).forEach(([k, v]) => k !== "_id" && walk(v));
  return out;
}

export interface Plan {
  /** Commit groups in the order they must be sent. Each group is ≤ BATCH_SIZE documents. */
  groups: { level: number; docs: SeedDoc[] }[];
  /** Total number of references checked. */
  referenceCount: number;
}

/** Validates references and orders documents. Throws SeedPlanError before anything is written. */
export function planSeed(docs: SeedDoc[]): Plan {
  const byId = new Map<string, { doc: SeedDoc; index: number }>();
  docs.forEach((doc, index) => {
    if (byId.has(doc._id)) throw new SeedPlanError(`Duplicate document ID "${doc._id}"`, doc._id);
    byId.set(doc._id, { doc, index });
  });

  let referenceCount = 0;
  for (const { doc } of byId.values()) {
    for (const target of referencesOf(doc)) {
      referenceCount++;
      if (!byId.has(target)) {
        throw new SeedPlanError(
          `Document "${doc._id}" (${doc._type}) references "${target}", which is not in the seed set. Add that document or fix the reference.`,
          doc._id,
          target,
        );
      }
    }
  }

  const levels = new Map<string, number>();
  const visiting = new Set<string>();
  const levelOf = (id: string): number => {
    const known = levels.get(id);
    if (known !== undefined) return known;
    if (visiting.has(id)) throw new SeedPlanError(`Reference cycle involving "${id}"`, id);
    visiting.add(id);
    const deps = referencesOf(byId.get(id)!.doc);
    const level = deps.length ? 1 + Math.max(...deps.map(levelOf)) : 0;
    visiting.delete(id);
    levels.set(id, level);
    return level;
  };
  for (const id of byId.keys()) levelOf(id);

  const ordered = [...byId.values()].sort(
    (a, b) => levels.get(a.doc._id)! - levels.get(b.doc._id)! || a.index - b.index,
  );
  const groups: Plan["groups"] = [];
  for (const { doc } of ordered) {
    const level = levels.get(doc._id)!;
    const last = groups[groups.length - 1];
    if (last && last.level === level && last.docs.length < BATCH_SIZE) last.docs.push(doc);
    else groups.push({ level, docs: [doc] });
  }
  return { groups, referenceCount };
}

export interface SeedResult {
  created: number;
  skipped: number;
  replaced: number;
  groups: number;
}

/** Sanity-style message → the document and missing reference it names. */
export function explainCommitError(error: unknown, group: SeedDoc[]): SeedPlanError {
  const message = error instanceof Error ? error.message : String(error);
  const m = message.match(/Document "([^"]+)" references non-existent document "([^"]+)"/);
  if (m) {
    return new SeedPlanError(
      `Sanity rejected document "${m[1]}" because it references "${m[2]}", which does not exist yet. This should not happen with the planned order; check the reference and the commit order.`,
      m[1],
      m[2],
    );
  }
  const ids = group.map((d) => d._id);
  const shown = ids.length > 6 ? `${ids.slice(0, 6).join(", ")} … (+${ids.length - 6} more)` : ids.join(", ");
  return new SeedPlanError(`Commit failed for documents [${shown}]: ${message}`, ids[0]);
}

/** Existing IDs among `ids`, checked in chunks. */
async function existingIds(client: SeedClient, ids: string[]): Promise<Set<string>> {
  const found = new Set<string>();
  for (let i = 0; i < ids.length; i += 500) {
    const chunk = ids.slice(i, i + 500);
    const rows = await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: chunk });
    rows.forEach((r) => found.add(r));
  }
  return found;
}

export async function runSeed(
  client: SeedClient,
  docs: SeedDoc[],
  opts: { force?: boolean; log?: (line: string) => void } = {},
): Promise<SeedResult> {
  const log = opts.log ?? (() => {});
  const plan = planSeed(docs); // throws before any write if the set is inconsistent
  const present = await existingIds(client, docs.map((d) => d._id));
  const result: SeedResult = { created: 0, skipped: 0, replaced: 0, groups: plan.groups.length };

  let done = 0;
  for (const group of plan.groups) {
    const todo = opts.force ? group.docs : group.docs.filter((d) => !present.has(d._id));
    result.skipped += group.docs.length - todo.length;
    if (todo.length === 0) {
      done += group.docs.length;
      continue;
    }
    const tx = client.transaction();
    for (const d of todo) {
      if (opts.force) tx.createOrReplace(d);
      else tx.createIfNotExists(d);
    }
    try {
      await tx.commit();
    } catch (error) {
      throw explainCommitError(error, todo);
    }
    if (opts.force) result.replaced += todo.filter((d) => present.has(d._id)).length;
    result.created += todo.filter((d) => !present.has(d._id)).length;
    done += group.docs.length;
    log(`  level ${group.level}: ${done}/${docs.length} documents processed (${todo.map((d) => d._type).filter((v, i, a) => a.indexOf(v) === i).join(", ")})`);
  }
  return result;
}
