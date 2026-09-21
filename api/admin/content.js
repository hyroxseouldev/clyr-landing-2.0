import { requireAdmin } from "../../server/admin.js";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../../server/db/index.js";
import { contentSection } from "../../server/db/schema.js";
import { contentSchemas } from "../../shared/content-schema.js";
import { handle, json, readJson, HttpError } from "../../server/http.js";
export const GET = handle(async (request) => {
  const session = await requireAdmin(request);
  return json({
    sections: await getDb().select().from(contentSection),
    user: { name: session.user.name, email: session.user.email },
    uploadsEnabled: Boolean(process.env.UPLOADTHING_TOKEN),
  });
});
export const PUT = handle(async (request) => {
  await requireAdmin(request, { mutation: true });
  const { key, data, version } = await readJson(request);
  if (
    !Object.hasOwn(contentSchemas, key) ||
    !Number.isSafeInteger(version) ||
    version < 1
  )
    throw new HttpError(400, "저장할 항목을 확인해주세요.");
  const parsed = contentSchemas[key].safeParse(data);
  if (!parsed.success)
    return json(
      {
        message: "입력 내용을 확인해주세요.",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      422,
    );
  const [saved] = await getDb()
    .update(contentSection)
    .set({
      data: parsed.data,
      version: sql`${contentSection.version} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(eq(contentSection.key, key), eq(contentSection.version, version)),
    )
    .returning();
  if (!saved)
    throw new HttpError(
      409,
      "다른 창에서 변경되었습니다. 내용을 복사한 뒤 새로고침해주세요.",
    );
  return json(saved);
});
