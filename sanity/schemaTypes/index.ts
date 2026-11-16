import type { SchemaTypeDefinition } from "sanity";
import { linkObject } from "./helpers";
import { blockContent } from "./blockContent";
import { profile, siteSettings, resume } from "./singletons";
import {
  achievement, article, capabilityTheme, certificationGroup, disciplinePage, education, experience,
  professionalLink, project, projectCategory, publication, skillGroup,
} from "./collections";

export const schemaTypes: SchemaTypeDefinition[] = [
  linkObject as SchemaTypeDefinition,
  blockContent,
  profile, siteSettings, resume,
  experience, capabilityTheme, disciplinePage, project, projectCategory, skillGroup, publication,
  education, certificationGroup, achievement, article, professionalLink,
];

export const singletonTypes = ["profile", "siteSettings", "resume", "disciplinePage"];
