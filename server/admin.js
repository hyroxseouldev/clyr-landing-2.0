import { getAuth, adminEmail } from "./auth.js";
import { HttpError } from "./http.js";
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
