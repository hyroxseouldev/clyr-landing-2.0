import { createContext, useContext, useEffect, useState } from "react";
import snapshot from "../../shared/public-snapshot.json";

const Context = createContext(snapshot);
export const useContent = () => useContext(Context);

export function ContentProvider({ children }) {
  // Render the full landing immediately: the first paint never waits for the DB.
  const [content, setContent] = useState(snapshot);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    fetch("/api/content", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (
          !data.settings?.sections ||
          !["projects", "partners", "services", "stats"].every((key) =>
            Array.isArray(data[key]),
          )
        )
          return;
        setContent((previous) =>
          JSON.stringify(previous) === JSON.stringify(data) ? previous : data,
        );
      })
      // A slow/offline API must never replace a usable landing with an error screen.
      .catch(() => {})
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
