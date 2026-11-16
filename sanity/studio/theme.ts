import { buildLegacyTheme } from "sanity";

/** Studio theme aligned with the public site's "Signal" palette (light + dark handled by Sanity). */
export const studioTheme = buildLegacyTheme({
  "--black": "#0f1012",
  "--white": "#fbfbf9",
  "--gray": "#84868c",
  "--gray-base": "#84868c",
  "--component-bg": "#fbfbf9",
  "--component-text-color": "#0f1012",
  "--brand-primary": "#2a3cf0",
  "--default-button-color": "#55575d",
  "--default-button-primary-color": "#2a3cf0",
  "--default-button-success-color": "#1f7a4d",
  "--default-button-warning-color": "#b86e00",
  "--default-button-danger-color": "#c4302b",
  "--state-info-color": "#2a3cf0",
  "--state-success-color": "#1f7a4d",
  "--state-warning-color": "#b86e00",
  "--state-danger-color": "#c4302b",
  "--main-navigation-color": "#0f1012",
  "--main-navigation-color--inverted": "#fbfbf9",
  "--focus-color": "#2a3cf0",
  "--font-family-base": 'var(--font-geist-sans), -apple-system, "Segoe UI", system-ui, sans-serif',
  "--font-family-monospace": 'var(--font-geist-mono), ui-monospace, "SF Mono", Menlo, monospace',
});
