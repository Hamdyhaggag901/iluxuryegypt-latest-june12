// The brochure API, driven through a real Express app against a real database.
//
// Resend is stubbed at the module boundary rather than mocked inside the
// route, so what is asserted is what the route actually hands to the mailer:
// two messages, the attachment on one, replyTo on the other, and the alert
// still going out when the lead's copy throws.
//
//   DATABASE_URL=... npx tsx scripts/test-brochure-api.ts

import { ENV_REPORT } from "./lib/script-env";
void ENV_REPORT;

import express from "express";
import type { AddressInfo } from "net";

// Resend is intercepted at fetch, not at the module boundary: an ES module
// namespace is frozen and cannot be reassigned, and going through the real SDK
// means these assertions run against the actual wire payload rather than
// against a shape this test invented. Note the SDK sends `reply_to`, so that
// is what is checked.
interface Sent {
  to: string;
  subject: string;
  reply_to?: string;
  attachments?: Array<{ filename?: string; content?: string }>;
  text?: string;
  html?: string;
}
const sent: Sent[] = [];
let failLeadEmail = false;

const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (!url.includes("api.resend.com")) return realFetch(input as RequestInfo, init);

  const body = JSON.parse(String(init?.body ?? "{}")) as Sent;
  if (failLeadEmail && !String(body.subject).startsWith("New brochure download")) {
    return new Response(JSON.stringify({ statusCode: 422, message: "Attachment rejected", name: "validation_error" }), {
      status: 422, headers: { "content-type": "application/json" },
    });
  }
  sent.push(body);
  return new Response(JSON.stringify({ id: "stub-id" }), { status: 200, headers: { "content-type": "application/json" } });
}) as typeof fetch;

process.env.RESEND_API_KEY ||= "stub-key-for-tests";

const { storage } = await import("../server/storage");
const { registerRoutes } = await import("../server/routes");

let fails = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) fails++; console.log(`${c ? "PASS" : "FAIL"}  ${n}${d ? "  " + d : ""}`); };

const app = express();
app.use(express.json());
await registerRoutes(app);
const server = app.listen(0);
const port = (server.address() as AddressInfo).port;
const base = `http://127.0.0.1:${port}`;

