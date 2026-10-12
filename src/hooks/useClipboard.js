import { useEffect, useRef, useState } from "react";

export function useClipboard() {
  const [copyState, setCopyState] = useState("idle");
  const timer = useRef(null);
  const active = useRef(false);
  const copying = useRef(false);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  async function copy(text) {
    if (copying.current) return;
    copying.current = true;
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      if (active.current) setCopyState("copied");
    } catch {
      if (active.current) setCopyState("error");
    } finally {
      copying.current = false;
      if (active.current) timer.current = setTimeout(() => setCopyState("idle"), 3000);
    }
  }

  return { copy, copyState };
}
