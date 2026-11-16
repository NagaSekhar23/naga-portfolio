import { defineField } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";

/** Drag-and-drop ordering field for list-type documents. */
export const orderable = (type: string) =>
  orderRankField({ type, hidden: true });

export const stringList = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [{ type: "string" }],
  });

/** Labeled external link (label + URL, https only). */
export const linkObject = {
  name: "linkItem",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (r) => r.required().uri({ scheme: ["https", "http", "mailto"] }),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
};
