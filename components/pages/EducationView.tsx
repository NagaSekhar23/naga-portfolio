import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { getAchievements, getCertificationGroups, getCoursework, getEducation } from "@/lib/content";

export async function EducationView() {
  const [edu, coursework, certs, achievements] = await Promise.all([getEducation(), getCoursework(), getCertificationGroups(), getAchievements()]);
  return (
    <>
      <PageHeader eyebrow="Education" title="Education, credentials and recognition" lede="Degrees, professional certifications, and awards." />

      <Section id="degrees" label="Degrees" title="Academic background">
        <ul className="divide-y divide-line border-y border-line">
          {edu.map((e) => (
            <li key={e.id} className="reveal grid gap-4 py-9 md:grid-cols-[10rem_1fr] md:gap-12">
              <p className="font-mono text-xs text-muted md:pt-1.5">{e.graduated}</p>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{e.degree}</h3>
                <p className="mt-1">{e.institution} <span className="text-subtle">· {e.location}</span></p>
                {e.gpa && <p className="mt-1 text-sm text-muted">GPA {e.gpa}</p>}
                {e.notes?.map((n) => <p key={n} className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{n}</p>)}
              </div>
            </li>
          ))}
        </ul>
        {coursework.length > 0 && (
          <div className="mt-10">
            <h3 className="label">Selected coursework</h3>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">{coursework.join("  /  ")}</p>
          </div>
        )}
      </Section>

      <Section id="certifications" label="Credentials" title="Certifications" tone="sunken">
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {certs.map((g) => (
            <section key={g.id} aria-labelledby={`cert-${g.id}`}>
              <h3 id={`cert-${g.id}`} className="label border-b border-line pb-3">{g.title}</h3>
              <ul className="divide-y divide-line">
                {g.items.map((c) => (
                  <li key={c.name} className="py-3.5">
                    <p className="font-medium leading-snug">{c.name}</p>
                    {c.issuer && <p className="text-sm text-muted">{c.issuer}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <Section id="recognition" label="Recognition" title="Achievements & awards">
        <ul className="divide-y divide-line border-y border-line">
          {achievements.map((a) => (
            <li key={a.id} className="reveal grid gap-1 py-6 md:grid-cols-[10rem_1fr] md:gap-12">
              <p className="font-mono text-xs text-muted md:pt-1">{a.year ?? ""}</p>
              <div>
                <h3 className="font-semibold leading-snug tracking-tight">{a.title}</h3>
                {a.detail && <p className="mt-1 text-sm text-muted">{a.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand />
    </>
  );
}
