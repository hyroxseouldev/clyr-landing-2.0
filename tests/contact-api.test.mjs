import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../api/contact.js";
import { inquiryTypes, legacyInquiryTypes } from "../shared/contact.js";

const validPayload = {
  name: "테스터",
  email: "tester@example.com",
  project: "주말 러닝 행사",
  inquiry: "러닝·스포츠 이벤트",
  message: "행사 안내와 참가 신청을 받는 페이지를 만들고 싶습니다.",
  website: "",
  submissionId: "contact-test-1",
};

function request(payload = validPayload) {
  return new Request("https://example.test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

test("rejects submissions when email delivery is not configured", async () => {
  const previousKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;

  const response = await POST(request());

  assert.equal(response.status, 503);
  if (previousKey) process.env.RESEND_API_KEY = previousKey;
});

test("validates contact fields before calling Resend", async () => {
  const previousKey = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "test-key";

  const response = await POST(request({ ...validPayload, email: "not-an-email" }));

  assert.equal(response.status, 400);
  if (previousKey) process.env.RESEND_API_KEY = previousKey;
  else delete process.env.RESEND_API_KEY;
});

test("silently accepts honeypot submissions without sending email", async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  process.env.RESEND_API_KEY = "test-key";
  globalThis.fetch = async () => {
    fetchCalls += 1;
    return new Response(null, { status: 200 });
  };

  const response = await POST(request({ ...validPayload, website: "https://spam.test" }));

  assert.equal(response.status, 200);
  assert.equal(fetchCalls, 0);
  globalThis.fetch = originalFetch;
  if (previousKey) process.env.RESEND_API_KEY = previousKey;
  else delete process.env.RESEND_API_KEY;
});

test("sends a validated inquiry through Resend", async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const originalFetch = globalThis.fetch;
  let resendRequest;
  process.env.RESEND_API_KEY = "test-key";
  globalThis.fetch = async (url, options) => {
    resendRequest = { url, options };
    return Response.json({ id: "email_123" });
  };

  const response = await POST(request());
  const payload = JSON.parse(resendRequest.options.body);

  assert.equal(response.status, 200);
  assert.equal(resendRequest.url, "https://api.resend.com/emails");
  assert.equal(payload.to[0], "vividxxxxx@gmail.com");
  assert.equal(payload.reply_to, "tester@example.com");
  assert.match(payload.text, /행사 안내와 참가 신청/);
  globalThis.fetch = originalFetch;
  if (previousKey) process.env.RESEND_API_KEY = previousKey;
  else delete process.env.RESEND_API_KEY;
});

function mockDelivery(t) {
  const previousKey = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "test-key";
  t.after(() => {
    if (previousKey) process.env.RESEND_API_KEY = previousKey;
    else delete process.env.RESEND_API_KEY;
  });
  return t.mock.method(globalThis, "fetch", async () => Response.json({ id: "email_test" }));
}

test("accepts every currently offered inquiry type", async (t) => {
  const delivery = mockDelivery(t);

  for (const inquiry of inquiryTypes) {
    const response = await POST(request({ ...validPayload, inquiry }));
    assert.equal(response.status, 200, inquiry);
    const mail = JSON.parse(delivery.mock.calls.at(-1).arguments[1].body);
    assert.equal(mail.subject, `[CLYRDEV 문의] ${inquiry} · 테스터`);
  }

  assert.equal(delivery.mock.callCount(), inquiryTypes.length);
});

test("accepts older open forms without showing their inquiry types in the new form", async (t) => {
  const delivery = mockDelivery(t);

  for (const inquiry of legacyInquiryTypes) {
    assert.equal(inquiryTypes.includes(inquiry), false);
    const response = await POST(request({ ...validPayload, inquiry }));
    assert.equal(response.status, 200, inquiry);
  }

  assert.equal(delivery.mock.callCount(), legacyInquiryTypes.length);
});

test("rejects unknown inquiry types before attempting delivery", async (t) => {
  const delivery = mockDelivery(t);

  const response = await POST(request({ ...validPayload, inquiry: "등록되지 않은 문의 유형" }));

  assert.equal(response.status, 400);
  assert.equal(delivery.mock.callCount(), 0);
});
