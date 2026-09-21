import { readFile } from "node:fs/promises";
import { getDb } from "../server/db/index.js";
import { contentSection } from "../server/db/schema.js";
import { contentSchemas } from "../shared/content-schema.js";
const content = JSON.parse(
  await readFile(new URL("../shared/default-content.json", import.meta.url)),
);
try {
  const rows = Object.entries(content).map(([key, data]) => ({
    key,
    data: contentSchemas[key].parse(data),
  }));
  await getDb().insert(contentSection).values(rows).onConflictDoNothing();
  console.log("Landing content seeded; existing edits preserved.");
} finally {
  await getDb().$client.end();
}
