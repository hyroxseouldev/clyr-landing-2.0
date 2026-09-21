import { writeFile, mkdir } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { createAuth, adminEmail } from "../server/auth.js";
import { getDb } from "../server/db/index.js";
import { user } from "../server/db/schema.js";
try {
  if (!adminEmail()) throw new Error("ADMIN_EMAIL is required");
  const [existing] = await getDb()
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, adminEmail()));
  if (existing) {
    console.log("Admin already exists. No credentials changed.");
  } else {
    const password =
      process.env.ADMIN_INITIAL_PASSWORD ||
      randomBytes(24).toString("base64url");
    await createAuth({ bootstrap: true }).api.signUpEmail({
      body: { email: adminEmail(), password, name: "클리어데브" },
    });
    await mkdir(".local", { recursive: true, mode: 0o700 });
    await writeFile(
      ".local/admin-credentials.txt",
      `관리자 주소: /admin\n이메일: ${adminEmail()}\n초기 비밀번호: ${password}\n로그인 후 계정 설정에서 비밀번호를 변경하세요.\n`,
      { mode: 0o600 },
    );
    console.log(
      "Admin created. Credentials saved to ignored .local/admin-credentials.txt",
    );
  }
} finally {
  await getDb().$client.end();
}
