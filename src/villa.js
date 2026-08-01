import * as THREE from 'three';
import { M } from './materials.js';

const mp = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m ?? 0 });
const geo = {};
let _t;
let sc = 0;
const MX = 200;

function ig() {
  geo.b = new THREE.BoxGeometry(1, 1, 1);
  geo.c = new THREE.CylinderGeometry(1, 1, 1, 10);
  geo.s = new THREE.SphereGeometry(1, 10, 8);
}

function B(w, h, d, mat, x, y, z, ry, rx) {
  const m = new THREE.Mesh(geo.b, mat);
  m.scale.set(w, h, d);
  m.position.set(x, y, z);
  if (ry) m.rotation.y = ry;
  if (rx) m.rotation.x = rx;
  if (sc < MX) { m.castShadow = true; sc++; }
  m.receiveShadow = true;
  _t.add(m);
  return m;
}

function C(rt, rb, h, s, mat, x, y, z, ry) {
  const g = new THREE.CylinderGeometry(rt, rb, h, s);
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  if (ry) m.rotation.y = ry;
  if (sc < MX) { m.castShadow = true; sc++; }
  m.receiveShadow = true;
  _t.add(m);
  return m;
}

function S(r, ws, hs, mat, x, y, z) {
  const g = new THREE.SphereGeometry(r, ws, hs);
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  if (sc < MX) { m.castShadow = true; sc++; }
  m.receiveShadow = true;
  _t.add(m);
  return m;
}

function FLOOR(mat, x, y, z, w, d) {
  B(w, 0.15, d, mat, x, y, z);
}

function WALL_X(mat, x, y, z, h, d) {
  B(0.25, h, d, mat, x, y + h / 2, z);
}

function WALL_Z(mat, x, y, z, h, w) {
  B(w, h, 0.25, mat, x, y + h / 2, z);
}

function WINDOW(mat, x, y, z, w, h, ry) {
  B(w, h, 0.04, M.glass, x, y, z, ry);
  B(w + 0.08, 0.04, 0.08, M.metalBlk, x, y + h / 2, z, ry);
  B(w + 0.08, 0.04, 0.08, M.metalBlk, x, y - h / 2, z, ry);
  B(0.04, h, 0.08, M.metalBlk, x - w / 2, y, z, ry);
  B(0.04, h, 0.08, M.metalBlk, x + w / 2, y, z, ry);
}

function SOFA(col, x, y, z, w, d, ry) {
  B(w, 0.35, d, col, x, y + 0.17, z, ry);
  B(w, 0.35, d * 0.15, col, x, y + 0.35, z - d * 0.42 * (Math.cos(ry || 0) || 1), ry);
  B(w * 0.12, 0.35, d, col, x - w * 0.44 * (Math.sin(ry || 0) || 0), y + 0.35, z - d * 0.42 * (Math.cos(ry || 0) || 0), ry);
}

function BED(x, y, z, w, d, hMat, sMat) {
  B(w, 0.35, d, sMat, x, y + 0.17, z);
  B(w, 0.12, d, M.fabric, x, y + 0.4, z);
  B(w, hMat === M.wood ? 0.8 : 0.6, 0.12, hMat, x, y + (hMat === M.wood ? 0.7 : 0.55), z - d / 2 - 0.06);
  B(w * 0.3, 0.08, 0.2, M.pillow, x - w * 0.25, y + 0.5, z - d * 0.3);
  B(w * 0.3, 0.08, 0.2, M.pillow, x + w * 0.25, y + 0.5, z - d * 0.3);
}

function CHAIR(x, y, z, ry) {
  B(0.4, 0.04, 0.4, M.metalBlk, x, y, z, ry);
  B(0.38, 0.38, 0.04, M.fabricNavy, x, y + 0.25, z + 0.18 * (Math.cos(ry) || 1), ry);
}

function PENDANT(x, y, z, h) {
  C(0.008, 0.008, h, 4, M.metalBlk, x, y + h / 2, z);
  S(0.12, 8, 6, M.emWarm, x, y, z);
}

function BUSH(x, y, z, r) {
  S(r, 8, 6, M.leaf, x, y + r * 0.6, z);
  S(r * 0.7, 6, 5, M.leafDk, x + r * 0.3, y + r * 0.8, z + r * 0.2);
}

