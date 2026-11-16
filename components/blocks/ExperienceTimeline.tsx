import type { ExperienceItem } from "@/data/types";
import { TagList } from "@/components/ui/Tag";

/** Career history: date rail on the left, role and outcomes on the right. */
export function ExperienceTimeline({ jobs }: { jobs: ExperienceItem[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {jobs.map((job, i) => (
        <li key={job.id} className="reveal grid gap-5 py-10 md:grid-cols-[10rem_1fr] md:gap-12">
          <p className="font-mono text-xs leading-relaxed text-muted md:pt-1.5">
            <span className="block text-foreground">{job.start === job.end ? job.start : `${job.start} –`}</span>
            {job.start !== job.end && <span className={i === 0 ? "text-accent" : ""}>{job.end}</span>}
            {job.type && <span className="mt-2 block text-subtle">{job.type}</span>}
          </p>
          <article>
            <h3 className="text-xl font-semibold leading-snug tracking-tight">{job.role}</h3>
            <p className="mt-1 text-muted">
              {job.company}
              {job.location && <span className="text-subtle"> · {job.location}</span>}
            </p>
            {job.context && <p className="mt-3 max-w-2xl text-[15px] italic leading-relaxed text-muted">{job.context}</p>}
            <ul className="mt-6 max-w-3xl space-y-3 text-[15px] leading-[1.7]">
              {job.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-accent" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <TagList items={job.tech} label={`Technologies used at ${job.company}`} />
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
