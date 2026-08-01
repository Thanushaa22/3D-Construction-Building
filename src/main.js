import * as THREE from 'three';

/* ═══════════════════════════════════════════
   APEX STRUCTURES — Premium 3D Experience
   Scroll-driven luxury villa walkthrough
   ═══════════════════════════════════════════ */

// ── Globals ──
let scene, camera, renderer, clock;
let scrollProgress = 0, targetScroll = 0;
let isStarted = false, loadPct = 0;
const objects = [], anims = [];
let waterMesh, fireLight, dustPts, birdGroup = [];
let currentSection = 0;

// ── Materials ──
const M = {};
function initMaterials() {
  const p = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m || 0 });
  const phys = (c, r, opts = {}) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, ...opts });

  M.concrete = p(0x8a8a8a, 0.88);
  M.concreteDk = p(0x4a4a4a, 0.92);
  M.concreteLt = p(0xb5b0a8, 0.82);
  M.woodDk = p(0x3d2b1f, 0.72);
  M.woodLt = p(0x8b6f47, 0.65);
  M.woodWarm = p(0xa0845c, 0.6);
  M.woodFloor = p(0xc4a77d, 0.55);
  M.marble = p(0xf5f0e8, 0.18, 0.05);
  M.stoneDk = p(0x2a2a2a, 0.4, 0.1);
  M.travertine = p(0xd4c5a9, 0.35, 0.02);
  M.metalBlk = p(0x1a1a1a, 0.28, 0.92);
  M.metalBr = p(0x888888, 0.22, 0.95);
  M.metalGold = p(0xc9a96e, 0.2, 0.9);
  M.glass = phys(0xffffff, 0.05, { transmission: 0.9, thickness: 0.02, ior: 1.5, transparent: true, opacity: 0.3 });
  M.glassTint = phys(0x8899aa, 0.05, { transmission: 0.7, thickness: 0.02, transparent: true, opacity: 0.4 });
  M.fabW = p(0xf0ede6, 0.92);
  M.fabGray = p(0x6b6b6b, 0.88);
  M.fabNavy = p(0x1a2744, 0.88);
  M.fabBeige = p(0xd4c5a0, 0.92);
  M.leather = p(0x2c1810, 0.6, 0.05);
  M.leatherTan = p(0x8b6914, 0.55, 0.02);
  M.emWarm = p(0xffd4a0, 0.5); M.emWarm.emissive = new THREE.Color(0xffd4a0); M.emWarm.emissiveIntensity = 2;
  M.emCool = p(0xa0c4ff, 0.5); M.emCool.emissive = new THREE.Color(0xa0c4ff); M.emCool.emissiveIntensity = 1.5;
  M.emFire = p(0xff6622, 0.5); M.emFire.emissive = new THREE.Color(0xff4400); M.emFire.emissiveIntensity = 3;
  M.water = phys(0x0077bb, 0.0, { transmission: 0.8, thickness: 2, ior: 1.33, transparent: true, opacity: 0.7, metalness: 0.1 });
  M.leaf = p(0x2d5a1e, 0.85);
  M.leafDk = p(0x1a3d12, 0.88);
  M.soil = p(0x3d2b1f, 0.95);
  M.grass = p(0x3a7a28, 0.92);
  M.plasterW = p(0xf8f6f0, 0.94);
  M.plasterWarm = p(0xf0e8d8, 0.92);
}

// ── Geometry helpers ──
function box(w, h, d, mat, x, y, z) {
  const g = new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  objects.push(m);
  return m;
}
function cyl(rt, rb, h, s, mat, x, y, z) {
  const g = new THREE.CylinderGeometry(rt, rb, h, s);
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  objects.push(m);
  return m;
}
function sph(r, ws, hs, mat, x, y, z) {
  const g = new THREE.SphereGeometry(r, ws, hs);
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  scene.add(m);
  objects.push(m);
  return m;
}
function plane(w, h, mat, x, y, z, rx, ry) {
  const g = new THREE.PlaneGeometry(w, h);
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  m.rotation.x = rx || 0;
  if (ry) m.rotation.y = ry;
  m.receiveShadow = true;
  scene.add(m);
  objects.push(m);
  return m;
}

