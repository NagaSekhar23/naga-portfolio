"use client";

import { useCallback, useEffect, useState } from "react";
import { definePlugin, useClient, useCurrentUser } from "sanity";
import { IntentLink } from "sanity/router";
import { Badge, Box, Button, Card, Container, Flex, Grid, Heading, Stack, Text } from "@sanity/ui";
import { HomeIcon } from "@sanity/icons/Home";
import { apiVersion } from "../env";

interface Counts {
  projects: number;
  experience: number;
  publications: number;
  articles: number;
  education: number;
  certifications: number;
  achievements: number;
  links: number;
  skills: number;
  drafts: number;
}
interface Row {
  _id: string;
  _type: string;
  title: string;
  _updatedAt: string;
  isDraft?: boolean;
}

const PUBLISHED = '!(_id in path("drafts.**"))';
const TITLE = 'coalesce(title, role, degree, label, name, "Untitled")';

const COUNTS_QUERY = `{
  "projects": count(*[_type == "project" && ${PUBLISHED}]),
  "experience": count(*[_type == "experience" && ${PUBLISHED}]),
  "publications": count(*[_type == "publication" && ${PUBLISHED}]),
  "articles": count(*[_type == "article" && ${PUBLISHED}]),
  "education": count(*[_type == "education" && ${PUBLISHED}]),
  "certifications": count(*[_type == "certificationGroup" && ${PUBLISHED}]),
  "achievements": count(*[_type == "achievement" && ${PUBLISHED}]),
  "links": count(*[_type == "professionalLink" && ${PUBLISHED}]),
  "skills": count(*[_type == "skillGroup" && ${PUBLISHED}]),
  "drafts": count(*[_id in path("drafts.**")])
}`;
const DRAFTS_QUERY = `*[_id in path("drafts.**")] | order(_updatedAt desc)[0...8]{ _id, _type, "title": ${TITLE}, _updatedAt }`;
const RECENT_QUERY = `*[_type in ["project","experience","publication","article","education","certificationGroup","achievement","professionalLink","skillGroup","capabilityTheme","disciplinePage","profile","siteSettings","resume"] && ${PUBLISHED}] | order(_updatedAt desc)[0...8]{ _id, _type, "title": ${TITLE}, _updatedAt }`;

