import { getDb } from "../server/db/index.js";
import { contentSection } from "../server/db/schema.js";
import { publicContent } from "../shared/content-schema.js";
import { handle, json } from "../server/http.js";
export const GET = handle(async () =>
  json(publicContent(await getDb().select().from(contentSection))),
);