// ── Build Villa ──
function buildVilla() {
  // Ground
  plane(120, 120, M.soil, 0, -0.05, 0, -Math.PI / 2);
  plane(120, 120, M.grass, 0, 0.01, 0, -Math.PI / 2);

  // Driveway
  box(8, 0.15, 30, M.stoneDk, -12, 0.08, 0);

  // ═══ GROUND FLOOR SLAB ═══
  box(32, 0.3, 24, M.concreteLt, 0, 0.15, 0);
  box(31.8, 0.05, 23.8, M.woodFloor, 0, 0.33, 0);

  // ═══ FOYER ═══
  box(0.3, 8, 8, M.concrete, -6, 4, -4);
  box(0.3, 8, 8, M.concrete, 6, 4, -4);
  box(8, 8, 0.3, M.concrete, 0, 4, -8);
  box(6, 5, 0.12, M.glass, 0, 2.5, 8);
  box(0.12, 5, 0.25, M.metalBlk, -1.5, 2.5, 8);
  box(0.12, 5, 0.25, M.metalBlk, 1.5, 2.5, 8);
  box(3.2, 0.12, 0.25, M.metalBlk, 0, 5, 8);
  // Foyer floor detail
  box(4, 0.04, 4, M.marble, 0, 0.35, 0);
  // Console
  box(2, 0.8, 0.4, M.woodDk, 0, 0.7, -7.5);
  box(1.8, 0.05, 0.35, M.marble, 0, 1.12, -7.5);
  cyl(0.12, 0.08, 0.5, 12, M.marble, 0, 1.4, -7.5);
  // Pendant
  cyl(0.35, 0.18, 0.25, 12, M.metalGold, 0, 7.2, -4);
  sph(0.08, 8, 8, M.emWarm, 0, 7, -4);

  // ═══ LIVING ROOM ═══
  box(0.3, 4, 12, M.plasterW, 6, 2, 0);
  box(12, 4, 0.3, M.plasterW, 12, 2, -6);
  box(12, 4, 0.3, M.plasterW, 12, 2, 6);
  box(0.12, 4, 8, M.glass, 18, 2, 0);
  box(0.12, 4, 4, M.glass, 18, 2, 5);
  // Frames
  for (let i = -1; i <= 1; i++) box(0.06, 4, 0.06, M.metalBlk, 18, 2, i * 4);
  // Fireplace wall
  box(6, 4, 0.3, M.stoneDk, 12, 2, -6);
  box(2.5, 1.8, 0.5, M.metalBlk, 12, 1.2, -5.7);
  box(1.5, 0.3, 0.2, M.emFire, 12, 0.8, -5.4);
  // Sofa
  box(3.5, 0.5, 1.2, M.concrete, 11, 0.55, 0);
  box(3.3, 0.4, 1, M.fabGray, 11, 0.8, 0);
  box(3.3, 0.5, 0.15, M.fabGray, 11, 0.85, -0.5);
  box(2, 0.5, 1, M.concrete, 15, 0.55, 3);
  box(1.8, 0.4, 0.8, M.fabNavy, 15, 0.8, 3);
  // Coffee table
  box(1.5, 0.35, 0.8, M.metalBlk, 12, 0.175, 1.5);
  box(1.4, 0.05, 0.7, M.marble, 12, 0.38, 1.5);
  // Rug
  box(4, 0.03, 3, M.fabBeige, 12, 0.34, 1);
  // Bookshelf
  box(2, 3, 0.35, M.woodDk, 12, 1.5, -5.5);
  for (let sh = 0; sh < 4; sh++) {
    box(1.8, 0.03, 0.3, M.woodDk, 12, 0.5 + sh * 0.8, -5.5);
    for (let b = 0; b < 6; b++) {
      const bc = [0x8b0000, 0x00008b, 0x006400, 0x8b4513, 0x4a0080, 0x8b8000][b];
      const bm = new THREE.MeshStandardMaterial({ color: bc, roughness: 0.8 });
      const bk = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25 + Math.random() * 0.1, 0.2), bm);
      bk.position.set(11.2 + b * 0.28, 0.65 + sh * 0.8, -5.5);
      bk.castShadow = true;
      scene.add(bk);
      objects.push(bk);
    }
  }
  // Floor lamp
  cyl(0.02, 0.02, 2, 8, M.metalBlk, 16.5, 1, 1);
  cyl(0.18, 0.12, 0.28, 8, M.fabW, 16.5, 2.1, 1);
  sph(0.06, 6, 6, M.emWarm, 16.5, 2, 1);

  // ═══ DINING ═══
  box(0.3, 4, 10, M.plasterW, 6, 2, 6);
  box(10, 4, 0.3, M.plasterW, 11, 2, 11);
  box(0.12, 4, 6, M.glass, 16, 2, 8);
  box(3, 0.12, 1.5, M.woodDk, 11, 1.1, 8);
  for (let i = 0; i < 4; i++) box(0.08, 1, 0.08, M.metalBlk, 10 + (i % 2) * 2, 0.5, 7.5 + Math.floor(i / 2));
  for (let i = 0; i < 6; i++) {
    const s = i < 3 ? -1 : 1;
    box(0.5, 0.05, 0.5, M.leatherTan, 10 + (i % 3), 0.75, 8 + s * 1.2);
    box(0.5, 0.5, 0.05, M.leatherTan, 10 + (i % 3), 1, 8 + s * 1.45);
  }
  box(2, 0.06, 0.35, M.metalBlk, 11, 3.2, 8);
  box(1.8, 0.04, 0.3, M.emWarm, 11, 3.1, 8);

  // ═══ KITCHEN ═══
  box(10, 4, 0.3, M.plasterW, 11, 2, -6);
  box(0.3, 4, 8, M.concrete, 6, 2, -10);
  box(8, 4, 0.3, M.concrete, 10, 2, -14);
  // Island
  box(4, 0.15, 1.5, M.marble, 11, 1.1, -10);
  box(3.8, 1, 1.3, M.plasterW, 11, 0.55, -10);
  // Cabinets
  box(4, 0.8, 0.5, M.woodDk, 11, 2.8, -13.5);
  box(4, 0.15, 0.7, M.marble, 11, 1.1, -13.5);
  box(4, 1, 0.6, M.plasterW, 11, 0.5, -13.5);
  for (let i = 0; i < 3; i++) {
    cyl(0.12, 0.08, 0.18, 8, M.metalBlk, 10 + i, 3, -10);
    sph(0.05, 6, 6, M.emWarm, 10 + i, 2.9, -10);
  }
  for (let i = 0; i < 4; i++) {
    cyl(0.18, 0.18, 0.04, 12, M.leather, 9.5 + i, 0.8, -9.2);
    cyl(0.025, 0.025, 0.7, 8, M.metalBlk, 9.5 + i, 0.45, -9.2);
  }

  // ═══ OFFICE ═══
  box(8, 4, 0.3, M.plasterW, -3, 2, -14);
  box(0.3, 4, 6, M.plasterW, -7, 2, -11);
  box(6, 4, 0.3, M.plasterW, -4, 2, -8);
  box(4, 3, 0.12, M.glass, -4, 2, -14);
  box(2, 0.08, 1, M.woodDk, -4, 1.1, -10);
  box(0.08, 1, 0.08, M.metalBlk, -4.8, 0.55, -10.4);
  box(0.08, 1, 0.08, M.metalBlk, -3.2, 0.55, -10.4);
  cyl(0.22, 0.22, 0.06, 12, M.leather, -4, 0.8, -9.2);
  box(0.5, 0.6, 0.04, M.leather, -4, 1.1, -8.95);
  box(1.2, 0.7, 0.04, M.metalBlk, -4, 1.55, -10.4);

  // ═══ GUEST SUITE ═══
  box(0.3, 4, 8, M.plasterW, -8, 2, 0);
  box(8, 4, 0.3, M.plasterW, -12, 2, -4);
  box(8, 4, 0.3, M.plasterW, -12, 2, 4);
  box(0.3, 4, 8, M.plasterW, -16, 2, 0);
  box(2, 0.4, 2.2, M.woodDk, -12, 0.5, 0);
  box(1.9, 0.15, 2, M.fabW, -12, 0.78, 0);
  box(1.9, 0.3, 0.2, M.fabW, -12, 0.85, -1);
  box(0.5, 0.15, 0.35, M.fabW, -12.3, 0.95, -0.8);
  box(0.5, 0.15, 0.35, M.fabW, -11.7, 0.95, -0.8);
  box(0.5, 0.5, 0.4, M.woodDk, -13.5, 0.25, 0);
  box(0.5, 0.5, 0.4, M.woodDk, -10.5, 0.25, 0);

  // ═══ GARAGE ═══
  box(10, 4, 8, M.concrete, -16, 2, -12);
  box(10, 4, 0.3, M.concrete, -16, 2, -16);
  box(0.3, 4, 8, M.concrete, -21, 2, -12);
  box(10, 0.3, 8, M.concreteDk, -16, 3.85, -12);
  box(6, 3, 0.12, M.metalBlk, -16, 1.5, -8);
  // Car
  box(4.5, 1.2, 2, M.metalBlk, -16, 0.7, -12);
  box(4, 0.8, 1.8, M.metalBlk, -16, 1.5, -12);
  for (const cx of [-17.5, -14.5]) for (const cz of [-11, -13]) cyl(0.32, 0.32, 0.28, 16, M.metalBlk, cx, 0.32, cz);

  // ═══ STAIRCASE ═══
  for (let i = 0; i < 16; i++) box(1.5, 0.14, 0.5, M.concrete, -4 + i * 0.3, 0.5 + i * 0.25, 10);
  box(0.1, 4, 5, M.glass, -2, 2, 10);
  box(0.04, 0.04, 5, M.metalBr, -2.1, 4, 10);

  // ═══ ELEVATOR ═══
  box(2, 8, 2, M.glassTint, -2, 4, 10);

  // ═══ FIRST FLOOR SLAB ═══
  box(32, 0.3, 24, M.concreteLt, 0, 4.15, 0);

  // ═══ MASTER BEDROOM ═══
  box(0.3, 4, 10, M.plasterW, 6, 6, 0);
  box(10, 4, 0.3, M.plasterW, 11, 6, -5);
  box(0.12, 4, 8, M.glass, 16, 6, 1);
  box(0.12, 4, 4, M.glass, 16, 6, -3);
  // Bed
  box(2.2, 0.5, 2.5, M.woodDk, 12, 4.65, -1);
  box(2.1, 0.2, 2.3, M.fabW, 12, 4.95, -1);
  box(2.1, 0.4, 0.2, M.fabGray, 12, 5.05, -2.1);
  box(2.2, 1.5, 0.12, M.fabGray, 12, 5.5, -2.2);
  for (let i = 0; i < 4; i++) box(0.4, 0.12, 0.3, M.fabW, 11.4 + i * 0.4, 5.15, -1.8);
  box(3, 0.03, 4, M.fabBeige, 12, 4.35, -1);
  box(2, 1.2, 0.06, M.metalBlk, 12, 5.8, 4.8);
  box(1.9, 1.1, 0.04, M.emCool, 12, 5.8, 4.85);

  // ═══ MASTER BATH ═══
  box(8, 4, 0.3, M.marble, 12, 6, -9);
  box(0.3, 4, 6, M.marble, 8, 6, -7);
  box(1.8, 0.6, 0.8, M.marble, 12, 4.6, -8);
  box(2.5, 0.12, 0.6, M.marble, 10, 5.1, -9.5);
  box(2.5, 0.8, 0.5, M.plasterW, 10, 4.7, -9.5);
  box(2, 1.5, 0.04, M.glass, 10, 5.8, -9.8);
  box(1.8, 0.04, 0.04, M.emWarm, 10, 6.6, -9.8);

  // ═══ HOME THEATER ═══
  box(10, 4, 0.3, M.plasterW, 11, 6, 5);
  box(0.3, 4, 8, M.plasterW, 6, 6, 9);
  box(8, 4, 0.3, M.plasterW, 10, 6, 9);
  for (let r = 0; r < 3; r++) for (let s = 0; s < 4; s++) {
    box(0.6, 0.4, 0.6, M.leather, 10 + s * 0.9, 4.5 + r * 0.3, 6 + r * 1.2);
    box(0.6, 0.5, 0.06, M.leather, 10 + s * 0.9, 4.75 + r * 0.3, 5.75 + r * 1.2);
  }
  box(5, 3, 0.08, M.metalBlk, 12, 6, 5.05);
  box(4.9, 2.9, 0.04, M.emCool, 12, 6, 5.1);

  // ═══ GYM ═══
  box(8, 4, 0.3, M.plasterW, -3, 6, -4);
  box(0.3, 4, 8, M.plasterW, -7, 6, 0);
  box(8, 4, 0.3, M.plasterW, -3, 6, 4);
  box(0.3, 4, 8, M.plasterW, 1, 6, 0);
  box(0.8, 1, 2, M.metalBlk, -3, 4.8, -2);
  box(1.5, 1.5, 0.3, M.metalBlk, -6, 5.05, 0);
  box(0.6, 0.02, 1.8, M.emCool, -4, 4.33, 2);

  // ═══ WINE CELLAR ═══
  box(6, 4, 0.3, M.stoneDk, -12, 6, -4);
  box(0.3, 4, 6, M.stoneDk, -15, 6, -1);
  box(6, 4, 0.3, M.stoneDk, -12, 6, 2);
  for (let i = 0; i < 5; i++) {
    box(1.5, 0.1, 0.3, M.woodDk, -12, 5 + i * 0.6, -3.5);
    box(1.5, 0.1, 0.3, M.woodDk, -12, 5 + i * 0.6, -2.5);
  }

  // ═══ SPA ═══
  box(8, 4, 0.3, M.travertine, -12, 6, 5);
  box(0.3, 4, 6, M.travertine, -16, 6, 8);
  box(8, 4, 0.3, M.travertine, -12, 6, 11);
  box(3, 0.4, 3, M.travertine, -12, 4.5, 8);
  box(2.8, 0.3, 2.8, M.water, -12, 4.65, 8);

  // ═══ ROOF ═══
  box(34, 0.4, 26, M.concrete, 0, 8.3, 0);
  box(14, 0.15, 12, M.travertine, 2, 8.45, 0);
  for (const gz of [-6, 6]) box(14, 0.7, 0.12, M.glass, 2, 8.8, gz);
  for (const gx of [-5, 9]) box(0.12, 0.7, 12, M.glass, gx, 8.8, 0);
  // Pergola
  for (let i = 0; i < 6; i++) box(0.12, 0.08, 8, M.metalBlk, -3 + i * 1.5, 9.5, 0);
  for (const pz of [-4, 4]) { box(0.12, 2, 0.12, M.metalBlk, -3, 9, pz); box(0.12, 2, 0.12, M.metalBlk, 4.5, 9, pz); }
  // Rooftop furniture
  box(3, 0.4, 1, M.concrete, 2, 8.65, 3);
  box(2.8, 0.3, 0.8, M.fabW, 2, 8.85, 3);
  box(1.2, 0.3, 0.6, M.marble, 2, 8.6, 1);

  // ═══ EXTERIOR ═══
  // Pool
  box(12, 0.3, 6, M.stoneDk, 20, 0.15, -4);
  box(11.5, 0.2, 5.5, M.water, 20, 0.35, -4);
  for (const ez of [-1.15, -6.85]) box(12.4, 0.12, 0.12, M.marble, 20, 0.35, ez);
  box(0.12, 0.12, 6.3, M.marble, 13.95, 0.35, -4);
  box(16, 0.1, 10, M.travertine, 20, 0.05, -4);
  for (let i = 0; i < 3; i++) { box(0.5, 0.3, 2, M.metalBlk, 26 + i * 0.3, 0.25, -2 + i * 1.2); box(0.5, 0.1, 1.8, M.fabW, 26 + i * 0.3, 0.45, -2 + i * 1.2); }

  // Outdoor lounge
  box(6, 0.2, 4, M.travertine, 20, 0.1, 6);
  box(2, 0.4, 0.8, M.concrete, 19, 0.3, 4.5);
  box(2, 0.4, 0.8, M.concrete, 19, 0.3, 7.5);
  box(1.8, 0.3, 0.7, M.fabW, 19, 0.65, 4.5);
  box(1.8, 0.3, 0.7, M.fabW, 19, 0.65, 7.5);

  // Fire pit
  cyl(0.8, 0.8, 0.4, 24, M.stoneDk, 22, 0.3, 0);
  cyl(0.5, 0.5, 0.3, 24, M.metalBlk, 22, 0.55, 0);

  // Pavilion
  for (const px of [-22, -16]) for (const pz of [8, 14]) box(0.12, 3.5, 0.12, M.metalBlk, px, 1.85, pz);
  box(7, 0.12, 7, M.concrete, -19, 3.6, 11);
  box(3, 0.1, 1.2, M.woodDk, -19, 1.1, 11);

  // BBQ
  box(2, 1.2, 0.8, M.stoneDk, -24, 0.7, 11);
  box(1.8, 0.1, 0.6, M.metalBr, -24, 1.3, 11);

  // Entrance path
  box(3, 0.1, 8, M.travertine, 0, 0.05, 14);
  cyl(0.18, 0.18, 6, 16, M.concrete, -2, 3, 8);
  cyl(0.18, 0.18, 6, 16, M.concrete, 2, 3, 8);

  // Trees
  const trees = [[25,15],[-25,15],[25,-15],[-25,-15],[30,5],[-30,5],[15,22],[-15,22],[0,25],[28,-10],[-28,-10]];
  trees.forEach(([tx, tz]) => {
    cyl(0.14, 0.18, 4, 8, M.woodDk, tx, 2, tz);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      sph(1.4, 8, 8, M.leaf, tx + Math.sin(a) * 1.1, 4.4 + Math.random() * 0.4, tz + Math.cos(a) * 1.1);
    }
  });

  // Bushes
  for (let i = 0; i < 18; i++) {
    const a = Math.random() * Math.PI * 2, d = 15 + Math.random() * 14;
    sph(0.4 + Math.random() * 0.5, 6, 6, M.leafDk, Math.sin(a) * d, 0.35, Math.cos(a) * d);
  }

  // Hedges
  for (let i = 0; i < 7; i++) box(2, 1.1, 0.45, M.leafDk, -19 + i * 2.2, 0.55, 18);

  // Garden lights
  [[5,18],[-5,18],[15,18],[-15,18],[25,10],[-25,10]].forEach(([lx, lz]) => {
    cyl(0.08, 0.12, 0.5, 8, M.metalBlk, lx, 0.25, lz);
    sph(0.1, 6, 6, M.emWarm, lx, 0.6, lz);
  });

  // Exterior wall lights
  for (let i = 0; i < 5; i++) box(0.25, 0.15, 0.12, M.emWarm, 6.2, 3, -8 + i * 4);
}

