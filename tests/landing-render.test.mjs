import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";
import { readFile } from "node:fs/promises";

test("first render contains real content without waiting for a content request", async () => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });
  try {
    const { ContentProvider, useContent } = await vite.ssrLoadModule(
      "/src/lib/content.jsx",
    );
    function Probe() {
      const content = useContent();
      return React.createElement(
        "h1",
        null,
        content.settings.heroTitle,
        ` / ${content.projects.length} projects`,
      );
    }
    const html = renderToString(
      React.createElement(ContentProvider, null, React.createElement(Probe)),
    );
    const snapshot = JSON.parse(await readFile(new URL("../shared/public-snapshot.json", import.meta.url)));
    const expected = renderToString(React.createElement("h1", null, snapshot.settings.heroTitle, ` / ${snapshot.projects.length} projects`));
    assert.equal(html, expected);
    assert.doesNotMatch(html, /불러오는 중|불러오지 못했습니다/);
  } finally {
    await vite.close();
  }
});
