import assert from "node:assert/strict";
import test from "node:test";
import { Matrix4, Vector3 } from "three";
import { createBuildingModel } from "../src/components/building/building-model.js";
import { createBuildingCamera } from "../src/components/building/create-building-viewer.js";
import { createFrameLoop } from "../src/components/building/frame-loop.js";

test("the complete building and crane stay inside the camera throughout a full rotation", () => {
  const model = createBuildingModel();
  const camera = createBuildingCamera();
  try {
    assert.ok(model.root.children.length <= 12, "Keep repeated parts in a small number of draw calls");
    const points = [];
    const transform = new Matrix4();
    let triangles = 0;
    for (const mesh of model.root.children) {
      assert.ok(mesh.isInstancedMesh);
      triangles += (mesh.geometry.index?.count ?? mesh.geometry.attributes.position.count) / 3 * mesh.count;
      mesh.geometry.computeBoundingBox();
      const { min, max } = mesh.geometry.boundingBox;
      for (let index = 0; index < mesh.count; index++) {
        mesh.getMatrixAt(index, transform);
        assert.ok(transform.elements.every(Number.isFinite));
        assert.ok(transform.determinant() > 0, "Every part has positive volume");
        for (const x of [min.x, max.x]) for (const y of [min.y, max.y]) for (const z of [min.z, max.z]) {
          points.push(new Vector3(x, y, z).applyMatrix4(transform));
        }
      }
    }
    assert.ok(triangles < 20_000, `Geometry budget exceeded: ${triangles}`);
    const point = new Vector3();
    for (let degrees = 0; degrees < 360; degrees += 5) {
      model.root.rotation.y = degrees * Math.PI / 180;
      model.root.updateMatrixWorld(true);
      for (const vertex of points) {
        point.copy(vertex).applyMatrix4(model.root.matrixWorld).project(camera);
        assert.ok(Math.abs(point.x) < 0.94 && Math.abs(point.y) < 0.94, `Clipped model at ${degrees}°`);
        assert.ok(point.z > -1 && point.z < 1);
      }
    }
  } finally {
    model.dispose();
  }
});

test("model teardown releases each shared geometry and material once", () => {
  const model = createBuildingModel();
  const resources = new Set(model.root.children.flatMap(mesh => [mesh.geometry, mesh.material]));
  const disposed = new Map();
  for (const resource of resources) resource.addEventListener("dispose", () => disposed.set(resource, (disposed.get(resource) || 0) + 1));
  model.dispose();
  assert.equal(model.root.children.length, 0);
  for (const resource of resources) assert.equal(disposed.get(resource), 1);
});

function fakeFrames() {
  let nextId = 0;
  const callbacks = new Map();
  return {
    callbacks,
    requestFrame: callback => { callbacks.set(++nextId, callback); return nextId; },
    cancelFrame: id => callbacks.delete(id),
    step(time) {
      const scheduled = [...callbacks.values()];
      callbacks.clear();
      scheduled.forEach(callback => callback(time));
    },
  };
}

test("pause stops frames; manual rotation still draws once and resume does not jump", () => {
  const frames = fakeFrames();
  const deltas = [];
  const loop = createFrameLoop(delta => deltas.push(delta), frames);
  loop.setActive(true);
  loop.setActive(true);
  assert.equal(frames.callbacks.size, 1);
  frames.step(100);
  frames.step(116);
  assert.deepEqual(deltas, [0, 0.016]);
  loop.setActive(false);
  assert.equal(frames.callbacks.size, 0);
  loop.invalidate();
  loop.invalidate();
  frames.step(200);
  assert.equal(deltas.at(-1), 0);
  assert.equal(frames.callbacks.size, 0);
  loop.setActive(true);
  frames.step(100_000);
  assert.equal(deltas.at(-1), 0, "Returning from a hidden tab must not fast-forward the rotation");
  frames.step(101_000);
  assert.equal(deltas.at(-1), 0.05, "Limit elapsed time after a long frame");
  loop.dispose();
  loop.invalidate();
  loop.setActive(true);
  assert.equal(frames.callbacks.size, 0);
});
