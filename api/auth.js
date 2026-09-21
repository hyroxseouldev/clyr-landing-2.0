import { getAuth } from "../server/auth.js";
import { handle } from "../server/http.js";

// Standalone Vercel Functions do not expand Next.js-style [...all] routes.
// vercel.json forwards nested auth paths to this function with authPath.
export const GET = handle((request) => {
  const url = new URL(request.url);
  const authPath = url.searchParams.get("authPath");
  if (authPath !== null) {
    url.pathname = `/api/auth/${authPath}`;
    url.searchParams.delete("authPath");
    request = new Request(url, request);
  }
  return getAuth().handler(request);
});
export const POST = GET;
