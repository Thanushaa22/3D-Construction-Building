import * as THREE from 'three';

const M = {};
const mp = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m ?? 0 });

function init() {
  M.concrete     = mp(0xb0aaa4, 0.82);
  M.concreteDk   = mp(0x6a6560, 0.88);
  M.concreteLt   = mp(0xd5d0c8, 0.78);
  M.concreteWarm = mp(0xc5bfb2, 0.8);
  M.wood         = mp(0xa07850, 0.6);
  M.woodDk       = mp(0x5a3d28, 0.65);
  M.woodLt       = mp(0xd4b87a, 0.55);
  M.woodPanel    = mp(0x7a5a3a, 0.5, 0.05);
  M.stone        = mp(0x4a4540, 0.78);
  M.stoneWarm    = mp(0xa09080, 0.75);
  M.stoneWall    = mp(0x7a756e, 0.82);
  M.marble       = mp(0xf8f4ec, 0.12, 0.05);
  M.marbleVein   = mp(0xf0e8dc, 0.18, 0.03);
  M.metalBlk     = mp(0x1a1a1a, 0.22, 0.92);
  M.metalBr      = mp(0xd4b070, 0.18, 0.95);
  M.metalSteel   = mp(0x8090a0, 0.32, 0.85);
  M.metalChrome  = mp(0xe8e8e8, 0.08, 0.98);
  M.glass        = mp(0xaaccee, 0.05, 0.15);
  M.glass.opacity = 0.25;
  M.glass.transparent = true;
  M.glassTint    = mp(0x88aacc, 0.05, 0.1);
  M.glassTint.opacity = 0.4;
  M.glassTint.transparent = true;
  M.fabric       = mp(0xf5f0e8, 0.9);
  M.fabricGray   = mp(0x808080, 0.86);
  M.fabricNavy   = mp(0x2a3a5a, 0.83);
  M.fabricBlush  = mp(0xe0b8b0, 0.86);
  M.leather      = mp(0x3a2218, 0.52, 0.05);
  M.leatherTan   = mp(0xb09070, 0.58, 0.05);
  M.leaf         = mp(0x3a7a2e, 0.86);
  M.leafDk       = mp(0x2a5a1e, 0.9);
  M.leafLt       = mp(0x5a9a3e, 0.83);
  M.grass        = mp(0x4a8a38, 0.9);
  M.soil         = mp(0x4d3b2f, 0.94);
  M.road         = mp(0x3a3a3a, 0.88);
  M.water        = mp(0x2a7aaa, 0.02, 0.12);
  M.water.opacity = 0.55;
  M.water.transparent = true;
  M.poolTile     = mp(0x2a6a8a, 0.08, 0.05);
  M.fire         = mp(0xff6600, 0.5);
  M.fire.emissive = new THREE.Color(0xff4400);
  M.fire.emissiveIntensity = 3;
  M.emWarm       = mp(0xffe0b0, 0.5);
  M.emWarm.emissive = new THREE.Color(0xffe0b0);
  M.emWarm.emissiveIntensity = 2;
  M.emSoft       = mp(0xfff4e0, 0.5);
  M.emSoft.emissive = new THREE.Color(0xfff4e0);
  M.emSoft.emissiveIntensity = 1.2;
  M.tv           = mp(0x0a0a18, 0.2, 0.1);
  M.tv.emissive = new THREE.Color(0x1a2a3a);
  M.tv.emissiveIntensity = 0.6;
  M.pillow       = mp(0xf0e8dc, 0.88);
  M.pillowBlush  = mp(0xe0b8b0, 0.88);
  M.ceramic      = mp(0xf8f4ec, 0.38, 0.02);
  M.rug          = mp(0x9a7a5a, 0.94);
  M.rugPattern   = mp(0x7a5a3a, 0.92);
  M.curtain      = mp(0xf0e8dc, 0.86);
  M.roofMat      = mp(0x3a3a3a, 0.85);

  Object.values(M).forEach(mat => {
    if (!mat.isMaterial) return;
    mat.side = THREE.DoubleSide;
    mat.envMapIntensity = 1;
  });

  return M;
}

export { M, init };
