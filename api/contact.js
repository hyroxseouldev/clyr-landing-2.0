const CONTACT_EMAIL = "vividxxxxx@gmail.com";
const INQUIRY_TYPES = new Set([
  "아이디어 프로토타입",
  "웹·앱 만들기",
  "AI 자동화",
  "사이드 프로젝트",
  "커피챗·기타",
]);

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
    return json({ message: "이름, 이메일과 아이디어를 확인해주세요." }, 400);
  }

  const recipient = process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL || "CLYRDEV Portfolio <onboarding@resend.dev>";
  const emailText = [
    "클리어데브 포트폴리오에서 새 문의가 도착했습니다.",
    "",
    `이름: ${name}`,
    `이메일: ${email}`,
    `프로젝트: ${project}`,
    `문의 유형: ${inquiry}`,
    "",
    "아이디어",
    message,
  ].join("\n");

  let resendResponse;
  try {
    resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
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
  } catch (error) {
    console.error("Resend contact request failed", error);
    return json({ message: "전송하지 못했습니다. 잠시 후 다시 시도해주세요." }, 502);
  }

  if (!resendResponse.ok) {
    const detail = await resendResponse.text();
    console.error("Resend contact delivery failed", resendResponse.status, detail);
    return json({ message: "전송하지 못했습니다. 잠시 후 다시 시도해주세요." }, 502);
  }

  return json({ ok: true });
}

export function GET() {
  return json({ message: "Method not allowed" }, 405);
}