// ── Water surface animation ──
function createWater() {
  const g = new THREE.PlaneGeometry(11, 5, 24, 24);
  const m = new THREE.MeshPhysicalMaterial({
    color: 0x0077bb, roughness: 0.0, metalness: 0.1,
    transmission: 0.7, transparent: true, opacity: 0.6
  });
  waterMesh = new THREE.Mesh(g, m);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.set(20, 0.4, -4);
  scene.add(waterMesh);
}

// ── Dust particles ──
function createDust() {
  const g = new THREE.BufferGeometry();
  const n = 120;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = Math.random() * 8;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ color: 0xffffee, size: 0.03, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
  dustPts = new THREE.Points(g, m);
  scene.add(dustPts);
}

// ── Birds ──
function createBirds() {
  for (let i = 0; i < 6; i++) {
    const bg = new THREE.Group();
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 4), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    body.rotation.x = Math.PI / 2;
    bg.add(body);
    const wg = new THREE.PlaneGeometry(0.12, 0.04);
    const wm = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const lw = new THREE.Mesh(wg, wm); lw.position.x = -0.07; bg.add(lw);
    const rw = new THREE.Mesh(wg, wm); rw.position.x = 0.07; bg.add(rw);
    bg.position.set((Math.random() - 0.5) * 50, 16 + Math.random() * 8, (Math.random() - 0.5) * 50);
    scene.add(bg);
    birdGroup.push({ mesh: bg, lw, rw, speed: 1.5 + Math.random() * 2, phase: Math.random() * 6.28, r: 14 + Math.random() * 18, angle: Math.random() * 6.28, h: 16 + Math.random() * 8, cx: (Math.random() - 0.5) * 16, cz: (Math.random() - 0.5) * 16 });
  }
}

