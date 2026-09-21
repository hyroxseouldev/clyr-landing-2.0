import { getAuth, adminEmail } from "./auth.js";
export const json = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export async function requireAdmin(request, { mutation = false } = {}) {
  if (
    mutation &&
    request.headers.get("origin") !==
      new URL(process.env.BETTER_AUTH_URL).origin
  )
    throw new HttpError(403, "허용되지 않은 요청입니다.");
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session) throw new HttpError(401, "로그인이 필요합니다.");
  if (session.user.email.toLowerCase() !== adminEmail())
    throw new HttpError(403, "관리자 권한이 필요합니다.");
  return session;
}
export const handle = (fn) => async (request) => {
  try {
    return await fn(request);
  } catch (error) {
    if (error instanceof HttpError)
      return json({ message: error.message }, error.status);
    console.error("Portfolio API failed:", error.name);
    return json(
      { message: "요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요." },
      503,
    );
  }
};
export async function readJson(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "내용이 필요합니다.");
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 200000) {
      await reader.cancel();
      throw new HttpError(413, "내용이 너무 큽니다.");
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    throw new HttpError(400, "올바른 JSON이 필요합니다.");
  }
}
