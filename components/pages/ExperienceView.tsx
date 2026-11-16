import { PageHeader } from "@/components/ui/PageHeader";
import { Wrap } from "@/components/ui/Wrap";
import { ExperienceTimeline } from "@/components/blocks/ExperienceTimeline";
import { CtaBand } from "@/components/blocks/CtaBand";
import { getExperience } from "@/lib/content";

export async function ExperienceView() {
  const jobs = await getExperience();
  return (
    <>
      <PageHeader eyebrow="Experience" title="Career history" lede="Production engineering, applied AI and research roles, newest first, with outcomes stated as measured." />
      <section className="border-b border-line">
        <Wrap className="py-12 md:py-16">
          <ExperienceTimeline jobs={jobs} />
        </Wrap>
      </section>
      <CtaBand />
    </>
  );
}