// ── Lighting ──
const lights = {};
function setupLighting() {
  lights.ambient = new THREE.AmbientLight(0xffeedd, 0.35);
  scene.add(lights.ambient);
  lights.hemi = new THREE.HemisphereLight(0x87ceeb, 0x3d2b1f, 0.4);
  scene.add(lights.hemi);
  lights.sun = new THREE.DirectionalLight(0xff8844, 1.8);
  lights.sun.position.set(25, 30, 10);
  lights.sun.castShadow = true;
  lights.sun.shadow.mapSize.set(2048, 2048);
  lights.sun.shadow.camera.near = 0.5;
  lights.sun.shadow.camera.far = 100;
  lights.sun.shadow.camera.left = -40;
  lights.sun.shadow.camera.right = 40;
  lights.sun.shadow.camera.top = 40;
  lights.sun.shadow.camera.bottom = -40;
  lights.sun.shadow.bias = -0.0008;
  scene.add(lights.sun);
  lights.fill = new THREE.DirectionalLight(0xa0c4ff, 0.25);
  lights.fill.position.set(-10, 15, -10);
  scene.add(lights.fill);

  // Interior point lights
  [[0,6,-4,2],[12,3,0,2.5],[11,3,8,2],[11,3,-10,2.5],[8,3,-16,1.5],[-4,3,-11,1.5],[-12,3,0,2],[12,7,-1,2.5],[11,7,-8,2],[12,7,7,3],[-4,7,0,2],[-12,7,-2,1.5],[-12,7,8,2]].forEach(([x,y,z,i]) => {
    const l = new THREE.PointLight(0xffeedd, i, 12);
    l.position.set(x, y, z);
    l.castShadow = true;
    l.shadow.mapSize.set(512, 512);
    scene.add(l);
  });

  // Pool light
  const pl = new THREE.PointLight(0x0088cc, 3, 14);
  pl.position.set(20, 0.5, -4);
  scene.add(pl);
}

