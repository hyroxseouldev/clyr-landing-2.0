import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

const policyPages = {
  "/apps/cloudboard/privacy": "privacy",
  "/apps/cloudboard/delete-account": "delete-account",
};
const policyPage = policyPages[window.location.pathname.replace(/\/+$/, "")];
const CloudboardPolicy = React.lazy(() => import("./cloudboard/PolicyPages.jsx"));

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {policyPage ? <React.Suspense fallback={<p role="status">문서를 불러오는 중입니다…</p>}><CloudboardPolicy page={policyPage} /></React.Suspense> : <App />}
  </React.StrictMode>,
);
