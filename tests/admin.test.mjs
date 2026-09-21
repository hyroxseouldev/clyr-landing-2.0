import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { contentSchemas, publicContent } from "../shared/content-schema.js";
const seed = JSON.parse(
  await readFile(new URL("../shared/default-content.json", import.meta.url)),
);
test("existing landing content validates without changing copy", () => {
  for (const [key, data] of Object.entries(seed))
    assert.deepEqual(contentSchemas[key].parse(data), data);
});
test("project links reject script and insecure URLs", () => {
  for (const href of [
    "javascript:alert(1)",
    "data:text/html,test",
    "http://example.com",
    "not a url",
  ]) {
    const data = structuredClone(seed.projects);
    data[0].links[0].href = href;
    assert.equal(contentSchemas.projects.safeParse(data).success, false);
  }
});
test("images reject protocol-relative and data URLs", () => {
  for (const image of [
    "//evil.com/a.png",
    "data:image/svg+xml,test",
    "javascript:alert(1)",
    "/api/auth/sign-out",
  ]) {
    assert.equal(
      contentSchemas.partners.safeParse([{ ...seed.partners[0], image }])
        .success,
      false,
    );
  }
});
test("stats preserve plus suffixes and reject invalid numbers", () => {
  assert.equal(contentSchemas.stats.safeParse(seed.stats).success, true);
  assert.equal(
    contentSchemas.stats.safeParse([{ ...seed.stats[0], value: "NaN" }])
      .success,
    false,
  );
});
test("duplicate IDs and unknown properties are rejected", () => {
  assert.equal(
    contentSchemas.projects.safeParse([seed.projects[0], seed.projects[0]])
      .success,
    false,
  );
  assert.equal(
    contentSchemas.settings.safeParse({
      ...seed.settings,
      adminPassword: "bad",
    }).success,
    false,
  );
});
test("public responses omit hidden rows and internal fields", () => {
  const rows = [
    {
      key: "projects",
      data: [seed.projects[0], { ...seed.projects[1], visible: false }],
      version: 99,
    },
    { key: "private", data: "secret" },
  ];
  const data = publicContent(rows);
  assert.equal(data.projects.length, 1);
  assert.equal(data.projects[0].visible, undefined);
  assert.equal(data.private, undefined);
  assert.equal(data.version, undefined);
});
