import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";

export function BuildingScene() {
  const sceneRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const viewerRef = useRef(null);
  const inView = useInView(sceneRef, { amount: 0.15 });
  const entered = useInView(sceneRef, { amount: 0.15, once: true });
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [ready, setReady] = useState(false);
  const playback = useRef({ visible: false, autoRotate: false });

  useEffect(() => {
    playback.current = { visible: inView, autoRotate: !reducedMotion && !paused };
    viewerRef.current?.setPlayback(playback.current);
  }, [inView, reducedMotion, paused]);

  useEffect(() => {
    if (imageRef.current?.complete) setImageReady(true);
  }, []);

  useEffect(() => {
    if (!entered || !imageReady) return;
    let cancelled = false;
    let viewer;
    const unavailable = () => {
      viewer?.dispose();
      if (viewerRef.current === viewer) viewerRef.current = null;
      if (!cancelled) setReady(false);
    };
    async function load() {
      try {
        // Paint the original image before fetching the optional 3D runtime.
        const { createBuildingViewer } = await import("./building/create-building-viewer.js");
        if (cancelled) return;
        viewer = createBuildingViewer(canvasRef.current, { onUnavailable: unavailable });
        viewerRef.current = viewer;
        viewer.setPlayback(playback.current);
        await viewer.ready;
        if (!cancelled && viewerRef.current === viewer) setReady(true);
      } catch {
        unavailable();
      }
    }
    const idle = "requestIdleCallback" in window;
    const task = idle ? window.requestIdleCallback(load, { timeout: 1500 }) : window.setTimeout(load, 250);
    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(task);
      else window.clearTimeout(task);
      viewer?.dispose();
      if (viewerRef.current === viewer) viewerRef.current = null;
    };
  }, [entered, imageReady]);

  return (
    <div className="building-scene" ref={sceneRef} data-ready={ready}>
      <picture className="blueprint-underlay" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/assets/hero/blueprint-underlay-mobile.webp" />
        <img src="/assets/hero/blueprint-underlay.webp" alt=""
          width="1200" height="1200" decoding="async" />
      </picture>
      <picture className="building-poster" aria-hidden={ready}>
        <source media="(max-width: 639px)" srcSet="/assets/hero/building-studio-mobile.webp" />
        <img ref={imageRef} src="/assets/hero/building-studio.webp"
          alt="블루 크레인이 새 층을 쌓아 올리는 화이트 빌딩의 3D 렌더링"
          width="1000" height="1000" fetchPriority="high" decoding="async"
          onLoad={() => setImageReady(true)} onError={() => setImageReady(true)} />
      </picture>
      <div ref={canvasRef} className="building-canvas" aria-hidden={!ready} inert={!ready} />
      {ready ? (
        <div className="scene-controls">
          <span className="scene-hint">드래그로 돌려보세요</span>
          <button type="button" className="scene-motion-toggle"
            aria-label="빌딩을 처음 각도로 되돌리기" onClick={() => viewerRef.current?.reset()}>
            <RotateCcw size={15} />
          </button>
          {!reducedMotion ? (
            <button type="button" className="scene-motion-toggle"
              aria-label={paused ? "빌딩 자동 회전 재생" : "빌딩 자동 회전 일시정지"}
              aria-pressed={paused} onClick={() => setPaused(value => !value)}>
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
