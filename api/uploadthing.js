import {
  createUploadthing,
  createRouteHandler,
  UploadThingError,
} from "uploadthing/server";
import { waitUntil } from "@vercel/functions";
import { requireAdmin, json } from "../server/http.js";
import { getDb } from "../server/db/index.js";
import { media } from "../server/db/schema.js";
const f = createUploadthing();
export const uploadRouter = {
  portfolioImage: f(
    {
      "image/png": { maxFileSize: "8MB", maxFileCount: 1 },
      "image/jpeg": { maxFileSize: "8MB", maxFileCount: 1 },
      "image/webp": { maxFileSize: "8MB", maxFileCount: 1 },
    },
    { awaitServerData: true },
  )
    .middleware(async ({ req }) => {
      try {
        const { user } = await requireAdmin(req, { mutation: true });
        return { userId: user.id };
      } catch {
        throw new UploadThingError("관리자 로그인이 필요합니다.");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await getDb()
        .insert(media)
        .values({
          key: file.key,
          url: file.ufsUrl,
          name: file.name,
          size: file.size,
          uploadedBy: metadata.userId,
        })
        .onConflictDoNothing();
      return { url: file.ufsUrl, key: file.key };
    }),
};
let route;
async function handler(request) {
  if (!process.env.UPLOADTHING_TOKEN)
    return json({ message: "UploadThing 연결이 필요합니다." }, 503);
  route ||= createRouteHandler({
    router: uploadRouter,
    config: {
      logLevel: "Error",
      token: process.env.UPLOADTHING_TOKEN,
      isDev: process.env.NODE_ENV !== "production",
      ...(process.env.VERCEL ? { handleDaemonPromise: waitUntil } : {}),
    },
  });
  return route(request);
}
export { handler as GET, handler as POST };
