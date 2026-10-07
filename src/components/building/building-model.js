import {
  BoxGeometry, Group, IcosahedronGeometry, InstancedMesh, Matrix4,
  MeshStandardMaterial, Quaternion, Vector3,
} from "three";

// A real, closed-volume model of the existing white-and-cobalt construction
// illustration. Repeated columns, panes and truss members share draw calls.
export function createBuildingModel() {
  const root = new Group();
  root.name = "CLYRDEV construction model";
  const box = new BoxGeometry(1, 1, 1);
  const leaf = new IcosahedronGeometry(1, 1);
  const colors = {
    concrete: ["#f4f3ef", 0.82, 0],
    foundation: ["#e6e8e9", 0.86, 0],
    blue: ["#1447d9", 0.35, 0.22],
    dark: ["#122a63", 0.38, 0.35],
    glass: ["#397cc0", 0.2, 0.46],
    glassLight: ["#5595cc", 0.2, 0.46],
    glassDeep: ["#2863a7", 0.2, 0.46],
    reflection: ["#a7cde5", 0.22, 0.35],
    soil: ["#6a7261", 1, 0],
    foliage: ["#738468", 1, 0],
  };
  const materials = Object.fromEntries(Object.entries(colors).map(([key, [color, roughness, metalness]]) => [
    key, new MeshStandardMaterial({ color, roughness, metalness }),
  ]));
  const batches = new Map();
  const matrix = new Matrix4();
  const up = new Vector3(0, 1, 0);
  const identity = new Quaternion();

  function piece(material, position, scale, rotation = identity, geometry = box) {
    const key = `${material}:${geometry === leaf ? "leaf" : "box"}`;
    if (!batches.has(key)) batches.set(key, { material, geometry, matrices: [] });
    matrix.compose(new Vector3(...position), rotation, new Vector3(...scale));
    batches.get(key).matrices.push(matrix.clone());
  }
  function beam(material, start, end, thickness = 0.035) {
    const a = new Vector3(...start);
    const b = new Vector3(...end);
    const direction = b.clone().sub(a);
    piece(material, a.clone().add(b).multiplyScalar(0.5).toArray(),
      [thickness, direction.length(), thickness],
      new Quaternion().setFromUnitVectors(up, direction.normalize()));
  }

  piece("foundation", [0, 0, 0], [6.6, 0.25, 4.9]);
  piece("concrete", [0, 0.16, 0], [6.45, 0.08, 4.75]);

  const center = -0.65;
  const floorHeight = 0.92;
  const xs = [-2.3, -1.2, -0.1, 1];
  const zs = [-1.4, 0, 1.4];
  for (let level = 0; level <= 6; level++) {
    const y = 0.32 + level * floorHeight;
    piece("concrete", [center, y, 0], [3.65, 0.16, 3.12]);
    if (level === 6) continue;
    for (const x of xs) {
      for (const z of zs) {
        if (z === 0 && x !== xs[0] && x !== xs.at(-1)) continue;
        piece("concrete", [x, y + 0.49, z], [0.16, 0.82, 0.16]);
      }
    }
    // Four finished glazed floors; the top two keep their open structural frame.
    if (level < 4) {
      for (const side of [-1, 1]) {
        for (let pane = 0; pane < 12; pane++) {
          const x = center - 1.57 + pane * 0.285;
          const tint = ["glass", "glassLight", "glassDeep"][(pane + level) % 3];
          piece(tint, [x, y + 0.47, side * 1.39], [0.267, 0.77, 0.045]);
          piece("dark", [x - 0.141, y + 0.47, side * 1.42], [0.021, 0.8, 0.026]);
          if (pane % 4 === 1) piece("reflection", [x + 0.09, y + 0.49, side * 1.418], [0.024, 0.67, 0.008]);
        }
        for (let pane = 0; pane < 10; pane++) {
          const z = -1.26 + pane * 0.28;
          const x = center + side * 1.65;
          piece(pane % 3 === 0 ? "glassLight" : "glassDeep", [x, y + 0.47, z], [0.045, 0.77, 0.26]);
          piece("dark", [x + side * 0.028, y + 0.47, z - 0.138], [0.026, 0.8, 0.022]);
        }
      }
    } else {
      // Short reinforcement bars and material stacks distinguish the work site.
      for (const x of xs) for (const z of [-1.4, 1.4]) {
        piece("foundation", [x - 0.04, y + 0.99, z], [0.018, 0.23, 0.018]);
        piece("foundation", [x + 0.04, y + 0.99, z], [0.018, 0.23, 0.018]);
      }
      for (let i = 0; i < 7; i++) piece("blue", [level === 4 ? -1.65 : 0.45, y + 0.11 + i * 0.048, -0.65], [0.53, 0.035, 0.6]);
    }
  }

  // Entrance, steps, and planted edges on the plinth.
  piece("concrete", [center, 1.17, 1.66], [0.95, 0.12, 0.48]);
  for (const offset of [-0.4, 0.4]) piece("concrete", [center + offset, 0.72, 1.78], [0.12, 0.8, 0.13]);
  for (let step = 0; step < 3; step++) {
    piece("concrete", [center, 0.24 + step * 0.065, 2.12 - step * 0.16], [1.17, 0.07, 0.3]);
  }
  for (const [x, z] of [[-1.8, 1.95], [-2.8, 0.9], [0.5, 1.95]]) {
    piece("concrete", [x, 0.32, z], [0.57, 0.26, 0.4]);
    piece("soil", [x, 0.458, z], [0.48, 0.02, 0.32]);
    piece("soil", [x, 0.64, z], [0.05, 0.4, 0.05]);
    for (let clump = 0; clump < 5; clump++) {
      const angle = clump * 2.4;
      piece("foliage", [x + Math.cos(angle) * 0.12, 0.84 + (clump % 2) * 0.12, z + Math.sin(angle) * 0.1], [0.2, 0.23, 0.18], identity, leaf);
    }
  }

  // Cobalt tower crane, assembled as four-sided trusses so the back is complete.
  const mastX = 2.25;
  const mastZ = -0.55;
  const half = 0.22;
  piece("blue", [mastX, 0.36, mastZ], [1.27, 0.25, 1.12]);
  for (const offset of [-0.39, 0.39]) {
    for (let i = 0; i < 4; i++) piece("foundation", [mastX + offset, 0.54 + i * 0.12, mastZ], [0.36, 0.105, 0.77]);
    beam("blue", [mastX + offset * 1.5, 0.4, mastZ], [mastX, 1.65, mastZ], 0.12);
  }
  for (const dx of [-half, half]) for (const dz of [-half, half]) {
    beam("blue", [mastX + dx, 0.55, mastZ + dz], [mastX + dx, 8.02, mastZ + dz], 0.075);
  }
  const corners = [[-half, -half], [half, -half], [half, half], [-half, half]];
  for (let level = 0; level < 15; level++) {
    const y = 0.65 + level * 0.48;
    for (let side = 0; side < 4; side++) {
      const a = corners[side];
      const b = corners[(side + 1) % 4];
      beam("blue", [mastX + a[0], y, mastZ + a[1]], [mastX + b[0], y, mastZ + b[1]], 0.046);
      beam("blue", [mastX + a[0], y, mastZ + a[1]], [mastX + b[0], y + 0.48, mastZ + b[1]], 0.036);
    }
  }
  piece("blue", [mastX, 7.7, mastZ], [0.85, 0.13, 0.86]);
  piece("concrete", [mastX - 0.1, 7.53, mastZ + 0.55], [0.54, 0.56, 0.56]);
  piece("glassDeep", [mastX - 0.1, 7.55, mastZ + 0.835], [0.4, 0.37, 0.016]);
  piece("glass", [mastX - 0.378, 7.55, mastZ + 0.55], [0.016, 0.37, 0.41]);

  const jibStart = -3.15;
  const jibEnd = 3.45;
  for (const z of [mastZ - 0.2, mastZ + 0.2]) {
    for (const y of [7.98, 8.31]) beam("blue", [jibStart, y, z], [jibEnd, y, z], 0.057);
    for (let i = 0; i < 12; i++) {
      const x = jibStart + i * 0.55;
      beam("blue", [x, 7.98, z], [x + 0.55, 8.31, z], 0.035);
      beam("blue", [x, 8.31, z], [x + 0.55, 7.98, z], 0.035);
      beam("blue", [x, 8.31, mastZ - 0.2], [x, 8.31, mastZ + 0.2], 0.035);
    }
  }
  for (const dx of [-0.25, 0.25]) beam("blue", [mastX + dx, 8.15, mastZ], [mastX, 9.02, mastZ], 0.066);
  beam("blue", [mastX, 9.02, mastZ], [jibStart + 0.4, 8.31, mastZ], 0.028);
  beam("blue", [mastX, 9.02, mastZ], [jibEnd, 8.31, mastZ], 0.032);
  for (let i = 0; i < 3; i++) piece("foundation", [3.15 + i * 0.14, 7.78, mastZ], [0.12, 0.62, 0.64]);

  // Hoisted floor plate and its four slings.
  piece("concrete", [center, 6.66, mastZ], [3.25, 0.17, 2.66]);
  piece("blue", [center, 7.91, mastZ], [0.34, 0.12, 0.44]);
  beam("dark", [center, 7.91, mastZ], [center, 7.25, mastZ], 0.024);
  piece("blue", [center, 7.25, mastZ], [0.13, 0.16, 0.13]);
  for (const x of [-1.24, 1.24]) for (const z of [-0.96, 0.96]) {
    beam("blue", [center, 7.25, mastZ], [center + x, 6.79, mastZ + z], 0.024);
  }
  for (let stack = 0; stack < 9; stack++) piece("blue", [-2.62, 0.29 + stack * 0.055, -1.82], [0.7, 0.04, 0.6]);
  for (let panel = 0; panel < 6; panel++) piece("blue", [1.8 + panel * 0.105, 0.6, 1.8], [0.055, 0.74, 0.56]);

  for (const { material, geometry, matrices } of batches.values()) {
    const mesh = new InstancedMesh(geometry, materials[material], matrices.length);
    mesh.name = material;
    matrices.forEach((transform, index) => mesh.setMatrixAt(index, transform));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.computeBoundingSphere();
    root.add(mesh);
  }

  return {
    root,
    dispose() {
      root.children.forEach(mesh => mesh.dispose());
      box.dispose();
      leaf.dispose();
      Object.values(materials).forEach(material => material.dispose());
      root.clear();
    },
  };
}