function PALM(tx, tz) {
  for (let s = 0; s < 6; s++) {
    C(0.14 - s * 0.012, 0.16 - s * 0.012, 1, 8, M.woodDk, tx + Math.sin(s * 0.35) * 0.25, s * 1 + 0.5, tz);
  }
  for (let f = 0; f < 8; f++) {
    const a = (f / 8) * Math.PI * 2, fl = 3 + Math.random();
    B(0.18, 0.025, fl, M.leaf, tx + Math.sin(a) * fl * 0.45, 6.5, tz + Math.cos(a) * fl * 0.45, a);
    B(0.14, 0.02, fl * 0.7, M.leafLt, tx + Math.sin(a) * fl * 0.55, 6.6, tz + Math.cos(a) * fl * 0.55, a);
  }
}

function PLANT(x, y, z, s) {
  C(0.18 * s, 0.14 * s, 0.4 * s, 8, M.ceramic, x, y + 0.2 * s, z);
  S(0.35 * s, 8, 6, M.leaf, x, y + 0.7 * s, z);
  S(0.25 * s, 6, 5, M.leafDk, x + 0.15 * s, y + 0.85 * s, z + 0.1);
}

function LAMP(x, y, z) {
  C(0.025, 0.03, 0.5, 6, M.metalBr, x, y + 0.25, z);
  S(0.1, 8, 6, M.emWarm, x, y + 0.55, z);
}

function NIGHTSTAND(x, y, z) {
  B(0.45, 0.45, 0.38, M.woodDk, x, y + 0.22, z);
  B(0.45, 0.03, 0.38, M.marble, x, y + 0.46, z);
  S(0.07, 6, 5, M.emWarm, x, y + 0.6, z);
}

function CABINET(x, y, z, w, h, d) {
  B(w, h, d, M.wood, x, y + h / 2, z);
  B(w, 0.03, d, M.marble, x, y + h + 0.015, z);
  for (let i = 0; i < 3; i++) {
    B(0.02, 0.15, 0.02, M.metalBr, x - w * 0.3 + i * w * 0.3, y + h * 0.5, z + d / 2 + 0.01);
  }
}

