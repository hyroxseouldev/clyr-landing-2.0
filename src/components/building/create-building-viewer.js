import {
  ACESFilmicToneMapping, DirectionalLight, HemisphereLight, Mesh,
  OrthographicCamera, PCFShadowMap, PlaneGeometry, Scene, ShadowMaterial,
  WebGLRenderer,
} from "three";
import { createBuildingModel } from "./building-model.js";
import { createFrameLoop } from "./frame-loop.js";

export function createBuildingCamera(aspect = 1) {
  const height = 11.8;
  const camera = new OrthographicCamera(-height * aspect / 2, height * aspect / 2, height / 2, -height / 2, 0.1, 80);
  camera.position.set(11, 11.85, 16);
  camera.lookAt(0, 4.1, 0);
  camera.updateMatrixWorld();
  return camera;
}

export function createBuildingViewer(host, { onUnavailable } = {}) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.className = "building-webgl";
  canvas.tabIndex = 0;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "흰 건물과 파란 크레인의 3D 모델. 드래그 또는 좌우 방향키로 회전하고 Home 키로 원래 각도로 돌아갑니다.");

  const scene = new Scene();
  const camera = createBuildingCamera();
  const model = createBuildingModel();
  scene.add(model.root);
  scene.add(new HemisphereLight(0xeaf2ff, 0x8a8c91, 2.1));
  const key = new DirectionalLight(0xfffaf0, 3.2);
  key.position.set(5, 14, 9);
  key.target.position.set(0, 4, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 0.5, far: 35 });
  key.shadow.normalBias = 0.035;
  key.shadow.bias = -0.0002;
  scene.add(key, key.target);
  const rim = new DirectionalLight(0xd7e5ff, 1.1);
  rim.position.set(-6, 8, -8);
  scene.add(rim);
  const ground = new Mesh(new PlaneGeometry(40, 40), new ShadowMaterial({ color: 0x526c96, opacity: 0.17 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.14;
  ground.receiveShadow = true;
  scene.add(ground);

  let disposed = false;
  let ready = false;
  let visible = false;
  let autoRotate = false;
  let pointer = null;
  let resumeAt = 0;
  let lastPaint = -Infinity;
  const loop = createFrameLoop((delta, time) => {
    if (!ready || disposed) return;
    if (autoRotate && !pointer && time >= resumeAt) model.root.rotation.y += delta * Math.PI / 20;
    // Thirty frames per second is enough for the slow turntable motion.
    if (delta > 0 && time - lastPaint < 1000 / 30) return;
    renderer.render(scene, camera);
    lastPaint = time;
  });
  function syncPlayback() {
    loop.setActive(ready && visible && autoRotate && !document.hidden && !pointer);
  }
  function resize() {
    if (disposed) return;
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.left = -5.9 * width / height;
    camera.right = 5.9 * width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (visible && !document.hidden) loop.invalidate();
  }
  function stopPointer(event) {
    if (pointer?.id !== event.pointerId) return;
    pointer = null;
    canvas.removeAttribute("data-dragging");
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    resumeAt = performance.now() + 2000;
    syncPlayback();
  }
  function pointerDown(event) {
    if (pointer || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointer = { id: event.pointerId, x: event.clientX };
    canvas.setPointerCapture(event.pointerId);
    canvas.setAttribute("data-dragging", "true");
    syncPlayback();
  }
  function pointerMove(event) {
    if (pointer?.id !== event.pointerId) return;
    const width = Math.max(host.clientWidth, 1);
    model.root.rotation.y += (event.clientX - pointer.x) / width * Math.PI * 2;
    pointer.x = event.clientX;
    loop.invalidate();
  }
  function reset() {
    model.root.rotation.y = 0;
    resumeAt = performance.now() + 2000;
    loop.invalidate();
  }
  function keyDown(event) {
    if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") reset();
    else {
      model.root.rotation.y += (event.key === "ArrowLeft" ? -1 : 1) * Math.PI / 12;
      resumeAt = performance.now() + 2000;
      loop.invalidate();
    }
  }
  function visibilityChanged() {
    syncPlayback();
    if (document.hidden) loop.setActive(false);
    else if (visible) loop.invalidate();
  }
  function contextLost(event) {
    event.preventDefault();
    dispose();
    onUnavailable?.();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", stopPointer);
  canvas.addEventListener("pointercancel", stopPointer);
  canvas.addEventListener("lostpointercapture", stopPointer);
  canvas.addEventListener("keydown", keyDown);
  canvas.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", visibilityChanged);
  host.appendChild(canvas);
  resize();

  function dispose() {
    if (disposed) return;
    disposed = true;
    loop.dispose();
    observer.disconnect();
    canvas.removeEventListener("pointerdown", pointerDown);
    canvas.removeEventListener("pointermove", pointerMove);
    canvas.removeEventListener("pointerup", stopPointer);
    canvas.removeEventListener("pointercancel", stopPointer);
    canvas.removeEventListener("lostpointercapture", stopPointer);
    canvas.removeEventListener("keydown", keyDown);
    canvas.removeEventListener("webglcontextlost", contextLost);
    document.removeEventListener("visibilitychange", visibilityChanged);
    model.dispose();
    ground.geometry.dispose();
    ground.material.dispose();
    key.shadow.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }

  return {
    ready: renderer.compileAsync(scene, camera).then(() => {
      if (disposed) return;
      renderer.render(scene, camera);
      ready = true;
      syncPlayback();
    }),
    setPlayback(options) {
      if (disposed) return;
      visible = options.visible;
      autoRotate = options.autoRotate;
      syncPlayback();
      if (visible && !document.hidden) loop.invalidate();
    },
    reset,
    dispose,
  };
}
