import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import * as content from "../api/content.js";
import * as admin from "../api/admin/content.js";
import * as auth from "../api/auth.js";
import * as uploads from "../api/uploadthing.js";
import * as contact from "../api/contact.js";
export function apiPlugin() {
  const routes = {
    "/api/content": content,
    "/api/admin/content": admin,
    "/api/uploadthing": uploads,
    "/api/contact": contact,
  };
  const install = (server) => {
    server.middlewares.use(async (req, res, next) => {
      const pathname = new URL(req.url, "http://localhost").pathname;
      if (!pathname.startsWith("/api/")) return next();
      const route = pathname.startsWith("/api/auth/") ? auth : routes[pathname];
      const handler = route?.[req.method];
      if (!handler) {
        res.writeHead(route ? 405 : 404, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ message: "Not found" }));
        return;
      }
      try {
        const origin = process.env.BETTER_AUTH_URL || "http://localhost:5173";
        const request = new Request(new URL(req.url, origin), {
          method: req.method,
          headers: req.headers,
          ...(!["GET", "HEAD"].includes(req.method)
            ? { body: Readable.toWeb(req), duplex: "half" }
            : {}),
        });
        const response = await handler(request);
        res.statusCode = response.status;
        response.headers.forEach((v, k) => {
          if (k !== "set-cookie") res.setHeader(k, v);
        });
        const cookies = response.headers.getSetCookie();
        if (cookies.length) res.setHeader("set-cookie", cookies);
        if (response.body) await pipeline(Readable.fromWeb(response.body), res);
        else res.end();
      } catch (error) {
        console.error("Local API failed:", error.name);
        if (res.headersSent || res.destroyed) {
          res.destroy();
          return;
        }
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "서버 요청에 실패했습니다." }));
      }
    });
  };
  return {
    name: "portfolio-api",
    configureServer: install,
    configurePreviewServer: install,
  };
}
