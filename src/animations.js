import * as THREE from 'three';

export class AnimationSystem {
  constructor(scene, animatedObjects) {
    this.scene = scene;
    this.objs = animatedObjects;
    this.particles = [];
    this.fans = [];
    this.autoBlinds = [];
    this.dustSystem = null;
    this.rainSystem = null;
    this.fireflies = null;
    this.weatherMode = 'clear';

    this._createDustParticles();
    this._createFireflies();
  }

  _createDustParticles() {
    const count = 100;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xfff8ee,
      size: 0.04,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.dustSystem = new THREE.Points(geo, mat);
    this.scene.add(this.dustSystem);
  }

  _createFireflies() {
    const count = 30;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = -15 + Math.random() * 30;
      pos[i * 3 + 1] = 0.5 + Math.random() * 3;
      pos[i * 3 + 2] = 5 + Math.random() * 20;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffee88,
      size: 0.12,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.fireflies = new THREE.Points(geo, mat);
    this.scene.add(this.fireflies);
  }

  setWeather(mode) {
    this.weatherMode = mode;
    if (mode === 'rain' || mode === 'storm') {
      this._startRain();
    } else {
      this._stopRain();
    }
  }

  _startRain() {
    if (this.rainSystem) return;
    const count = 800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      vel[i] = 0.3 + Math.random() * 0.3;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xaabbcc,
      size: 0.06,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    this.rainSystem = new THREE.Points(geo, mat);
    this.rainSystem.userData.vel = vel;
    this.scene.add(this.rainSystem);
  }

  _stopRain() {
    if (this.rainSystem) {
      this.scene.remove(this.rainSystem);
      this.rainSystem.geometry.dispose();
      this.rainSystem.material.dispose();
      this.rainSystem = null;
    }
  }

  update(dt, time, cameraPos, lightingTime) {
    // Pool water ripples
    if (this.objs?.poolWater) {
      const wp = this.objs.poolWater.geometry.attributes.position;
      for (let i = 0; i < wp.count; i++) {
        const x = wp.getX(i);
        const y = wp.getY(i);
        wp.setZ(i,
          Math.sin(x * 1.5 + time * 1.2) * 0.015 +
          Math.sin(y * 2 + time * 0.8) * 0.01 +
          Math.sin((x + y) * 0.8 + time * 0.6) * 0.008
        );
      }
      wp.needsUpdate = true;
      this.objs.poolWater.material.opacity = 0.45 + Math.sin(time * 0.3) * 0.05;
    }

    // Courtyard water
    if (this.objs?.courtyardWater) {
      const cw = this.objs.courtyardWater.geometry.attributes.position;
      for (let i = 0; i < cw.count; i++) {
        const x = cw.getX(i);
        const y = cw.getY(i);
        cw.setZ(i, Math.sin(x * 3 + time * 1.5) * 0.005 + Math.sin(y * 2 + time) * 0.003);
      }
      cw.needsUpdate = true;
    }

    // Fire pit flicker
    if (this.objs?.fireLight) {
      this.objs.fireLight.intensity = 1.5 + Math.sin(time * 5) * 0.5 + Math.sin(time * 8.3) * 0.3;
      this.objs.fireLight.position.y = 0.8 + Math.sin(time * 3) * 0.1;
    }

    // Garden lights pulse
    if (this.objs?.gardenLights) {
      const nightMult = lightingTime === 'night' ? 2.5 : lightingTime === 'sunset' ? 1.5 : 0.3;
      this.objs.gardenLights.forEach((l, i) => {
        l.intensity = nightMult + Math.sin(time * 0.5 + i * 0.7) * 0.15;
      });
    }

    // Dust particles drift
    if (this.dustSystem) {
      const dp = this.dustSystem.geometry.attributes.position;
      for (let i = 0; i < dp.count; i++) {
        let x = dp.getX(i) + Math.sin(time * 0.2 + i * 0.1) * 0.003;
        let y = dp.getY(i) + Math.sin(time * 0.3 + i * 0.2) * 0.001;
        let z = dp.getZ(i) + Math.cos(time * 0.25 + i * 0.15) * 0.003;
        if (y > 7) y = 0.5;
        if (Math.abs(x) > 20) x = (Math.random() - 0.5) * 20;
        dp.setXYZ(i, x, y, z);
      }
      dp.needsUpdate = true;
      // Less visible during night/rain
      this.dustSystem.material.opacity = lightingTime === 'night' ? 0.1 : this.weatherMode !== 'clear' ? 0.05 : 0.3;
    }

    // Fireflies (night only)
    if (this.fireflies) {
      const showFireflies = lightingTime === 'night';
      this.fireflies.material.opacity += ((showFireflies ? 0.8 : 0) - this.fireflies.material.opacity) * 0.02;
      if (showFireflies) {
        const fp = this.fireflies.geometry.attributes.position;
        for (let i = 0; i < fp.count; i++) {
          let x = fp.getX(i) + Math.sin(time * 0.5 + i * 1.3) * 0.01;
          let y = fp.getY(i) + Math.sin(time * 0.7 + i * 0.9) * 0.005;
          let z = fp.getZ(i) + Math.cos(time * 0.4 + i * 1.1) * 0.01;
          fp.setXYZ(i, x, y, z);
        }
        fp.needsUpdate = true;
      }
    }

    // Rain animation
    if (this.rainSystem) {
      const rp = this.rainSystem.geometry.attributes.position;
      const rv = this.rainSystem.userData.vel;
      const windX = this.weatherMode === 'storm' ? 0.05 : 0.01;
      for (let i = 0; i < rp.count; i++) {
        let y = rp.getY(i) - rv[i];
        let x = rp.getX(i) + windX;
        if (y < 0) {
          y = 15 + Math.random() * 5;
          x = (Math.random() - 0.5) * 50;
          rp.setZ(i, (Math.random() - 0.5) * 50);
        }
        rp.setY(i, y);
        rp.setX(i, x);
      }
      rp.needsUpdate = true;
    }

    // Lightning flash for storm
    if (this.weatherMode === 'storm' && Math.random() < 0.003) {
      this._flashLightning();
    }
  }

  _flashLightning() {
    const flash = new THREE.PointLight(0xffffff, 10, 100);
    flash.position.set(
      (Math.random() - 0.5) * 40,
      15 + Math.random() * 10,
      (Math.random() - 0.5) * 40
    );
    this.scene.add(flash);
    setTimeout(() => {
      flash.intensity = 0;
      setTimeout(() => this.scene.remove(flash), 100);
    }, 80);
  }

  dispose() {
    this._stopRain();
    if (this.dustSystem) {
      this.scene.remove(this.dustSystem);
      this.dustSystem.geometry.dispose();
      this.dustSystem.material.dispose();
    }
    if (this.fireflies) {
      this.scene.remove(this.fireflies);
      this.fireflies.geometry.dispose();
      this.fireflies.material.dispose();
    }
  }
}
