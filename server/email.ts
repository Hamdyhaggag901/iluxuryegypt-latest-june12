// Transactional email via Resend.
//
// Requires the RESEND_API_KEY environment variable to be set on the server
// (the iluxuryegypt.com domain is already verified on Resend). If it's
// missing, sendBookingConfirmation logs an error and returns without
// throwing — callers should never let an email failure block a booking or
// inquiry from being saved.

import { Resend } from "resend";

const FROM_EMAIL = "iLuxury Egypt <travel@iluxuryegypt.com>";
const INTERNAL_NOTIFICATION_EMAIL = "travel@iluxuryegypt.com";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export interface BookingConfirmationData {
  fullName: string;
  email: string;
  /** Short label for what was requested — e.g. a tour title, a destination, or "General Inquiry". */
  tripSummary: string;
  phone?: string | null;
  preferredDates?: string | null;
  numberOfGuests?: number | null;
  specialRequests?: string | null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function detailRows(data: BookingConfirmationData): string {
  const rows: Array<[string, string]> = [
    ["Trip", data.tripSummary],
  ];
  if (data.preferredDates) rows.push(["Preferred dates", data.preferredDates]);
  if (data.numberOfGuests) rows.push(["Travelers", String(data.numberOfGuests)]);
  if (data.phone) rows.push(["Phone", data.phone]);

  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 6px 12px 6px 0; color: #6b6b6b; font-size: 14px; white-space: nowrap;">${escapeHtml(label)}</td>
          <td style="padding: 6px 0; color: #101010; font-size: 14px;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");
}

function customerEmailHtml(data: BookingConfirmationData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
      <p style="color: #b08d57; letter-spacing: 2px; font-size: 12px; text-transform: uppercase; margin: 0 0 16px;">iLuxury Egypt</p>
      <h1 style="color: #101010; font-size: 22px; margin: 0 0 16px;">We've Received Your Trip Request</h1>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">Dear ${escapeHtml(data.fullName)},</p>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        Thank you for reaching out to iLuxury Egypt. One of our Egypt specialists will review your request personally
        and get back to you within 24 hours — no call centers, no bots.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
        ${detailRows(data)}
      </table>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        In the meantime, feel free to reply to this email with any additional details about your trip.
      </p>
      <p style="color: #333; font-size: 15px; line-height: 1.6; margin-top: 24px;">Warm regards,<br />The iLuxury Egypt Team</p>
    </div>
  `;
}

function internalEmailHtml(data: BookingConfirmationData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h1 style="color: #101010; font-size: 20px; margin: 0 0 16px;">New Trip Request</h1>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
        <tr>
          <td style="padding: 6px 12px 6px 0; color: #6b6b6b; font-size: 14px; white-space: nowrap;">Name</td>
          <td style="padding: 6px 0; color: #101010; font-size: 14px;">${escapeHtml(data.fullName)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; color: #6b6b6b; font-size: 14px; white-space: nowrap;">Email</td>
          <td style="padding: 6px 0; color: #101010; font-size: 14px;">${escapeHtml(data.email)}</td>
        </tr>
        ${detailRows(data)}
      </table>
      ${
        data.specialRequests
          ? `<div style="margin-top: 16px;">
               <p style="color: #6b6b6b; font-size: 14px; margin: 0 0 4px;">Full details:</p>
               <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; color: #101010; font-size: 14px; background: #f7f7f7; padding: 12px; border-radius: 6px; margin: 0;">${escapeHtml(data.specialRequests)}</pre>
             </div>`
          : ""
      }
    </div>
  `;
}

/**
 * Sends a customer confirmation email and an internal team notification for
 * a new booking/inquiry. Never throws — all failures are caught and logged
 * so a broken email send can never fail the underlying booking request.
 */
export async function sendBookingConfirmation(data: BookingConfirmationData): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.error("[email] RESEND_API_KEY is not set — skipping confirmation email.");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: "We've Received Your Trip Request",
      html: customerEmailHtml(data),
    });
  } catch (error) {
    console.error("[email] Failed to send customer confirmation email:", error);
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: INTERNAL_NOTIFICATION_EMAIL,
      subject: `New Trip Request: ${data.fullName} — ${data.tripSummary}`,
      html: internalEmailHtml(data),
    });
  } catch (error) {
    console.error("[email] Failed to send internal notification email:", error);
  }
}