const post = (body: unknown, ip = "203.0.113.10") =>
  fetch(`${base}/api/brochure/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });

const SLUG = "egypt-small-group-tour";

console.log("\n=== 4. Validation returns 400 with a message per field ===\n");
{
  const empty = await post({ name: "  ", email: "real@example.com", tourSlug: SLUG });
  const emptyBody = await empty.json();
  ok("an empty name is a 400", empty.status === 400, String(empty.status));
  ok("and names the name field", emptyBody.field === "name", JSON.stringify(emptyBody.message));

  const bad = await post({ name: "Jane Traveller", email: "not-an-email", tourSlug: SLUG });
  const badBody = await bad.json();
  ok("a malformed email is a 400", bad.status === 400, String(bad.status));
  ok("and names the email field", badBody.field === "email", JSON.stringify(badBody.message));

  ok("the two messages are different, not one generic one", emptyBody.message !== badBody.message);
  ok("neither message is generic", !/invalid request/i.test(emptyBody.message + badBody.message));

  // A few shapes that must not slip through a loose pattern.
  for (const addr of ["jane@", "@example.com", "jane@example", "jane doe@example.com", "jane@.com"]) {
    const r = await post({ name: "Jane", email: addr, tourSlug: SLUG });
    ok(`"${addr}" is rejected`, r.status === 400, String(r.status));
  }
}

console.log("\n=== 5. A valid request inserts exactly one row ===\n");
{
  const before = (await storage.getBrochureDownloads()).length;
  const res = await post({ name: "Jane Traveller", email: "jane@example.com", tourSlug: SLUG, travellerType: "A travel advisor" });
  const body = await res.json();
  ok("the request succeeds", res.status === 200 && body.ok === true, String(res.status));
  ok("and returns a download URL for this tour", String(body.url).startsWith(`/api/brochure/download/${SLUG}`), body.url);

  const rows = await storage.getBrochureDownloads();
  ok("exactly one row was added", rows.length === before + 1, `${before} -> ${rows.length}`);
  const row = rows[0];
  ok("the row carries the name", row.name === "Jane Traveller", row.name);
  ok("the row carries the traveller type", row.travellerType === "A travel advisor", row.travellerType);
  ok("the row carries the email and the tour", row.email === "jane@example.com" && row.tourSlug === SLUG);
}

console.log("\n=== 6. Two emails, and the alert survives the lead email failing ===\n");
async function waitForEmails(count: number, ms = 60000): Promise<void> {
  const until = Date.now() + ms;
  while (sent.length < count && Date.now() < until) await new Promise((r) => setTimeout(r, 200));
}
{
  await waitForEmails(2);
  ok("two emails were queued", sent.length === 2, `${sent.length}`);

  const lead = sent.find((m) => m.to === "jane@example.com");
  const alert = sent.find((m) => m.to === "travel@iluxuryegypt.com");
  ok("one went to the lead", Boolean(lead));
  ok("one went to travel@iluxuryegypt.com", Boolean(alert));
  ok("the lead's copy has the PDF attached", (lead?.attachments ?? []).length === 1);
  const attachment = (lead?.attachments ?? [])[0] as { filename?: string; content?: string } | undefined;
  ok("the attachment is this tour's PDF", attachment?.filename === `${SLUG}.pdf`, attachment?.filename);
  ok("and the attachment is a real PDF",
     Buffer.from(attachment?.content ?? "", "base64").subarray(0, 4).toString() === "%PDF");

  ok("the alert subject names the lead", alert?.subject === "New brochure download: Jane Traveller", alert?.subject);
  ok("the alert replies to the lead, not to us", alert?.reply_to === "jane@example.com", String(alert?.reply_to));
  ok("the alert has no attachment", !alert?.attachments || alert.attachments.length === 0);
  ok("the alert is plain text with no markup", typeof alert?.text === "string" && !alert?.html);
  for (const line of ["Name: Jane Traveller", "Email: jane@example.com", "Travelling as: A travel advisor", "Tour:", "(Africa/Cairo)"]) {
    ok(`the alert body has "${line}"`, (alert?.text ?? "").includes(line));
  }

  // A lead who skipped the optional field must still read cleanly.
  sent.length = 0;
  await post({ name: "Sam Guest", email: "sam@example.com", tourSlug: SLUG }, "203.0.113.11");
  await waitForEmails(2);
  const alert2 = sent.find((m) => m.to === "travel@iluxuryegypt.com");
  ok('a missing traveller type reads "not stated"', (alert2?.text ?? "").includes("Travelling as: not stated"));

  // The point of the whole arrangement: the alert goes out even when the
  // lead's own email throws.
  sent.length = 0;
  failLeadEmail = true;
  await post({ name: "Alex Lead", email: "alex@example.com", tourSlug: SLUG }, "203.0.113.12");
  await waitForEmails(1);
  await new Promise((r) => setTimeout(r, 1500));
  ok("the lead's copy did not send", !sent.some((m) => m.to === "alex@example.com"));
  ok("but the internal alert still went out", sent.some((m) => m.to === "travel@iluxuryegypt.com" && m.subject.includes("Alex Lead")));
  failLeadEmail = false;
}

console.log("\n=== Rate limit: 5 an hour per address ===\n");
{
  const ip = "198.51.100.7";
  const codes: number[] = [];
  for (let i = 0; i < 7; i++) {
    const r = await post({ name: `Lead ${i}`, email: `lead${i}@example.com`, tourSlug: SLUG }, ip);
    codes.push(r.status);
  }
  ok("the first five are accepted", codes.slice(0, 5).every((c) => c === 200), codes.join(","));
  ok("the sixth and seventh are 429", codes[5] === 429 && codes[6] === 429, codes.join(","));

  const other = await post({ name: "Other", email: "other@example.com", tourSlug: SLUG }, "198.51.100.8");
  ok("a different address is unaffected", other.status === 200, String(other.status));

  // Behind nginx every request shares one socket address, so a limiter reading
  // req.ip would have locked the whole site out at the sixth download.
  const noHeader = await fetch(`${base}/api/brochure/request`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Direct", email: "direct@example.com", tourSlug: SLUG }),
  });
  ok("a request with no forwarded header still works", noHeader.status === 200, String(noHeader.status));
}

console.log("\n=== The download endpoint streams a PDF ===\n");
{
  const res = await fetch(`${base}/api/brochure/download/${SLUG}`);
  const buf = Buffer.from(await res.arrayBuffer());
  ok("200 with a PDF content type", res.status === 200 && res.headers.get("content-type") === "application/pdf",
     `${res.status} ${res.headers.get("content-type")}`);
  ok("as an attachment with the tour's filename",
     res.headers.get("content-disposition") === `attachment; filename="${SLUG}.pdf"`,
     String(res.headers.get("content-disposition")));
  ok("the body is a real PDF", buf.subarray(0, 4).toString() === "%PDF", `${buf.length} bytes`);

  const missing = await fetch(`${base}/api/brochure/download/no-such-tour`);
  ok("an unknown slug is a 404", missing.status === 404, String(missing.status));
}

const { closeBrochureBrowser } = await import("../server/brochure/generate");
await closeBrochureBrowser();
server.close();
console.log(fails === 0 ? "\nAll brochure API cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
