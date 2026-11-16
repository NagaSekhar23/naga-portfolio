import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { AddCircleIcon } from "@sanity/icons/AddCircle";
import { BookIcon } from "@sanity/icons/Book";
import { CaseIcon } from "@sanity/icons/Case";
import { CodeBlockIcon } from "@sanity/icons/CodeBlock";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { HomeIcon } from "@sanity/icons/Home";
import { LinkIcon } from "@sanity/icons/Link";
import { ProjectsIcon } from "@sanity/icons/Projects";
import { StarIcon } from "@sanity/icons/Star";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import { DocumentPdfIcon } from "@sanity/icons/DocumentPdf";
import { ThListIcon } from "@sanity/icons/ThList";

type S = StructureBuilder;

const singleton = (S: S, type: string, id: string, title: string, icon: typeof HomeIcon) =>
  S.listItem().id(id).title(title).icon(icon).child(S.document().schemaType(type).documentId(id).title(title));

const projectViews = (S: S, context: Parameters<StructureResolver>[1]) =>
  S.listItem().id("projects").title("Projects").icon(ProjectsIcon).child(
    S.list().title("Projects").items([
      orderableDocumentListDeskItem({ type: "project", id: "projects-ordered", title: "All projects (drag to reorder)", S, context }),
      S.listItem().id("projects-browse").title("Browse & sort").icon(ThListIcon).child(S.documentTypeList("project").title("Browse & sort")),
      S.listItem().id("projects-featured").title("Featured").icon(StarIcon).child(
        S.documentList().title("Featured projects").filter('_type == "project" && featured == true').defaultOrdering([{ field: "orderRank", direction: "asc" }]),
      ),
      S.listItem().id("projects-in-progress").title("In progress").child(
        S.documentList().title("In progress").filter('_type == "project" && status == "In Progress"'),
      ),
      S.listItem().id("projects-live").title("Live").child(S.documentList().title("Live").filter('_type == "project" && status == "Live"')),
      S.listItem().id("projects-by-category").title("By category").icon(TagIcon).child(
        S.documentTypeList("projectCategory").title("Categories").child((categoryId) =>
          S.documentList().title("Projects").filter('_type == "project" && category._ref == $categoryId').params({ categoryId }),
        ),
      ),
      S.divider(),
      orderableDocumentListDeskItem({ type: "projectCategory", id: "project-categories", title: "Project categories", S, context }),
    ]),
  );

const publicationViews = (S: S, context: Parameters<StructureResolver>[1]) => {
  const byType = (id: string, title: string, type: string) =>
    S.listItem().id(id).title(title).child(S.documentList().title(title).filter('_type == "publication" && type == $type').params({ type }));
  return S.listItem().id("publications").title("Research & publications").icon(BookIcon).child(
    S.list().title("Research & publications").items([
      orderableDocumentListDeskItem({ type: "publication", id: "publications-ordered", title: "All (drag to reorder)", S, context }),
      S.listItem().id("publications-browse").title("Browse & sort").icon(ThListIcon).child(S.documentTypeList("publication").title("Browse & sort")),
      S.divider(),
      byType("pub-journal", "Journal articles", "journal"),
      byType("pub-conference", "Conference papers", "conference"),
      byType("pub-dataset", "Datasets", "dataset"),
      byType("pub-book", "Books", "book"),
      byType("pub-patent", "Patent applications", "patent"),
      byType("pub-research", "Other research", "research"),
    ]),
  );
};

/** Sidebar organised by the public website's pages. */
export const structure: StructureResolver = (S, context) =>
  S.list().id("content").title("Content").items([
    S.listItem().id("group-identity").title("Identity & site").icon(HomeIcon).child(
      S.list().title("Identity & site").items([
        singleton(S, "profile", "profile", "Home & profile", UserIcon),
        singleton(S, "siteSettings", "siteSettings", "Site settings", CogIcon),
        singleton(S, "resume", "resume", "Resume (PDF upload)", DocumentPdfIcon),
        orderableDocumentListDeskItem({ type: "professionalLink", id: "links", title: "Professional links", S, context }),
      ]),
    ),
    S.listItem().id("group-pages").title("Discipline pages").icon(CodeBlockIcon).child(
      S.list().title("Discipline pages").items([
        singleton(S, "disciplinePage", "disciplinePage-engineering", "Engineering page", CodeBlockIcon),
        singleton(S, "disciplinePage", "disciplinePage-applied-ai", "Applied AI page", CodeBlockIcon),
        singleton(S, "disciplinePage", "disciplinePage-data-ml", "Data & ML page", CodeBlockIcon),
        S.divider(),
        orderableDocumentListDeskItem({ type: "capabilityTheme", id: "themes", title: "Capability themes (all pages)", S, context }),
        orderableDocumentListDeskItem({ type: "skillGroup", id: "skills", title: "Skills", S, context }),
      ]),
    ),
    projectViews(S, context),
    publicationViews(S, context),
    S.divider(),
    orderableDocumentListDeskItem({ type: "experience", id: "experience", title: "Experience", icon: CaseIcon, S, context }),
    S.listItem().id("group-education").title("Education & credentials").icon(DocumentsIcon).child(
      S.list().title("Education & credentials").items([
        orderableDocumentListDeskItem({ type: "education", id: "education", title: "Education", S, context }),
        orderableDocumentListDeskItem({ type: "certificationGroup", id: "certifications", title: "Certifications", S, context }),
        orderableDocumentListDeskItem({ type: "achievement", id: "achievements", title: "Achievements", S, context }),
      ]),
    ),
    S.listItem().id("articles").title("Writing").icon(DocumentIcon).child(
      S.documentTypeList("article").title("Writing").defaultOrdering([{ field: "date", direction: "desc" }]),
    ),
    S.divider(),
    S.listItem().id("new").title("Quick create").icon(AddCircleIcon).child(
      S.list().title("Quick create").items([
        S.listItem().title("New project").icon(ProjectsIcon).child(S.defaultDocument({ schemaType: "project" })),
        S.listItem().title("New article").icon(DocumentIcon).child(S.defaultDocument({ schemaType: "article" })),
        S.listItem().title("New publication").icon(BookIcon).child(S.defaultDocument({ schemaType: "publication" })),
        S.listItem().title("New link").icon(LinkIcon).child(S.defaultDocument({ schemaType: "professionalLink" })),
      ]),
    ),
  ]);
