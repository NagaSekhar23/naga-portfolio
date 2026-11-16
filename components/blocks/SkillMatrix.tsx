import type { SkillGroup } from "@/data/types";

export function SkillMatrix({ groups }: { groups: SkillGroup[] }) {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {groups.map((g) => (
        <div key={g.id} className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-10">
          <dt className="text-sm font-semibold tracking-tight">{g.title}</dt>
          <dd className="flex flex-wrap gap-x-2 gap-y-1.5 text-[15px] leading-relaxed text-muted">
            {g.skills.map((s, i) => (
              <span key={s}>
                {s}
                {i < g.skills.length - 1 && <span aria-hidden="true" className="ml-2 text-line-strong">/</span>}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