// ── Camera path (scroll-driven) ──
const camPath = [
  { pos: [0, 8, 30], look: [0, 3, 0] },       // Hero - orbit exterior
  { pos: [25, 6, -4], look: [16, 2, -4] },     // Pool close
  { pos: [0, 4, 14], look: [0, 3, 6] },        // Entrance approach
  { pos: [0, 1.7, 5], look: [0, 2, -4] },      // Foyer interior
  { pos: [14, 1.7, 2], look: [12, 1.5, -3] },  // Living room
  { pos: [11, 1.7, 9], look: [11, 1.5, 7] },   // Dining
  { pos: [11, 1.7, -9], look: [11, 1.5, -12] },// Kitchen
  { pos: [12, 5.7, 0], look: [12, 5.5, -1] },  // Master bedroom
  { pos: [12, 5.7, -7.5], look: [12, 5.5, -8] },// Master bath
  { pos: [12, 5.7, 7.5], look: [12, 5.5, 5.5] },// Theater
  { pos: [2, 10, 0], look: [2, 8.5, -3] },     // Rooftop
  { pos: [0, 12, 20], look: [0, 4, 0] },       // Final overview
];
const segCount = camPath.length - 1;

function getCamState(t) {
  t = Math.max(0, Math.min(1, t));
  const scaled = t * segCount;
  const i = Math.min(Math.floor(scaled), segCount - 1);
  const f = scaled - i;
  const ease = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2; // ease in-out
  const a = camPath[i], b = camPath[i + 1];
  return {
    pos: new THREE.Vector3(
      a.pos[0] + (b.pos[0] - a.pos[0]) * ease,
      a.pos[1] + (b.pos[1] - a.pos[1]) * ease,
      a.pos[2] + (b.pos[2] - a.pos[2]) * ease
    ),
    look: new THREE.Vector3(
      a.look[0] + (b.look[0] - a.look[0]) * ease,
      a.look[1] + (b.look[1] - a.look[1]) * ease,
      a.look[2] + (b.look[2] - a.look[2]) * ease
    )
  };
}

