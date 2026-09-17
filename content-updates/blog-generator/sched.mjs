import { writeFileSync, readFileSync } from "node:fs";
import a1 from "./a1.mjs"; import a2 from "./a2.mjs"; import a3 from "./a3.mjs";
import a4 from "./a4.mjs"; import a5 from "./a5.mjs";
const A = [a1,a2,a3,a4,a5];
const S = JSON.parse(readFileSync(new URL("./schedule.json", import.meta.url),"utf8"));
const P = JSON.parse(readFileSync(new URL("./placeholders.json", import.meta.url),"utf8"));
const fmt = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"Africa/Cairo"})
    + ", " + d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Africa/Cairo"}) + " Cairo time";
};
let md = `# Publishing schedule: five SEO articles

Five articles across two weeks, one every two to three days. Publishing all
five at once is an unnatural pattern for a site this young, which is the only
reason they are spread out rather than shipped together.

Each one is already loaded with \`status = 'published'\` and a \`scheduled_at\`
timestamp, so nothing needs to be done on the day. The post stays out of the
blog list, the sitemap and the server rendered meta tags until its moment, then
appears on all of them at once. See \`shared/post-visibility.ts\` for the rule.

When a scheduled post goes live, IndexNow is notified automatically by the
claim in \`server/indexnow.ts\`, triggered at server boot and on the first
sitemap fetch after the moment passes. No manual step is needed for that.

## Order and dates

| # | Goes live | Slug | Primary keyword | Words |
|---|---|---|---|---|
`;
A.forEach((a,i)=>{
  md += `| ${i+1} | ${fmt(S[i].scheduled)} | \`${a.slug}\` | \`${a.primary}\` | ${S[i].words} |\n`;
});

md += `
The order is deliberate. Each article links back to ones already published and
never forward to one still scheduled, because a link to a post that has not
reached its date would 404. The generator enforces this.

## Per article

`;
A.forEach((a,i)=>{
  const hrefs = [...a.body.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].map(m=>({href:m[1],text:m[2]}));
  md += `### ${i+1}. ${a.titleEn}\n\n`;
  md += `- **Goes live:** ${fmt(S[i].scheduled)}\n`;
  md += `- **URL:** \`/blog/${a.slug}\`\n`;
  md += `- **Primary keyword:** \`${a.primary}\` (${S[i].primary} uses in the body)\n`;
  md += `- **Secondary:** ${a.secondary.map(x=>`\`${x}\``).join(", ")}\n`;
  md += `- **SEO title:** ${a.metaTitle} (${S[i].metaTitle} chars)\n`;
  md += `- **Meta description:** ${S[i].meta} chars\n`;
  md += `- **Length:** ${S[i].words} words, ${S[i].h2} H2 sections\n`;
  md += `- **FAQs:** ${S[i].faqs}, rendered on the page and emitted as FAQPage structured data\n`;
  md += `- **SQL file:** \`content-updates/blog-0${i+1}-${a.slug}.sql\`\n`;
  md += `- **Internal links:**\n`;
  for (const h of hrefs) {
    const kind = h.href.startsWith("/blog/") ? "article"
      : h.href.startsWith("/egypt-travel-guide/") ? "destination" : "tour";
    md += `  - ${kind}: \`${h.href}\` &mdash; anchor "${h.text}"\n`;
  }
  const mine = P.filter(p=>p.slug===a.slug);
  if (mine.length) {
    md += `- **Placeholders to fill:** ${mine.map(p=>`\`${p.key}\``).join(", ")}\n`;
  }
  md += `\n`;
});

md += `## Placeholders

Nothing below was invented. Every price and opening hour in the five articles is
a marked placeholder instead of a number that might be wrong. Search the body
for \`data-placeholder\` to find them, or use the list here.

| Article | Key | What to fill in |
|---|---|---|
`;
for (const p of P) md += `| \`${p.slug}\` | \`${p.key}\` | ${p.text} |\n`;

md += `
Two of these are not prices. \`RELATED_POST_SLUG\` and \`RELATED_POST_ANCHOR\` in
article 1 are a link to one of the 25 articles already on the site: article 1
publishes first, so it has no earlier sibling of these five to point at, and
this session could not read the live post list to choose one. Pick a Nile or
Luxor piece and replace both tokens.

## Checks worth running after each goes live

1. Open \`/blog/<slug>\` and confirm the FAQ accordion renders.
2. Paste the URL into Google's Rich Results Test and confirm both BlogPosting
   and FAQPage are detected.
3. Confirm the URL is present in \`/sitemap.xml\`.
4. Confirm no \`data-placeholder\` markers are visible on the page.
`;
writeFileSync("/home/user/iluxuryegypt-latest-june12/content-updates/publishing-schedule.md", md);
console.log("written");
