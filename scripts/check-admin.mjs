// Integration checks against the running local server and the single shared DB.
// Re-saves an unchanged section to test optimistic locking; never alters copy.
import "../server/env.js";
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.BETTER_AUTH_URL;
if (!/^http:\/\/localhost:\d+$/.test(base))
  throw Error("Run only against the local preview");
const request = (path, options = {}) => fetch(base + path, options);
const origin = { Origin: base, "Content-Type": "application/json" };
assert.equal((await request("/api/admin/content")).status, 401);
assert.equal(
  (
    await request("/api/admin/content", {
      method: "PUT",
      headers: { ...origin, Origin: "https://evil.example" },
      body: "{}",
    })
  ).status,
  403,
);
const signup = await request("/api/auth/sign-up/email", {
  method: "POST",
  headers: origin,
  body: JSON.stringify({
    email: "outsider@example.com",
    password: "testpassword123!",
    name: "Outsider",
  }),
});
assert.ok(
  [400, 403, 404, 422].includes(signup.status),
  "Public registration must be closed",
);
const password =
  process.env.ADMIN_TEST_PASSWORD ||
  fs
    .readFileSync(".local/admin-credentials.txt", "utf8")
    .match(/초기 비밀번호: (.+)/)[1];
const login = await request("/api/auth/sign-in/email", {
  method: "POST",
  headers: origin,
  body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password }),
});
assert.equal(login.status, 200, "Admin login must succeed");
const cookies = login.headers
  .getSetCookie()
  .map((c) => c.split(";")[0])
  .join("; ");
const headers = { ...origin, Cookie: cookies };
const admin = await request("/api/admin/content", { headers });
assert.equal(admin.status, 200);
const data = await admin.json();
assert.equal(data.sections.length, 5);
assert.equal(data.user.email, process.env.ADMIN_EMAIL);
const section = data.sections.find((s) => s.key === "stats");
const body = JSON.stringify({
  key: section.key,
  data: section.data,
  version: section.version,
});
const saved = await request("/api/admin/content", {
  method: "PUT",
  headers,
  body,
});
assert.equal(saved.status, 200);
assert.equal((await saved.json()).version, section.version + 1);
assert.equal(
  (await request("/api/admin/content", { method: "PUT", headers, body }))
    .status,
  409,
);
assert.equal(
  (
    await request("/api/admin/content", {
      method: "PUT",
      headers,
      body: JSON.stringify({
        key: "stats",
        data: [{ ...section.data[0], value: "invalid" }],
        version: section.version + 1,
      }),
    })
  ).status,
  422,
);
const publicData = await (await request("/api/content")).json();
assert.equal(publicData.projects.length, 6);
assert.equal(publicData.stats[0].value, "300+");
const upload = await request(
  "/api/uploadthing?slug=portfolioImage&actionType=upload",
  {
    method: "POST",
    headers: origin,
    body: JSON.stringify({
      files: [{ name: "test.png", size: 100, type: "image/png" }],
    }),
  },
);
assert.notEqual(upload.status, 200, "Anonymous upload must be rejected");
const signout = await request("/api/auth/sign-out", {
  method: "POST",
  headers,
  body: "{}",
});
assert.equal(signout.status, 200);
assert.equal((await request("/api/admin/content", { headers })).status, 401);
console.log(
  "PASS: login, logout, private API, CSRF, closed signup, validation, optimistic locking, public content, and anonymous upload protection.",
);
