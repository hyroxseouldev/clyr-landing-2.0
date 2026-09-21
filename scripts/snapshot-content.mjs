import { writeFile } from "node:fs/promises";
import { getDb } from "../server/db/index.js";
import { contentSection } from "../server/db/schema.js";
import { contentSchemas, publicContent } from "../shared/content-schema.js";

// Only published page content is shipped to browsers. Seed data stays immutable.
// With credentials configured, a failed snapshot aborts the build rather than
// silently publishing outdated content. Offline builds retain the checked-in snapshot.
if (process.env.DATABASE_URL) {
  const db = getDb();
  try {
    const rows = await db.select().from(contentSection);
    for (const [key, schema] of Object.entries(contentSchemas)) {
      schema.parse(rows.find((row) => row.key === key)?.data);
    }
    await writeFile(
      new URL("../shared/public-snapshot.json", import.meta.url),
      JSON.stringify(publicContent(rows), null, 2) + "\n",
    );
    console.log("Public landing snapshot refreshed from Neon.");
  } finally {
    await db.$client.end();
  }
} else {
  console.log(
    "Using the bundled public landing snapshot (no database configured).",
  );
}
