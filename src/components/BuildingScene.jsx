import { useRef, useState } from "react";
import { m, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight, Layers3, Pause, Play } from "lucide-react";

export function BuildingScene() {
  const sceneRef = useRef(null);
  const inView = useInView(sceneRef, { amount: 0.15 });
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 100, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 100, damping: 24 });
  const motionEnabled = !reducedMotion && !paused;

  const resetTilt = () => { x.set(0); y.set(0); };
  const followPointer = (event) => {
    if (!motionEnabled || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 5);
    y.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 6);
  };

  return (
    <div className="building-scene" ref={sceneRef}
      data-animated={motionEnabled && inView}
      onPointerMove={followPointer} onPointerLeave={resetTilt}>
      <div className="scene-topline" aria-hidden="true">
        <span><span className="scene-live-dot" /> ALWAYS BUILDING</span>
        <span>CLYRDEV / STUDIO</span>
      </div>
      <div className="scene-grid" aria-hidden="true" />
      <m.div className="building-art" style={{
        rotateX: motionEnabled ? rotateX : 0,
        rotateY: motionEnabled ? rotateY : 0,
      }}>
        <picture className="building-float">
          <source media="(max-width: 639px)" srcSet="/assets/hero/building-studio-mobile.webp" />
          <img src="/assets/hero/building-studio.webp"
            alt="블루 크레인이 새 층을 쌓아 올리는 화이트 빌딩의 3D 렌더링"
            width="1000" height="1000" fetchPriority="high" decoding="async" />
        </picture>
      </m.div>
      <div className="scene-note" aria-hidden="true">
        <span className="scene-note-icon"><Layers3 size={18} strokeWidth={1.5} /></span>
        <span><strong>한 층씩, 현실로.</strong><small>IDEA → BUILD → LAUNCH</small></span>
        <ArrowUpRight size={16} />
      </div>
      <div className="scene-bottomline">
        <span>GOOD THINGS ARE BUILT, NOT BORN.</span>
        {!reducedMotion ? (
          <button type="button" className="scene-motion-toggle"
            aria-label={paused ? "오브젝트 움직임 재생" : "오브젝트 움직임 일시정지"}
            aria-pressed={paused}
            onClick={() => { setPaused(!paused); resetTilt(); }}>
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
