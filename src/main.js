import * as THREE from 'three';
import { init as initMaterials } from './materials.js';
import { buildVilla } from './villa.js';
import { CameraSystem } from './camera.js';
import { LightingSystem } from './lighting.js';
import { AnimationSystem } from './animations.js';
import { HotspotSystem } from './hotspots.js';
import { UIManager } from './ui.js';

let renderer, scene, camera, clock;
let cameraSystem, lightingSystem, animationSystem, hotspotSystem, uiManager;
let animatedObjects;
let isStarted = false;
let isTourMode = false;
let tourTimer = null;

function init() {
  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('c'),
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.set(0, 4, 20);

  initMaterials();
  animatedObjects = buildVilla(scene);

  lightingSystem = new LightingSystem(scene, renderer);
  animationSystem = new AnimationSystem(scene, animatedObjects);
  cameraSystem = new CameraSystem(camera, renderer.domElement);
  hotspotSystem = new HotspotSystem(scene, camera, renderer.domElement);
  uiManager = new UIManager();

  cameraSystem.onWaypointChange = (index, wp) => {
    uiManager.updateRoom(wp.room, wp.sub);
    uiManager.updateMapPosition(index, cameraSystem.waypoints.length, wp.exterior);
    if (isTourMode) {
      const desc = cameraSystem.getTourDescription();
      uiManager.showTourOverlay(desc);
    }
  };

  hotspotSystem.onHotspotClick = (hs) => {
    uiManager.showInfoCard(hs);
  };

  uiManager.on('prev', () => { if (isTourMode) stopTour(); cameraSystem.prev(); });
  uiManager.on('next', () => { if (isTourMode) stopTour(); cameraSystem.next(); });
  uiManager.on('exterior', () => { if (isTourMode) stopTour(); cameraSystem.goToExterior(); });
  uiManager.on('tour', () => { if (isTourMode) stopTour(); else startTour(); });
  uiManager.on('timeChange', (time) => lightingSystem.setTime(time));
  uiManager.on('weatherChange', (weather) => animationSystem.setWeather(weather));
  uiManager.on('toggleInfo', () => {
    const enabled = !hotspotSystem.infoEnabled;
    hotspotSystem.setEnabled(enabled);
    uiManager.elements.btnInfo?.classList.toggle('active', enabled);
  });

  uiManager.elements.startBtn?.addEventListener('click', startExperience);
  window.addEventListener('resize', onResize);

  // Non-movement keyboard shortcuts only (WASD/arrows handled by camera)
  document.addEventListener('keydown', onKeyDown);

  simulateLoad();
  animate();
}

function simulateLoad() {
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 8 + 2;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      setTimeout(() => {
        uiManager.hideLoader();
        setTimeout(() => uiManager.showStartScreen(), 600);
      }, 500);
    }
    uiManager.setLoadingProgress(p);
  }, 80);
}

function startExperience() {
  isStarted = true;
  uiManager.hideStartScreen();
}

function startTour() {
  isTourMode = true;
  uiManager.setTourMode(true);
  cameraSystem.goTo(0);
  const desc = cameraSystem.getTourDescription();
  uiManager.showTourOverlay(desc);
  advanceTour();
}

function advanceTour() {
  if (!isTourMode) return;
  tourTimer = setTimeout(() => {
    if (!isTourMode) return;
    if (cameraSystem.currentIndex < cameraSystem.waypoints.length - 1) {
      cameraSystem.next();
      advanceTour();
    } else {
      stopTour();
    }
  }, 4000);
}

function stopTour() {
  isTourMode = false;
  uiManager.setTourMode(false);
  clearTimeout(tourTimer);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
  if (!isStarted) return;
  const key = e.key;
  // Tour and time controls only — WASD handled by camera system
  if (key === 't') {
    if (isTourMode) stopTour(); else startTour();
  } else if (key === 'f') {
    uiManager._toggleFullscreen();
  } else if (key === '1') {
    lightingSystem.setTime('golden');
    document.querySelectorAll('[data-time]').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-time="golden"]')?.classList.add('active');
  } else if (key === '2') {
    lightingSystem.setTime('sunset');
    document.querySelectorAll('[data-time]').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-time="sunset"]')?.classList.add('active');
  } else if (key === '3') {
    lightingSystem.setTime('night');
    document.querySelectorAll('[data-time]').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-time="night"]')?.classList.add('active');
  } else if (key === 'Escape') {
    uiManager.hideInfoCard();
    if (isTourMode) stopTour();
  }
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const time = clock.getElapsedTime();

  if (isStarted) {
    cameraSystem.update(dt, time);
    lightingSystem.update(dt);
    animationSystem.update(dt, time, camera.position, lightingSystem.currentTime);
    hotspotSystem.update(time);
  }

  renderer.render(scene, camera);
}

try {
  init();
} catch (e) {
  console.error('INIT ERROR:', e);
  document.getElementById('loader').innerHTML =
    '<div style="color:#c9a96e;font-family:monospace;font-size:13px;padding:2rem;text-align:center">' +
    'Error: ' + e.message + '</div>';
}
