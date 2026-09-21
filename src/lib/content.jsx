import { createContext, useContext, useEffect, useState } from "react";
import defaults from "../../shared/default-content.json";
const Context = createContext(null);
export const useContent = () => useContext(Context);
export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    fetch("/api/content", { signal: controller.signal })
      .then(async (r) => {
        // Sites' preserved static worker has no CMS API; use the bundled public snapshot there.
        if (r.status === 404) return defaults;
        if (!r.ok) throw new Error("Content unavailable");
        const data = await r.json();
        if (!data.settings || !Array.isArray(data.projects))
          throw new Error("Content incomplete");
        return data;
      })
      .then(setContent)
      .catch((err) => {
        if (err.name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [retry]);
  if (!content)
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeContent: "center",
          textAlign: "center",
          gap: 16,
        }}
      >
        {error ? (
          <>
            <p role="alert">콘텐츠를 불러오지 못했습니다.</p>
            <button onClick={() => setRetry((v) => v + 1)}>다시 시도</button>
          </>
        ) : (
          <p role="status">클리어데브 포트폴리오를 불러오는 중입니다…</p>
        )}
      </main>
    );
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
