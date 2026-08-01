import * as THREE from 'three';

const hotspots = [
  // Exterior
  { pos: [0, 2.5, 10.5], title: 'Pivoting Glass Entrance', desc: 'Custom Vitrocsa floor-to-ceiling pivoting doors in black aluminum framing with integrated smart lock system and motion sensors.', tags: ['Vitrocsa', 'Smart Lock', 'Aluminum'], wp: 3 },
  { pos: [-7, 2, 10.3], title: 'Cantilevered Volume', desc: 'Exposed board-formed concrete with integrated wood soffit panels, extending 2.5m beyond the ground floor for passive solar shading.', tags: ['Concrete', 'Passive Design', 'Cantilever'], wp: 3 },
  { pos: [10, 2.5, 10.3], title: 'Wood Accent Panel', desc: 'Sustainably sourced Western Red Cedar cladding with UV-resistant oil finish, providing thermal mass and acoustic dampening.', tags: ['Cedar', 'Sustainable', 'Thermal Mass'], wp: 3 },
  { pos: [0, 0.5, 18], title: 'Infinity Pool', desc: '14m vanishing-edge pool with automated saltwater chlorination, Polaris robotic cleaner, and color-changing LED mood system.', tags: ['Salt Water', 'LED', '14m'], wp: 23 },
  { pos: [-10, 1, 18], title: 'Fire Pit', desc: 'Natural gas fire pit with electronic ignition, surrounded by all-weather Sunbrella lounge seating for eight guests.', tags: ['Natural Gas', 'Sunbrella', '8 Seats'], wp: 25 },
  { pos: [10, 2, 18], title: 'Dining Pavilion', desc: 'Steel pergola with integrated misting system, ambient pendant lighting, and seating for twelve in powder-coated aluminum.', tags: ['Pergola', 'Misting', '12 Seats'], wp: 24 },
  // Interior
  { pos: [0, 1.7, 6], title: 'Double-Height Foyer', desc: '6.8m ceiling height with Calacatta marble flooring, integrated cove lighting, and a bespoke chandelier by Art et Lumiere.', tags: ['Marble', '6.8m Ceiling', 'Cove Lighting'], wp: 4 },
  { pos: [-10, 1.5, 5], title: 'Poliform Living System', desc: 'Custom-configured Poliform Saint Germain modular sofa in Belgian linen, paired with Kelly Hoppen accent pieces.', tags: ['Poliform', 'Belgian Linen', 'Kelly Hoppen'], wp: 6 },
  { pos: [-10, 1.5, 1], title: 'B&O Entertainment', desc: 'Concealed 85-inch LG OLED evo with Beolab 90 speakers, Dolby Atmos 9.1.4 surround, hidden behind motorized wood panels.', tags: ['Bang & Olufsen', 'Dolby Atmos', 'OLED'], wp: 7 },
  { pos: [2, 1, 6], title: 'Murano Glass Pendants', desc: 'Hand-blown Murano glass pendants by Flos, individually numbered, suspended over a live-edge walnut dining table for twelve.', tags: ['Murano Glass', 'Flos', 'Walnut'], wp: 8 },
  { pos: [-8, 1.3, -3], title: 'Calacatta Marble Island', desc: '3-meter waterfall island in Calacatta Borghini marble with integrated Gaggenau induction cooktop and concealed extractor.', tags: ['Calacatta Marble', 'Gaggenau', '3m Island'], wp: 11 },
  { pos: [-11.5, 1.5, -7], title: 'Gaggenau Appliance Suite', desc: 'Full Gaggenau collection: Vario 400 series cooktop, DF 480 combi-steam oven, Wine climate cabinet, and fully integrated refrigeration.', tags: ['Gaggenau', 'Vario 400', 'Wine Cabinet'], wp: 10 },
  { pos: [10, 1.5, -5], title: 'Walnut Study', desc: 'Custom walnut built-in desk with integrated LED task lighting, acoustic wall panels, and automated ventilation.', tags: ['Walnut', 'Acoustic', 'Smart Vent'], wp: 13 },
  { pos: [11, 1.5, 3], title: 'Dolby Atmos Cinema', desc: '4K Sony laser projection, 150-inch acoustically transparent screen, Dolby Atmos 9.1.4, and acoustic fabric wall panels.', tags: ['Dolby Atmos', '4K Laser', '9.1.4'], wp: 15 },
  { pos: [-2, 3, 4], title: 'Floating Concrete Stairs', desc: 'Cantilevered polished concrete steps with frameless 15mm tempered glass balustrades and recessed LED step lighting.', tags: ['Concrete', 'Glass', 'LED Steps'], wp: 17 },
  { pos: [-8, 4.5, 3], title: 'Hästens Master Bed', desc: 'Handcrafted Hästens Vividus mattress on a bespoke Italian leather headboard, with automated blackout curtain system.', tags: ['Hästens', 'Italian Leather', 'Smart Blinds'], wp: 18 },
  { pos: [-10, 4.2, -1], title: 'Freestanding Bathtub', desc: 'Victoria + Albert Barcelona freestanding bath with Dornbracht Rain Sky shower system and heated Calacatta marble floors.', tags: ['Victoria + Albert', 'Dornbracht', 'Heated Floors'], wp: 21 },
  { pos: [0, 1.5, 18], title: 'Pool LED System', desc: 'Color-changing Pentair LED system with 16 million colors, automated scheduling, and integration with the home automation system.', tags: ['Pentair LED', '16M Colors', 'Automated'], wp: 23 },
];

export class HotspotSystem {
  constructor(scene, camera, domElement) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;
    this.hotspots = hotspots;
    this.activeHotspot = null;
    this.onHotspotClick = null;
    this.markers = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.infoEnabled = true;

    this._createMarkers();
    this._bindEvents();
  }

  _createMarkers() {
    const markerGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0xc9a96e,
      transparent: true,
      opacity: 0.6,
    });

    this.hotspots.forEach(hs => {
      const marker = new THREE.Mesh(markerGeo, markerMat.clone());
      marker.position.set(...hs.pos);
      marker.userData.hotspot = hs;
      this.scene.add(marker);
      this.markers.push(marker);

      // Outer ring
      const ringGeo = new THREE.RingGeometry(0.12, 0.15, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc9a96e,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(marker.position);
      ring.lookAt(this.camera.position);
      this.scene.add(ring);
      marker.userData.ring = ring;
    });
  }

  _bindEvents() {
    this.domElement.addEventListener('click', e => {
      if (!this.infoEnabled) return;
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hits = this.raycaster.intersectObjects(this.markers);
      if (hits.length > 0) {
        const hs = hits[0].object.userData.hotspot;
        if (this.onHotspotClick) this.onHotspotClick(hs);
      }
    });
  }

  update(time) {
    this.markers.forEach((m, i) => {
      const dist = m.position.distanceTo(this.camera.position);
      const visible = dist < 12 && this.infoEnabled;
      const targetOpacity = visible ? 0.6 + Math.sin(time * 2 + i) * 0.2 : 0;
      m.material.opacity += (targetOpacity - m.material.opacity) * 0.08;
      m.userData.ring.material.opacity = m.material.opacity * 0.4;
      m.userData.ring.lookAt(this.camera.position);
      m.userData.ring.scale.setScalar(1 + Math.sin(time * 1.5 + i) * 0.1);
    });
  }

  setEnabled(v) {
    this.infoEnabled = v;
    this.markers.forEach(m => {
      m.visible = v;
      m.userData.ring.visible = v;
    });
  }
}