const published = (id: string) => id.replace(/^drafts\./, "");
const ago = (iso: string) => {
  const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} d ago`;
};
const TYPE_LABEL: Record<string, string> = {
  project: "Project", experience: "Experience", publication: "Publication", article: "Article", education: "Education",
  certificationGroup: "Certifications", achievement: "Achievement", professionalLink: "Link", skillGroup: "Skills",
  capabilityTheme: "Capability theme", disciplinePage: "Discipline page", profile: "Profile", siteSettings: "Site settings", resume: "Resume",
};

function Tile({ label, value, href }: { label: string; value: number | string; href: string }) {
  return (
    <Card as="a" href={href} padding={4} border radius={1} tone="default" style={{ textDecoration: "none" }}>
      <Stack gap={3}>
        <Text size={1} muted>{label}</Text>
        <Heading size={4}>{value}</Heading>
      </Stack>
    </Card>
  );
}

function DocList({ title, rows, empty }: { title: string; rows: Row[] | null; empty: string }) {
  return (
    <Card border radius={1} padding={4}>
      <Stack gap={4}>
        <Heading size={1}>{title}</Heading>
        {rows === null ? (
          <Text size={1} muted>Loading…</Text>
        ) : rows.length === 0 ? (
          <Text size={1} muted>{empty}</Text>
        ) : (
          <Stack gap={1}>
            {rows.map((r) => (
              <IntentLink key={r._id} intent="edit" params={{ id: published(r._id), type: r._type }} style={{ textDecoration: "none", color: "inherit" }}>
                <Card padding={3} radius={1} as="span" tone="default" style={{ display: "block" }}>
                  <Flex justify="space-between" align="center" gap={3}>
                    <Stack gap={2}>
                      <Text size={1} weight="medium">{r.title}</Text>
                      <Text size={0} muted>{TYPE_LABEL[r._type] ?? r._type} · {ago(r._updatedAt)}</Text>
                    </Stack>
                  </Flex>
                </Card>
              </IntentLink>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

function Overview() {
  const client = useClient({ apiVersion });
  const user = useCurrentUser();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [drafts, setDrafts] = useState<Row[] | null>(null);
  const [recent, setRecent] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    () => Promise.all([client.fetch<Counts>(COUNTS_QUERY), client.fetch<Row[]>(DRAFTS_QUERY), client.fetch<Row[]>(RECENT_QUERY)]),
    [client],
  );
  const apply = ([c, d, r]: [Counts, Row[], Row[]]) => {
    setCounts(c);
    setDrafts(d);
    setRecent(r);
    setError(null);
  };

  useEffect(() => {
    let cancelled = false;
    fetchData()
      .then((res) => !cancelled && apply(res))
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  const load = () => {
    setError(null);
    fetchData().then(apply).catch((e: Error) => setError(e.message));
  };

  const first = user?.name?.split(" ")[0];
  const base = "/studio/structure";

  return (
    <Box padding={[4, 5, 6]} style={{ height: "100%", overflow: "auto" }}>
      <Container width={3}>
        <Stack gap={6}>
          <Flex justify="space-between" align="flex-end" wrap="wrap" gap={4}>
            <Stack gap={3}>
              <Text size={1} muted>Workspace overview</Text>
              <Heading size={5}>{first ? `Welcome back, ${first}` : "Welcome back"}</Heading>
              <Text muted size={2}>Everything on the public website is edited here. Publish to make changes live.</Text>
            </Stack>
            <Flex gap={2}>
              <Button as="a" href="/" target="_blank" rel="noopener noreferrer" text="View site" mode="ghost" />
              <Button as="a" href="/studio/presentation" text="Preview drafts" tone="primary" />
              <Button text="Refresh" mode="bleed" onClick={load} />
            </Flex>
          </Flex>

          {error && <Card tone="critical" padding={4} border radius={1}><Text size={1}>Couldn’t load overview data: {error}</Text></Card>}

          <Grid gridTemplateColumns={[2, 3, 5]} gap={3}>
            <Tile label="Projects" value={counts?.projects ?? "–"} href={`${base}/projects`} />
            <Tile label="Roles" value={counts?.experience ?? "–"} href={`${base}/experience`} />
            <Tile label="Publications" value={counts?.publications ?? "–"} href={`${base}/publications`} />
            <Tile label="Articles" value={counts?.articles ?? "–"} href={`${base}/articles`} />
            <Tile label="Unpublished drafts" value={counts?.drafts ?? "–"} href={`${base}`} />
          </Grid>

          <Grid gridTemplateColumns={[1, 1, 2]} gap={4}>
            <DocList title="Needs publishing" rows={drafts} empty="No drafts — everything is published." />
            <DocList title="Recently published" rows={recent} empty="Nothing published yet." />
          </Grid>

          <Card border radius={1} padding={4}>
            <Stack gap={4}>
              <Heading size={1}>Quick actions</Heading>
              <Flex gap={2} wrap="wrap">
                <IntentLink intent="create" params={{ type: "project" }} style={{ textDecoration: "none" }}>
                  <Button as="span" text="New project" icon={HomeIcon} mode="ghost" />
                </IntentLink>
                <IntentLink intent="create" params={{ type: "article" }} style={{ textDecoration: "none" }}>
                  <Button as="span" text="New article" mode="ghost" />
                </IntentLink>
                <IntentLink intent="create" params={{ type: "publication" }} style={{ textDecoration: "none" }}>
                  <Button as="span" text="New publication" mode="ghost" />
                </IntentLink>
                <IntentLink intent="edit" params={{ id: "resume", type: "resume" }} style={{ textDecoration: "none" }}>
                  <Button as="span" text="Replace resume" mode="ghost" />
                </IntentLink>
                <IntentLink intent="edit" params={{ id: "profile", type: "profile" }} style={{ textDecoration: "none" }}>
                  <Button as="span" text="Edit home & profile" mode="ghost" />
                </IntentLink>
              </Flex>
              <Flex gap={2} wrap="wrap" align="center">
                <Badge tone="primary">Tip</Badge>
                <Text size={1} muted>Use the Content tab’s sidebar to browse by page. Drag rows to reorder lists.</Text>
              </Flex>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

/** Adds an "Overview" tool and makes it the Studio's landing screen. */
export const overviewTool = definePlugin({
  name: "overview-tool",
  tools: (prev) => [{ name: "overview", title: "Overview", icon: HomeIcon, component: Overview }, ...prev],
});
