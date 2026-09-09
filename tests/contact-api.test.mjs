import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../api/contact.js";

const validPayload = {
  name: "테스터",
  email: "tester@example.com",
  project: "새 앱",
  inquiry: "웹·앱 만들기",
  message: "실제로 동작하는 앱을 함께 만들고 싶습니다.",
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
  assert.match(payload.text, /실제로 동작하는 앱/);
  globalThis.fetch = originalFetch;
  if (previousKey) process.env.RESEND_API_KEY = previousKey;
  else delete process.env.RESEND_API_KEY;
});
