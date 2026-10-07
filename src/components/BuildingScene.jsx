import { useRef, useState } from "react";
import { m, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Pause, Play } from "lucide-react";

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
    x.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
    y.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
  };

  return (
    <div className="building-scene" ref={sceneRef}
      data-animated={motionEnabled && inView}
      onPointerMove={followPointer} onPointerLeave={resetTilt}>
      <picture className="blueprint-underlay" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/assets/hero/blueprint-underlay-mobile.webp" />
        <img src="/assets/hero/blueprint-underlay.webp" alt=""
          width="1200" height="1200" decoding="async" />
      </picture>
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
      <div className="scene-controls">
        {!reducedMotion ? (
          <button type="button" className="scene-motion-toggle"
            aria-label={paused ? "오브젝트 움직임 재생" : "오브젝트 움직임 일시정지"}
            aria-pressed={paused}
            onClick={() => { setPaused(!paused); resetTilt(); }}>
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