// ── Section labels ──
const secLabels = ['Home', 'About', 'Services', 'Projects', 'Contact'];

// ── Scroll → section mapping ──
function getSectionFromScroll(t) {
  const totalSections = 5;
  return Math.min(Math.floor(t * totalSections), totalSections - 1);
}

// ════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════
function init() {
  clock = new THREE.Clock();

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xff8844);
  scene.fog = new THREE.FogExp2(0xff8844, 0.004);

  // Camera
  camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 8, 30);
  camera.lookAt(0, 3, 0);

  // Materials
  initMaterials();

  // Build
  setupLighting();
  buildVilla();
  createWater();
  createDust();
  createBirds();

  // Events
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, { passive: true });
  document.getElementById('start').addEventListener('click', onStart);
  document.querySelectorAll('[data-g]').forEach(el => {
    el.addEventListener('click', () => {
      const g = parseInt(el.dataset.g);
      const target = g / 5;
      window.scrollTo({ top: target * (document.body.scrollHeight - window.innerHeight), behavior: 'smooth' });
    });
  });

  // Simulate loading
  simulateLoad();
  animate();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll() {
  const max = document.body.scrollHeight - window.innerHeight;
  targetScroll = max > 0 ? window.scrollY / max : 0;
}

function onStart() {
  isStarted = true;
  document.getElementById('start').classList.remove('show');
  document.getElementById('nav').classList.add('on');
  document.getElementById('prog').classList.add('on');
  document.getElementById('secLabel').classList.add('on');
  document.getElementById('scrollHint').classList.add('on');
}

