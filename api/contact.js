import { inquiryTypes, legacyInquiryTypes, CONTACT_DELIVERY_TIMEOUT_MS } from "../shared/contact.js";

const CONTACT_EMAIL = "vividxxxxx@gmail.com";
const INQUIRY_TYPES = new Set([...inquiryTypes, ...legacyInquiryTypes]);

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function singleLine(value, maxLength) {
  return clean(value, maxLength).replace(/[\r\n]+/g, " ");
}

export async function POST(request) {
  if (!process.env.RESEND_API_KEY) {
    return json({ message: "메일 전송 설정이 아직 완료되지 않았습니다." }, 503);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 50_000) {
    return json({ message: "문의 내용이 너무 깁니다." }, 413);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ message: "올바른 문의 내용을 입력해주세요." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ message: "올바른 문의 내용을 입력해주세요." }, 400);
  }

  // Bots commonly fill hidden fields. Return success without sending so they do not retry.
  if (clean(body.website, 200)) {
    return json({ ok: true });
  }

  const name = singleLine(body.name, 80);
  const email = singleLine(body.email, 254).toLowerCase();
  const project = singleLine(body.project, 120) || "미정";
  const inquiry = singleLine(body.inquiry, 40);
  const message = clean(body.message, 3_000);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !emailPattern.test(email) || !INQUIRY_TYPES.has(inquiry) || message.length < 10) {
    return json({ message: "이름, 이메일과 문의 내용을 확인해주세요." }, 400);
  }

  const recipient = process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL || "CLYRDEV Portfolio <onboarding@resend.dev>";
  const emailText = [
    "클리어데브 포트폴리오에서 새 문의가 도착했습니다.",
    "",
    `이름: ${name}`,
    `이메일: ${email}`,
    `페이지·행사 이름: ${project}`,
    `문의 유형: ${inquiry}`,
    "",
    "제작 문의 내용",
    message,
  ].join("\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONTACT_DELIVERY_TIMEOUT_MS);
  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": singleLine(body.submissionId, 128) || crypto.randomUUID(),
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `[CLYRDEV 문의] ${inquiry} · ${name}`,
        text: emailText,
      }),
    });
    if (!resendResponse.ok) {
      console.error("Resend contact delivery failed", resendResponse.status);
      return json({ message: "전송하지 못했습니다. 잠시 후 다시 시도해주세요." }, 502);
    }
    return json({ ok: true });
  } catch (error) {
    console.error("Resend contact request failed", error.name);
    return json({ message: "전송하지 못했습니다. 잠시 후 다시 시도해주세요." }, 502);
  } finally {
    clearTimeout(timeout);
  }
}

export function GET() {
  return json({ message: "Method not allowed" }, 405);
}
