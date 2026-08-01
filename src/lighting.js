import * as THREE from 'three';

const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) || window.innerWidth < 768;

const timePresets = {
  golden: {
    skyTop: new THREE.Color(0x5a8ac5),
    skyBot: new THREE.Color(0xf5b870),
    fogColor: new THREE.Color(0xe0b878),
    fogDensity: 0.006,
    sunColor: new THREE.Color(0xffc070),
    sunIntensity: 3,
    sunPos: new THREE.Vector3(18, 15, 15),
    ambientIntensity: 0.7,
    hemiSky: new THREE.Color(0x90d0f0),
    hemiGround: new THREE.Color(0xa08060),
    hemiIntensity: 0.5,
    exposure: 1.5,
    envIntensity: 1,
  },
  sunset: {
    skyTop: new THREE.Color(0x1a2a4a),
    skyBot: new THREE.Color(0xe06030),
    fogColor: new THREE.Color(0x8a4020),
    fogDensity: 0.012,
    sunColor: new THREE.Color(0xff6030),
    sunIntensity: 1.5,
    sunPos: new THREE.Vector3(25, 4, 20),
    ambientIntensity: 0.3,
    hemiSky: new THREE.Color(0x4a5a7a),
    hemiGround: new THREE.Color(0x3d2b1f),
    hemiIntensity: 0.25,
    exposure: 0.9,
    envIntensity: 0.5,
  },
  night: {
    skyTop: new THREE.Color(0x050510),
    skyBot: new THREE.Color(0x0a0a1a),
    fogColor: new THREE.Color(0x080812),
    fogDensity: 0.018,
    sunColor: new THREE.Color(0x334466),
    sunIntensity: 0.3,
    sunPos: new THREE.Vector3(-10, 8, 10),
    ambientIntensity: 0.08,
    hemiSky: new THREE.Color(0x1a1a3a),
    hemiGround: new THREE.Color(0x0a0a0a),
    hemiIntensity: 0.1,
    exposure: 0.6,
    envIntensity: 0.2,
  }
};

export class LightingSystem {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.currentTime = 'golden';
    this.targetTime = 'golden';
    this.transitionProgress = 1;
    this.transitionSpeed = 0.8;

    // Ambient light
    this.ambient = new THREE.AmbientLight(0xffeedd, 0.5);
    scene.add(this.ambient);

    // Hemisphere light
    this.hemi = new THREE.HemisphereLight(0x87ceeb, 0x8b6f47, 0.4);
    scene.add(this.hemi);

    // Sun / directional light
    this.sun = new THREE.DirectionalLight(0xffb060, 2.5);
    this.sun.position.set(20, 12, 15);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 80;
    this.sun.shadow.camera.left = -35;
    this.sun.shadow.camera.right = 35;
    this.sun.shadow.camera.top = 25;
    this.sun.shadow.camera.bottom = -25;
    this.sun.shadow.bias = -0.0005;
    this.sun.shadow.normalBias = 0.02;
    scene.add(this.sun);

    // Fill light
    this.fill = new THREE.DirectionalLight(0xa0c4ff, 0.15);
    this.fill.position.set(-15, 10, -10);
    scene.add(this.fill);

    // Interior warm lights
    this.interiorLights = [];
    const allIntLights = [
      [0, 2.8, 6, 2, 15],       // Dining
      [-8, 2.8, -3, 1.8, 14],   // Kitchen
      [-10, 2.5, 5, 2.5, 15],   // Living
      [10, 2.5, 6, 1.5, 12],    // Guest
      [11, 2.5, 3, 1.2, 12],    // Theater
      [10, 2.5, -8, 1.2, 12],   // Gym
      [-8, 6.5, 3, 2, 15],      // Master bedroom
      [-6, 6.5, -6, 1.5, 12],   // Master bath
      [-5, 7.5, 5, 1, 10],      // Rooftop
      [0, 1.5, 10, 1, 8],       // Entrance
      [-2, 1.8, 2, 1.5, 10],    // Staircase
    ];
    const intLightPositions = isMobile
      ? allIntLights.filter((_, i) => i % 2 === 0)
      : allIntLights;
    intLightPositions.forEach(([x, y, z, i, d]) => {
      const l = new THREE.PointLight(0xffd4a0, i, d);
      l.position.set(x, y, z);
      scene.add(l);
      this.interiorLights.push(l);
    });

    // Outdoor ambient lights
    this.outdoorLights = [];
    const outLightPositions = [
      [0, 3, 18, 1.5, 15],      // Pool
      [10, 3, 18, 0.8, 10],     // Outdoor dining
      [-10, 2, 18, 1, 10],      // Fire pit area
    ];
    outLightPositions.forEach(([x, y, z, i, d]) => {
      const l = new THREE.PointLight(0xffd4a0, i, d);
      l.position.set(x, y, z);
      scene.add(l);
      this.outdoorLights.push(l);
    });

    // Sky dome
    this.skyGeo = new THREE.SphereGeometry(100, isMobile ? 16 : 32, isMobile ? 8 : 16);
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x4a7ab5) },
        bottomColor: { value: new THREE.Color(0xf0a050) },
        offset: { value: 5 },
        exponent: { value: 0.5 },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });
    this.sky = new THREE.Mesh(this.skyGeo, this.skyMat);
    scene.add(this.sky);

    // Fog
    scene.fog = new THREE.FogExp2(0xd4a060, 0.008);

    this._applyPreset('golden');
  }

  setTime(name) {
    if (name === this.currentTime) return;
    this.targetTime = name;
    this.transitionProgress = 0;
    this.currentTime = name;
  }

  _applyPreset(name) {
    const p = timePresets[name];
    if (!p) return;
    this.skyMat.uniforms.topColor.value.copy(p.skyTop);
    this.skyMat.uniforms.bottomColor.value.copy(p.skyBot);
    this.scene.fog.color.copy(p.fogColor);
    this.scene.fog.density = p.fogDensity;
    this.sun.color.copy(p.sunColor);
    this.sun.intensity = p.sunIntensity;
    this.sun.position.copy(p.sunPos);
    this.ambient.intensity = p.ambientIntensity;
    this.hemi.color.copy(p.hemiSky);
    this.hemi.groundColor.copy(p.hemiGround);
    this.hemi.intensity = p.hemiIntensity;
    this.renderer.toneMappingExposure = p.exposure;

    // Adjust interior lights based on time
    const nightMult = name === 'night' ? 2.5 : name === 'sunset' ? 1.8 : 1;
    this.interiorLights.forEach(l => {
      l.intensity = l.userData?.baseIntensity
        ? l.userData.baseIntensity * nightMult
        : nightMult;
    });

    // Outdoor lights more visible at night
    const outMult = name === 'night' ? 3 : name === 'sunset' ? 2 : 0.5;
    this.outdoorLights.forEach(l => {
      l.intensity = l.userData?.baseIntensity
        ? l.userData.baseIntensity * outMult
        : outMult;
    });
  }

  update(dt) {
    if (this.transitionProgress < 1) {
      this.transitionProgress = Math.min(1, this.transitionProgress + dt * this.transitionSpeed);
      const p = timePresets[this.targetTime];
      const t = this.transitionProgress;
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      this.skyMat.uniforms.topColor.value.lerp(p.skyTop, ease * 0.1);
      this.skyMat.uniforms.bottomColor.value.lerp(p.skyBot, ease * 0.1);
      this.scene.fog.color.lerp(p.fogColor, ease * 0.05);
      this.sun.color.lerp(p.sunColor, ease * 0.05);

      if (t >= 1) this._applyPreset(this.targetTime);
    }
  }
}

export { timePresets };
