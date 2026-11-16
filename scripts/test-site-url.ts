/** Offline tests for the centralised site URL. Run: npm run seo:test */
import { canonicalUrl, siteUrl } from "../lib/site-url";

let failures = 0;
const expect = (name: string, got: string, want: string) => {
  if (got === want) console.log(`  ✓ ${name}`);
  else { failures++; console.log(`  ✗ ${name}: got ${got}, want ${want}`); }
};
const env = process.env as Record<string, string | undefined>;
const saved = { site: env.NEXT_PUBLIC_SITE_URL, vercel: env.VERCEL_URL };

console.log("Site URL configuration");
delete env.NEXT_PUBLIC_SITE_URL; delete env.VERCEL_URL;
expect("falls back to localhost without config", siteUrl(), "http://localhost:3000");
env.VERCEL_URL = "naga-portfolio.vercel.app";
expect("uses the Vercel deployment URL when no domain is set", siteUrl(), "https://naga-portfolio.vercel.app");
env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
expect("NEXT_PUBLIC_SITE_URL wins and drops a trailing slash", siteUrl(), "https://example.com");

console.log("Canonical and og:url paths");
expect("home has no trailing path", canonicalUrl("/"), "https://example.com");
expect("section path", canonicalUrl("/about"), "https://example.com/about");
expect("dynamic project path", canonicalUrl("/projects/managerlens"), "https://example.com/projects/managerlens");
expect("path without leading slash is normalised", canonicalUrl("research"), "https://example.com/research");

if (saved.site) env.NEXT_PUBLIC_SITE_URL = saved.site; else delete env.NEXT_PUBLIC_SITE_URL;
if (saved.vercel) env.VERCEL_URL = saved.vercel; else delete env.VERCEL_URL;
console.log(failures ? `\n✗ ${failures} failed` : "\n✓ Site URL tests passed");
process.exit(failures ? 1 : 0);