function simulateLoad() {
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 8 + 2;
    if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => { document.getElementById('loader').classList.add('done'); document.getElementById('start').classList.add('show'); }, 600); }
    loadPct = p;
    document.getElementById('ldFill').style.width = p + '%';
    document.getElementById('ldPct').textContent = Math.round(p) + '%';
  }, 120);
}

// ════════════════════════════════════════════
// ANIMATION LOOP
// ════════════════════════════════════════════
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.getElapsedTime();

  // Smooth scroll
  scrollProgress += (targetScroll - scrollProgress) * 0.06;

  // Camera
  const cs = getCamState(scrollProgress);
  camera.position.lerp(cs.pos, 0.04);
  const lookTarget = cs.look.clone();
  camera.lookAt(lookTarget);

  // Section
  const sec = getSectionFromScroll(scrollProgress);
  if (sec !== currentSection) {
    currentSection = sec;
    document.getElementById('secLabel').textContent = secLabels[sec] || '';
    document.querySelectorAll('.pd').forEach((d, i) => d.classList.toggle('a', i === sec));
  }

  // Time of day based on scroll
  const nightAmount = Math.max(0, Math.min(1, (scrollProgress - 0.6) * 3));
  if (nightAmount > 0) {
    scene.background.lerp(new THREE.Color(0x0a0a1a), 0.02);
    scene.fog.color.lerp(new THREE.Color(0x0a0a1a), 0.02);
    scene.fog.density = 0.004 + nightAmount * 0.003;
    renderer.toneMappingExposure = 1.3 - nightAmount * 0.5;
  } else {
    scene.background.lerp(new THREE.Color(0xff8844), 0.02);
    scene.fog.color.lerp(new THREE.Color(0xff8844), 0.02);
    scene.fog.density = 0.004;
    renderer.toneMappingExposure = 1.3;
  }

  // Water ripple
  if (waterMesh) {
    const wp = waterMesh.geometry.attributes.position;
    for (let i = 0; i < wp.count; i++) {
      const x = wp.getX(i), z = wp.getZ(i);
      wp.setY(i, Math.sin(x * 2 + t * 2) * 0.018 + Math.sin(z * 3 + t * 1.5) * 0.012);
    }
    wp.needsUpdate = true;
  }

  // Fire flicker
  scene.children.forEach(c => {
    if (c.isPointLight && c.position.y < 1.5 && c.position.z < -5) {
      c.intensity = 2.5 + Math.sin(t * 8) * 0.5 + Math.sin(t * 13) * 0.3;
    }
  });

  // Dust
  if (dustPts) {
    const dp = dustPts.geometry.attributes.position;
    for (let i = 0; i < dp.count; i++) {
      dp.setX(i, dp.getX(i) + Math.sin(t * 0.3 + i) * 0.001);
      dp.setY(i, dp.getY(i) + Math.sin(t * 0.5 + i * 0.5) * 0.0008);
      dp.setZ(i, dp.getZ(i) + Math.cos(t * 0.4 + i * 0.3) * 0.001);
    }
    dp.needsUpdate = true;
  }

  // Birds
  birdGroup.forEach(b => {
    b.angle += dt * b.speed * 0.08;
    b.mesh.position.x = b.cx + Math.cos(b.angle) * b.r;
    b.mesh.position.z = b.cz + Math.sin(b.angle) * b.r;
    b.mesh.position.y = b.h + Math.sin(t * 2 + b.phase) * 0.4;
    const wa = Math.sin(t * 8 + b.phase) * 0.3;
    b.lw.rotation.z = wa;
    b.rw.rotation.z = -wa;
    b.mesh.rotation.y = -b.angle + Math.PI / 2;
  });

  // Panels visibility
  document.querySelectorAll('.pnl').forEach(p => {
    const rect = p.getBoundingClientRect();
    const vis = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
    p.classList.toggle('vis', vis);
  });
  document.querySelectorAll('.svc, .proj').forEach(c => {
    const rect = c.getBoundingClientRect();
    c.classList.toggle('vis', rect.top < window.innerHeight * 0.85);
  });

  // Scroll hint hide
  if (scrollProgress > 0.02) document.getElementById('scrollHint').classList.remove('on');

  renderer.render(scene, camera);
}

init();
