import { getAuth } from "../../server/auth.js";
import { handle } from "../../server/http.js";
export const GET = handle((request) => getAuth().handler(request));
export const POST = GET;
