import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

const policyPages = {
  "/apps/cloudboard/privacy": "privacy",
  "/apps/cloudboard/delete-account": "delete-account",
};
const policyPage = policyPages[window.location.pathname.replace(/\/+$/, "")];
const Admin = React.lazy(() => import("./admin/Admin.jsx"));
const isAdmin = /^\/admin(?:\/|$)/.test(window.location.pathname);
if (isAdmin) {
  document.title = "관리자 · CLYRDEV Studio";
  const robots = document.createElement("meta");
  robots.name = "robots";
  robots.content = "noindex, nofollow";
  document.head.appendChild(robots);
}
const CloudboardPolicy = React.lazy(
  () => import("./cloudboard/PolicyPages.jsx"),
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdmin ? (
      <React.Suspense
        fallback={<p role="status">관리자 화면을 불러오는 중입니다…</p>}
      >
        <Admin />
      </React.Suspense>
    ) : policyPage ? (
      <React.Suspense fallback={<p role="status">문서를 불러오는 중입니다…</p>}>
        <CloudboardPolicy page={policyPage} />
      </React.Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
);