export function buildVilla(scene) {
  ig();
  sc = 0;
  const villa = new THREE.Group();
  _t = villa;

  // ═══════════════════════════════════════════════════════════
  //  TERRAIN & GROUNDS
  // ═══════════════════════════════════════════════════════════
  B(100, 0.12, 100, M.soil, 0, -0.06, 0);
  B(100, 0.06, 100, M.grass, 0, 0.01, 0);

  // Driveway
  B(5.5, 0.1, 20, M.road, 0, 0.05, -17);
  B(7, 0.1, 7, M.road, 0, 0.05, -27);
  for (let i = -24; i < -10; i += 2.5) B(0.1, 0.03, 2, M.metalBr, 0, 0.1, i);

  // Walkway to entrance
  for (let i = 0; i < 8; i++) {
    const sw = 1.4 + Math.random() * 0.3;
    B(sw, 0.06, 0.7, M.stoneWarm, (Math.random() - 0.5) * 0.6, 0.06, 11.5 + i * 1.2, Math.random() * 0.2);
  }

  // ═══════════════════════════════════════════════════════════
  //  MAIN VILLA — GROUND FLOOR (Y = 0 to 3.5)
  // ═══════════════════════════════════════════════════════════
  const WH = 3.5;
  FLOOR(M.concreteLt, 0, 0.07, 0, 28, 20);

  // ── Exterior walls ──
  WALL_Z(M.concrete, 0, 0, -10, WH, 28);    // back
  WALL_X(M.concrete, -14, 0, 0, WH, 20);    // left
  WALL_X(M.concrete, 14, 0, 0, WH, 20);     // right
  WALL_Z(M.concrete, -12, 0, 10, WH, 4);    // front left
  WALL_Z(M.concrete, 12, 0, 10, WH, 4);     // front right

  // ── Front glass walls ──
  WINDOW(M.glass, -7, 1.75, 10, 6, 3.0);
  WINDOW(M.glass, -1, 1.75, 10, 4, 3.0);
  WINDOW(M.glass, 4, 1.75, 10, 5, 3.0);
  WINDOW(M.glass, 10, 1.75, 10, 3, 3.0);

  // ── Left side windows ──
  WINDOW(M.glass, -14, 1.75, -6, 0.04, 3.0, 0);
  WINDOW(M.glass, -14, 1.75, 0, 0.04, 3.0, 0);
  WINDOW(M.glass, -14, 1.75, 6, 0.04, 3.0, 0);

  // ── Right side windows ──
  WINDOW(M.glass, 14, 1.75, -6, 0.04, 3.0, 0);
  WINDOW(M.glass, 14, 1.75, 2, 0.04, 3.0, 0);

  // ── Interior partition walls ──
  WALL_X(M.concreteWarm, -2, 0, 5, WH, 6);      // living/dining
  WALL_Z(M.concreteDk, -6, 0, -5, WH, 8);        // kitchen back
  WALL_X(M.concrete, 6, 0, -4, WH, 8);           // guest suite
  WALL_X(M.concreteDk, 8, 0, 4, WH, 6);          // theater
  WALL_Z(M.concreteDk, 11, 0, 1, WH, 6);         // theater side

  // ═══════════════════════════════════════════════════════════
  //  FIRST FLOOR SLAB + UPPER FLOOR
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.concreteLt, 0, 3.57, 0, 28, 20);
  B(22, 0.2, 4, M.concrete, -1, 3.57, 12);  // cantilever

  const UH = 3.2;
  WALL_Z(M.concrete, 0, 3.57, -10, UH, 28);
  WALL_X(M.concrete, -14, 3.57, 0, UH, 20);
  WALL_X(M.concrete, 14, 3.57, -3, UH, 14);
  WALL_Z(M.concrete, 0, 3.57, 10, UH, 28);

  // Upper glass
  WINDOW(M.glass, -14, 3.57 + 1.6, -5, 0.04, 2.6, 0);
  WINDOW(M.glass, -14, 3.57 + 1.6, 1, 0.04, 2.6, 0);
  WINDOW(M.glass, -14, 3.57 + 1.6, 7, 0.04, 2.6, 0);
  WINDOW(M.glass, -6, 3.57 + 1.6, 10, 5, 2.6);
  WINDOW(M.glass, 2, 3.57 + 1.6, 10, 6, 2.6);
  WINDOW(M.glass, 10, 3.57 + 1.6, 10, 4, 2.6);

  // ═══════════════════════════════════════════════════════════
  //  ROOF
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.roofMat, 0, 6.77, 0, 30, 22);
  B(30, 0.5, 0.12, M.concrete, 0, 7.05, -11);
  B(30, 0.5, 0.12, M.concrete, 0, 7.05, 11);
  B(0.12, 0.5, 22, M.concrete, -15, 7.05, 0);
  B(0.12, 0.5, 22, M.concrete, 15, 7.05, 0);

  // ═══════════════════════════════════════════════════════════
  //  FOYER (double-height, center front)
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.marble, 0, 0.22, 5, 5, 6);
  B(0.04, 2.8, 0.04, M.metalBr, 0, 1.65, 10); // door frame center
  B(1.8, 2.8, 0.06, M.glassTint, -0.5, 1.65, 10);
  B(1.8, 2.8, 0.06, M.glassTint, 0.5, 1.65, 10);
  PENDANT(0, 5, 5, 1.5);
  PENDANT(0, 5, 7, 1.5);
  S(0.12, 8, 6, M.emWarm, -2.2, 2.6, 10.1);
  S(0.12, 8, 6, M.emWarm, 2.2, 2.6, 10.1);
  B(0.5, 0.3, 0.02, M.metalBr, -1.5, 2.3, 10.1);

  // ═══════════════════════════════════════════════════════════
  //  LIVING ROOM (left front)
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.rug, -9, 0.22, 5, 8, 6);

  // L-shaped sofa
  B(4.5, 0.35, 1.3, M.fabric, -10, 0.4, 5.5);
  B(4.5, 0.3, 1.1, M.leather, -10, 0.25, 5.5);
  B(4.5, 0.5, 0.18, M.fabric, -10, 0.65, 4.8);
  B(1.3, 0.35, 3.2, M.fabric, -7.7, 0.4, 7);
  B(1.3, 0.3, 3, M.leather, -7.7, 0.25, 7);
  B(0.18, 0.5, 3.2, M.fabric, -7, 0.65, 7);

  // Cushions
  for (let i = 0; i < 4; i++) B(0.32, 0.16, 0.32, M.pillow, -11.5 + i * 1, 0.7, 4.9);
  B(0.28, 0.14, 0.28, M.pillowBlush, -7.7, 0.7, 6.2);
  B(0.28, 0.14, 0.28, M.pillow, -7.7, 0.7, 7.5);

  // Coffee table
  B(2, 0.04, 1, M.glassTint, -9, 0.3, 5.5);
  B(0.05, 0.28, 0.8, M.metalBr, -9.85, 0.15, 5.5);
  B(0.05, 0.28, 0.8, M.metalBr, -8.15, 0.15, 5.5);

  // TV wall
  B(3.5, 0.5, 0.5, M.woodDk, -10, 0.5, 1.2);
  B(2.4, 1.4, 0.04, M.tv, -10, 1.8, 1.18);
  B(2.6, 0.06, 0.06, M.metalBlk, -10, 2.55, 1.16);

  // Floor lamp
  LAMP(-11.8, 0.3, 3);

  // Plant
  PLANT(-12.2, 0.2, 8.2, 1);

  // ═══════════════════════════════════════════════════════════
  //  DINING AREA (center)
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.concreteWarm, 2, 0.22, 6, 5, 6);

  B(2.6, 0.05, 1.3, M.wood, 2, 0.72, 6);
  C(0.06, 0.08, 0.65, 8, M.metalBlk, 0.9, 0.35, 5.3);
  C(0.06, 0.08, 0.65, 8, M.metalBlk, 3.1, 0.35, 5.3);
  C(0.06, 0.08, 0.65, 8, M.metalBlk, 0.9, 0.35, 6.7);
  C(0.06, 0.08, 0.65, 8, M.metalBlk, 3.1, 0.35, 6.7);

  for (let i = 0; i < 6; i++) {
    const cx = 0.7 + i * 0.85;
    const cz = i < 3 ? 4.9 : 7.1;
    B(0.38, 0.42, 0.38, M.fabricNavy, cx, 0.55, cz);
    B(0.38, 0.45, 0.04, M.fabricNavy, cx, 0.78, cz + (i < 3 ? -0.17 : 0.17));
  }

  PENDANT(1, 2.5, 6, 0.8);
  PENDANT(2, 2.5, 6, 0.8);
  PENDANT(3, 2.5, 6, 0.8);

  // Sideboard
  B(2.2, 0.85, 0.5, M.woodDk, 2, 0.7, 8.7);
  B(2.2, 0.03, 0.5, M.marble, 2, 1.14, 8.7);
  C(0.08, 0.06, 0.28, 8, M.ceramic, 1.2, 1.32, 8.7);
  C(0.06, 0.08, 0.32, 8, M.ceramic, 2, 1.34, 8.7);
  B(0.35, 0.25, 0.12, M.metalBr, 2.8, 1.3, 8.7);

  // ═══════════════════════════════════════════════════════════
  //  KITCHEN (back left)
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.concreteWarm, -8, 0.22, -5, 8, 5);

  // Island
  B(3.2, 0.88, 1.1, M.marble, -8, 0.65, -3);
  B(3.3, 0.04, 1.2, M.marble, -8, 1.12, -3);
  for (let i = 0; i < 3; i++) {
    C(0.18, 0.14, 0.55, 8, M.leatherTan, -9.3 + i * 1.3, 0.5, -1.8);
    C(0.025, 0.025, 0.55, 6, M.metalBr, -9.3 + i * 1.3, 0.25, -1.8);
  }

  // Back counter
  B(6.5, 0.88, 0.7, M.concreteLt, -7.5, 0.65, -7);
  B(6.5, 0.04, 0.7, M.marble, -7.5, 1.12, -7);
  B(6.5, 0.65, 0.38, M.woodPanel, -7.5, 2.1, -7.4);
  for (let i = 0; i < 6; i++) S(0.03, 4, 3, M.emWarm, -10.5 + i * 1.2, 1.75, -6.7);

  // Sink & faucet
  B(0.6, 0.12, 0.4, M.metalChrome, -6.5, 1.15, -7);
  C(0.015, 0.015, 0.3, 6, M.metalChrome, -6.5, 1.35, -7.2);

  // Fridge
  B(0.95, 2.1, 0.85, M.metalSteel, -11.5, 1.25, -7);
  B(0.04, 0.7, 0.04, M.metalBr, -11.5, 1.5, -6.55);
  B(0.04, 0.7, 0.04, M.metalBr, -11.5, 1.5, -7.45);

  // Stove
  B(0.85, 0.88, 0.7, M.metalBlk, -5, 0.65, -7);
  B(0.85, 0.02, 0.6, M.metalChrome, -5, 1.12, -7);

  // Pendants
  for (let i = 0; i < 3; i++) PENDANT(-9.5 + i * 1.5, 2.5, -3, 0.7);

  // ═══════════════════════════════════════════════════════════
  //  BUTLER'S PANTRY (behind kitchen)
  // ═══════════════════════════════════════════════════════════
  CABINET(-4, 0.22, -8.5, 3.2, 0.85, 0.6);
  B(3.2, 0.65, 0.32, M.woodPanel, -4, 1.8, -8.8);

  // ═══════════════════════════════════════════════════════════
  //  HOME OFFICE (right side)
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.rug, 10, 0.22, -3, 5, 5);

  B(2, 0.04, 1, M.wood, 10, 0.72, -2);
  B(0.06, 0.7, 0.9, M.metalBlk, 9, 0.35, -2);
  B(0.06, 0.7, 0.9, M.metalBlk, 11, 0.35, -2);
  B(0.5, 0.05, 0.5, M.leather, 10, 0.48, -0.7);
  B(0.5, 0.65, 0.05, M.leather, 10, 0.82, -0.42);

  // Bookshelf
  B(1.6, 2.2, 0.38, M.wood, 12.6, 1.3, -5);
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) {
    const bc = [0x8b4513, 0x2a3a5a, 0x5a3a2a, 0x2a4a3a, 0x7a5a4a, 0x3a3a6a][c];
    B(0.06, 0.14 + Math.random() * 0.12, 0.22, mp(bc, 0.78), 11.9 + c * 0.22, 0.3 + r * 0.42, -5);
  }

  LAMP(10.7, 0.72, -2.4);

  // ═══════════════════════════════════════════════════════════
  //  GUEST SUITE (right front)
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.rug, 10, 0.22, 6, 5, 6);
  BED(10, 0.22, 6, 2, 2.4, M.wood, M.fabric);
  NIGHTSTAND(8.7, 0.22, 5.2);
  NIGHTSTAND(11.3, 0.22, 5.2);
  PLANT(12.5, 0.2, 8, 0.8);

  // ═══════════════════════════════════════════════════════════
  //  HOME THEATER (right middle)
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.fabricGray, 10, 0.22, 3, 6, 5);

  for (let i = 0; i < 3; i++) {
    B(0.75, 0.38, 0.85, M.fabricNavy, 9.5 + i * 0.9, 0.42, 2.5);
    B(0.75, 0.55, 0.1, M.fabricNavy, 9.5 + i * 0.9, 0.7, 2.05);
    B(0.08, 0.25, 0.7, M.fabricNavy, 9.1 + i * 0.9, 0.38, 2.5);
    B(0.08, 0.25, 0.7, M.fabricNavy, 10.3 + i * 0.9, 0.38, 2.5);
  }
  B(3.5, 1.8, 0.04, M.tv, 10.5, 1.8, 4.8);
  B(3.6, 0.06, 0.06, M.metalBr, 10.5, 2.75, 4.8);

  // ═══════════════════════════════════════════════════════════
  //  WINE CELLAR (under stairs)
  // ═══════════════════════════════════════════════════════════
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
    B(0.45, 0.06, 0.32, M.woodDk, -4.5 + c * 0.5, 0.4 + r * 0.35, -6);
    C(0.035, 0.035, 0.28, 6, M.fabricNavy, -4.5 + c * 0.5, 0.4 + r * 0.35, -6, Math.PI / 2);
  }

  // ═══════════════════════════════════════════════════════════
  //  GYM (right back)
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.fabricGray, 10, 0.22, -8, 6, 5);

  // Treadmill
  B(0.7, 0.12, 1.9, M.metalBlk, 10, 0.4, -7.5);
  B(0.7, 0.9, 0.06, M.metalBlk, 10, 0.9, -6.5);
  B(0.5, 0.3, 0.04, M.tv, 10, 1.1, -6.5);

  // Bench
  B(0.55, 0.28, 1.3, M.leather, 12, 0.5, -8);
  B(0.55, 0.06, 1.3, M.metalBlk, 12, 0.68, -8);

  // Weights
  for (let i = 0; i < 4; i++) C(0.06, 0.06, 0.28, 8, M.metalBlk, 12.5, 0.3, -6.5 + i * 0.35, Math.PI / 2);

  // ═══════════════════════════════════════════════════════════
  //  INDOOR COURTYARD (center)
  // ═══════════════════════════════════════════════════════════
  B(3.2, 0.4, 3.2, M.concreteDk, 2, 0.42, -1);
  B(3, 0.3, 3, M.soil, 2, 0.72, -1);
  for (let i = 0; i < 5; i++) {
    C(0.025, 0.025, 2.2, 6, M.woodDk, 1.2 + i * 0.4, 1.8, -0.3 - i * 0.35);
    S(0.28, 8, 6, M.leaf, 1.2 + i * 0.4, 3, -0.3 - i * 0.35);
  }
  C(0.5, 0.5, 0.18, 12, M.stone, 2, 0.5, -2);
  const courtyardWater = new THREE.Mesh(new THREE.CircleGeometry(0.42, 16), M.water);
  courtyardWater.rotation.x = -Math.PI / 2;
  courtyardWater.position.set(2, 0.6, -2);
  _t.add(courtyardWater);

  // ═══════════════════════════════════════════════════════════
  //  FLOATING STAIRCASE
  // ═══════════════════════════════════════════════════════════
  for (let i = 0; i < 15; i++) {
    const t = i / 14;
    B(1.3, 0.1, 0.38, M.concreteLt, -2, 0.3 + t * 3.3, 2 + t * 4);
    if (i > 0 && i < 14) B(0.02, 0.85, 0.38, M.glass, -1.25, 0.7 + t * 3.3, 2 + t * 4);
  }

  // ═══════════════════════════════════════════════════════════
  //  GLASS ELEVATOR
  // ═══════════════════════════════════════════════════════════
  B(0.05, 7, 1.6, M.glass, -6.8, 3.5, 0);
  B(0.05, 7, 1.6, M.glass, -5.2, 3.5, 0);
  B(1.6, 7, 0.05, M.glass, -6, 3.5, -0.8);
  B(1.6, 7, 0.05, M.glass, -6, 3.5, 0.8);
  B(1.3, 2.2, 1.3, M.metalChrome, -6, 1.8, 0);

  // ═══════════════════════════════════════════════════════════
  //  WOOD ACCENT PANELS (exterior)
  // ═══════════════════════════════════════════════════════════
  B(8, 2.5, 0.08, M.woodPanel, -8, 1.8, 10.06);
  B(6, 1.8, 0.08, M.woodPanel, 10, 2.2, 10.06);

  // ═══════════════════════════════════════════════════════════
  //  UPPER FLOOR — MASTER BEDROOM
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.rug, -8, 3.62, 3, 6, 6);
  BED(-8, 3.62, 3, 2.2, 2.5, M.woodPanel, M.fabric);
  NIGHTSTAND(-9.6, 3.62, 2);
  NIGHTSTAND(-6.4, 3.62, 2);

  // Walk-in wardrobe
  B(2.2, 2.5, 0.35, M.wood, -12, 3.62 + 1.25, -3);
  B(0.35, 2.5, 2.2, M.wood, -13.2, 3.62 + 1.25, -2);
  C(0.012, 0.012, 2, 4, M.metalChrome, -12, 3.62 + 2, -2.5);
  for (let i = 0; i < 8; i++) {
    const cc = [0x2a3a5a, 0x5a3a3a, 0xf0ede6, 0x2a4a3a, 0x9a7a5a, 0x3a4a5a, 0x4a3a2a, 0x6a4a5a][i];
    B(0.22, 0.85, 0.06, mp(cc, 0.83), -11.6 + i * 0.32, 3.62 + 1.7, -2.5);
  }

  // ═══════════════════════════════════════════════════════════
  //  MASTER BATHROOM
  // ═══════════════════════════════════════════════════════════
  FLOOR(M.marble, -8, 3.62, -6, 8, 6);

  // Freestanding bathtub
  B(1.9, 0.55, 0.95, M.marble, -10, 3.62 + 0.27, -1);
  B(1.7, 0.45, 0.75, M.marble, -10, 3.62 + 0.32, -1);

  // Vanity
  B(2.2, 0.88, 0.58, M.concreteLt, -6, 3.62 + 0.65, -8);
  B(2.2, 0.03, 0.58, M.marble, -6, 3.62 + 1.12, -8);
  B(1.6, 1.3, 0.04, M.glass, -6, 3.62 + 1.9, -8.3);
  B(1.7, 0.04, 0.04, M.metalBr, -6, 3.62 + 2.6, -8.32);
  for (let i = 0; i < 3; i++) S(0.04, 4, 3, M.emWarm, -6.5 + i * 0.5, 3.62 + 2.4, -8.2);
  B(0.42, 0.1, 0.32, M.ceramic, -6, 3.62 + 1.18, -8);
  C(0.012, 0.012, 0.28, 6, M.metalChrome, -6, 3.62 + 1.38, -8.12);

  // Shower
  B(0.04, 2.3, 1.3, M.glass, -10, 3.62 + 1.15, -8);
  B(1.3, 2.3, 0.04, M.glass, -9.35, 3.62 + 1.15, -7.35);

  // ═══════════════════════════════════════════════════════════
  //  ROOFTOP TERRACE
  // ═══════════════════════════════════════════════════════════
  B(2.2, 0.32, 1, M.fabric, -5, 7.05, 4);
  B(2.2, 0.32, 1, M.fabric, -5, 7.05, 7);
  B(2, 0.28, 0.85, M.leatherTan, -5, 7.22, 4);
  B(2, 0.28, 0.85, M.leatherTan, -5, 7.22, 7);
  B(1.3, 0.04, 0.65, M.glassTint, -5, 7.42, 5.5);
  C(0.04, 0.05, 0.38, 6, M.metalBr, -5, 7.22, 5.5);

  // ═══════════════════════════════════════════════════════════
  //  INFINITY POOL
  // ═══════════════════════════════════════════════════════════
  const PX = 0, PZ = 18, PW = 14, PD = 5;
  B(PW + 0.5, 0.85, PD + 0.5, M.concreteDk, PX, -0.22, PZ);
  B(PW, 0.75, PD, M.poolTile, PX, -0.1, PZ);
  const poolWater = new THREE.Mesh(new THREE.PlaneGeometry(PW - 0.2, PD - 0.2, 24, 24), M.water);
  poolWater.rotation.x = -Math.PI / 2;
  poolWater.position.set(PX, 0.22, PZ);
  _t.add(poolWater);

  B(PW + 0.8, 0.18, 0.18, M.stone, PX, 0.38, PZ - PD / 2 - 0.12);
  B(0.18, 0.18, PD + 0.8, M.stone, PX - PW / 2 - 0.12, 0.38, PZ);
  B(0.18, 0.18, PD + 0.8, M.stone, PX + PW / 2 + 0.12, 0.38, PZ);
  B(PW + 5, 0.08, PD + 7, M.concreteLt, PX, 0.04, PZ);

  // Lounge chairs
  for (let i = 0; i < 4; i++) {
    B(0.65, 0.12, 1.9, M.metalChrome, -4.5 + i * 3, 0.2, PZ + PD / 2 + 2.2);
    B(0.65, 0.22, 1.7, M.fabric, -4.5 + i * 3, 0.32, PZ + PD / 2 + 2.3);
    B(0.4, 0.02, 0.55, M.fabricBlush, -4.5 + i * 3, 0.45, PZ + PD / 2 + 2.5);
  }

  // ═══════════════════════════════════════════════════════════
  //  OUTDOOR DINING PAVILION
  // ═══════════════════════════════════════════════════════════
  const pX = 10, pZ = 18;
  for (const [px, pz] of [[-2.2, -2.2], [2.2, -2.2], [-2.2, 2.2], [2.2, 2.2]]) C(0.07, 0.07, 3.2, 8, M.metalBlk, pX + px, 1.6, pZ + pz);
  for (let i = -2.2; i <= 2.2; i += 0.7) { B(0.06, 0.06, 4.4, M.metalBlk, pX + i, 3.2, pZ); B(4.4, 0.06, 0.06, M.metalBlk, pX, 3.26, pZ + i); }
  B(2.4, 0.05, 1.2, M.stoneWarm, pX, 0.75, pZ);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    B(0.36, 0.4, 0.36, M.fabricNavy, pX + Math.sin(a) * 1.7, 0.52, pZ + Math.cos(a) * 1);
  }

  // ═══════════════════════════════════════════════════════════
  //  BBQ AREA
  // ═══════════════════════════════════════════════════════════
  B(1.6, 1.05, 0.85, M.concreteDk, 14.5, 0.52, 14);
  B(1.6, 0.05, 0.85, M.metalSteel, 14.5, 1.08, 14);
  B(1.1, 0.88, 0.65, M.concreteLt, 16, 0.44, 14);
  B(1.1, 0.03, 0.65, M.stoneWarm, 16, 0.9, 14);

  // ═══════════════════════════════════════════════════════════
  //  FIRE PIT LOUNGE
  // ═══════════════════════════════════════════════════════════
  const fX = -10, fZ = 18;
  C(0.85, 0.85, 0.42, 14, M.concreteDk, fX, 0.21, fZ);
  C(0.75, 0.75, 0.32, 14, M.stone, fX, 0.38, fZ);
  const fireLight = new THREE.PointLight(0xff6622, 2.5, 10);
  fireLight.position.set(fX, 1, fZ);
  _t.add(fireLight);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    B(1.3, 0.35, 0.65, M.fabric, fX + Math.sin(a) * 2.4, 0.5, fZ + Math.cos(a) * 2.4, a);
    B(1.3, 0.25, 0.55, M.leatherTan, fX + Math.sin(a) * 2.4, 0.55, fZ + Math.cos(a) * 2.4, a);
  }

  // ═══════════════════════════════════════════════════════════
  //  GARAGE
  // ═══════════════════════════════════════════════════════════
  B(7.5, 3.2, 8.5, M.concreteDk, 10, 1.6, -13);
  for (let i = 0; i < 3; i++) {
    B(2.1, 2.3, 0.08, M.metalSteel, 7.5 + i * 2.3, 1.35, -8.8);
    for (let l = 0; l < 5; l++) B(1.9, 0.02, 0.02, M.metalBlk, 7.5 + i * 2.3, 0.35 + l * 0.45, -8.76);
  }

  // Cars
  B(2.1, 0.62, 4.6, M.metalBlk, 8, 0.6, -13);
  B(1.9, 0.52, 2.6, M.metalBlk, 8, 1.15, -13.5);
  B(1.7, 0.42, 2.3, M.glass, 8, 1.45, -13.5);
  B(2.1, 0.62, 4.6, mp(0x9a2222, 0.28, 0.72), 11.5, 0.6, -13);
  B(1.9, 0.52, 2.6, mp(0x9a2222, 0.28, 0.72), 11.5, 1.15, -13.5);
  B(1.7, 0.42, 2.3, M.glass, 11.5, 1.45, -13.5);

  // ═══════════════════════════════════════════════════════════
  //  LANDSCAPING
  // ═══════════════════════════════════════════════════════════
  [[-16,16],[-17,12],[-16,8],[16,16],[17,12],[-8,24],[0,24],[8,24],[-14,-12],[14,-12],[16,4],[-16,-4],[18,18],[-18,18],[-20,10],[20,10]].forEach(([x, z]) => PALM(x, z));

  [[-15,15,0.55],[-13,18,0.45],[15,15,0.6],[13,20,0.5],[-15,5,0.4],[15,5,0.45],[-12,-15,0.55],[12,-15,0.5],[-8,22,0.35],[8,22,0.4],[-16,0,0.45],[16,0,0.45],[-18,14,0.4],[18,14,0.4]].forEach(([x, z, r]) => BUSH(x, 0, z, r));

  // Flowers
  const fc = [0xff6b8a, 0xffaa44, 0xcc66ff, 0xff5555, 0xffcc00, 0xff88aa];
  for (let i = 0; i < 30; i++) {
    const fx = -18 + Math.random() * 36;
    const fz = 12 + Math.random() * 14;
    if (Math.abs(fx) < 4 && fz > 14 && fz < 24) continue;
    S(0.08 + Math.random() * 0.06, 5, 4, mp(fc[i % fc.length], 0.65), fx, 0.15, fz);
    B(0.015, 0.12, 0.015, M.leafDk, fx, 0.08, fz);
  }

  // Garden lights
  const gardenLights = [];
  [[-14,14],[-14,6],[-14,-2],[14,14],[14,6],[14,-2],[-8,23],[0,23],[8,23],[-14,-10],[14,-10]].forEach(([lx, lz]) => {
    C(0.035, 0.045, 0.65, 6, M.metalBlk, lx, 0.32, lz);
    S(0.055, 4, 3, M.emWarm, lx, 0.68, lz);
    const gl = new THREE.PointLight(0xffe0b0, 0.6, 6);
    gl.position.set(lx, 0.85, lz);
    _t.add(gl);
    gardenLights.push(gl);
  });

  scene.add(villa);

  return { poolWater, courtyardWater, fireLight, gardenLights, villa };
}

export { M };
