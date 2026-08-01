import * as THREE from 'three';

const waypoints = [
  { pos: [0, 4, 20],     look: [0, 2, 0],      room: 'Exterior', sub: 'VILLA AURA', exterior: true },
  { pos: [-16, 3.5, 10], look: [0, 2, 0],      room: 'Exterior', sub: 'GARDEN VIEW', exterior: true },
  { pos: [16, 3.5, 10],  look: [0, 2, 0],      room: 'Exterior', sub: 'POOL SIDE', exterior: true },
  { pos: [0, 2.5, 14],   look: [0, 2, 10],     room: 'Exterior', sub: 'ENTRANCE APPROACH', exterior: true },
  { pos: [0, 1.7, 11],   look: [0, 1.7, 8],    room: 'Foyer', sub: 'GRAND ENTRANCE', exterior: false },
  { pos: [-9, 1.7, 5.5], look: [-10, 1, 5],    room: 'Living Room', sub: 'OPEN PLAN LIVING', exterior: false },
  { pos: [-10, 1.7, 4],  look: [-10, 1.5, 1.5],room: 'Living Room', sub: 'ENTERTAINMENT AREA', exterior: false },
  { pos: [-7, 1.7, 7],   look: [-12, 1.5, 8],  room: 'Living Room', sub: 'LOUNGE CORNER', exterior: false },
  { pos: [2, 1.7, 6],    look: [2, 0.8, 6],    room: 'Dining Area', sub: 'FORMAL DINING', exterior: false },
  { pos: [0.5, 1.7, 5],  look: [2, 1, 6],      room: 'Dining Area', sub: 'DINING TABLE', exterior: false },
  { pos: [-7, 1.7, -3],  look: [-8, 1, -5],    room: 'Kitchen', sub: 'DESIGNER KITCHEN', exterior: false },
  { pos: [-9.5, 1.7, -2],look: [-8, 1, -3],    room: 'Kitchen', sub: 'MARBLE ISLAND', exterior: false },
  { pos: [-4, 1.7, -8],  look: [-4, 0.8, -8.5],room: "Butler's Pantry", sub: "BUTLER'S PANTRY", exterior: false },
  { pos: [10, 1.7, -2],  look: [10, 1, -5],    room: 'Home Office', sub: 'PRIVATE STUDY', exterior: false },
  { pos: [12, 1.7, -5],  look: [12.5, 1.2, -5],room: 'Home Office', sub: 'BOOKSHELF WALL', exterior: false },
  { pos: [10, 1.7, 6],   look: [10, 0.8, 6],   room: 'Guest Suite', sub: 'GUEST SUITE', exterior: false },
  { pos: [8.7, 1.7, 5.2],look: [10, 0.8, 6],   room: 'Guest Suite', sub: 'BED VIEW', exterior: false },
  { pos: [10.5, 1.7, 2.5],look: [10.5, 1, 4.8],room: 'Home Theater', sub: 'CINEMA ROOM', exterior: false },
  { pos: [10, 1.7, -8],  look: [12, 1, -8],    room: 'Gym', sub: 'FITNESS CENTER', exterior: false },
  { pos: [-2, 2.2, 3],   look: [-2, 3.5, 6],   room: 'Staircase', sub: 'FLOATING STAIRS', exterior: false },
  { pos: [-2, 4, 5],     look: [-8, 4, 3],     room: 'Master Bedroom', sub: 'MASTER SUITE', exterior: false },
  { pos: [-8, 4, 3],     look: [-8, 4, 1.5],   room: 'Master Bedroom', sub: 'PANORAMIC VIEWS', exterior: false },
  { pos: [-10, 4, 2],    look: [-8, 4, 3],     room: 'Master Bedroom', sub: 'BED OVERVIEW', exterior: false },
  { pos: [-12, 4, -2],   look: [-12, 4, -3],   room: 'Walk-in Wardrobe', sub: 'DRESSING ROOM', exterior: false },
  { pos: [-8, 4, -6],    look: [-10, 3.8, -1], room: 'Luxury Bathroom', sub: 'MASTER BATH', exterior: false },
  { pos: [-6, 4, -7],    look: [-6, 3.8, -8],  room: 'Luxury Bathroom', sub: 'VANITY AREA', exterior: false },
  { pos: [-5, 7.2, 5],   look: [0, 6.8, 15],   room: 'Rooftop Terrace', sub: 'ROOFTOP LOUNGE', exterior: true },
  { pos: [0, 2, 22],     look: [0, 1, 18],     room: 'Pool Area', sub: 'INFINITY POOL', exterior: true },
  { pos: [5, 1.5, 20],   look: [0, 0.5, 18],   room: 'Pool Area', sub: 'POOL DECK', exterior: true },
  { pos: [10, 2, 20],    look: [10, 1.5, 18],  room: 'Outdoor Dining', sub: 'DINING PAVILION', exterior: true },
  { pos: [-10, 1.5, 20], look: [-10, 0.5, 18], room: 'Fire Pit', sub: 'FIRE PIT LOUNGE', exterior: true },
  { pos: [10, 1.5, -13], look: [10, 1, -13],   room: 'Garage', sub: 'LUXURY GARAGE', exterior: true },
];

const tourDescriptions = [
  { title: 'Villa Aura', desc: 'A 680 sqm contemporary masterpiece nestled within lush tropical landscaping, featuring cantilevered volumes and floor-to-ceiling glass walls.' },
  { title: 'The Garden', desc: 'Mature palm trees and curated botanical arrangements create a private oasis, with ambient bollard lighting illuminating natural stone pathways.' },
  { title: 'Pool Side', desc: 'A 14-meter vanishing-edge infinity pool with automated chemical management and integrated LED mood lighting system.' },
  { title: 'The Approach', desc: 'Cantilevered overhangs frame the grand entrance, featuring custom black aluminum pivoting glass doors by Vitrocsa.' },
  { title: 'Grand Foyer', desc: 'Double-height ceiling with natural stone flooring, showcasing a floating staircase in exposed concrete and tempered glass balustrades.' },
  { title: 'Living Space', desc: 'Open-plan living with 4.2-meter ceilings, Italian Poliform furniture, and a concealed B&O entertainment system behind motorized wood paneling.' },
  { title: 'Entertainment', desc: 'Discreetly integrated 85-inch LG OLED display with Dolby Atmos surround sound, hidden within the architectural wall system.' },
  { title: 'Lounge Corner', desc: 'Custom L-shaped seating in premium Belgian linen, paired with a Kelly Hoppen coffee table in brushed brass and smoked glass.' },
  { title: 'Formal Dining', desc: 'Seats twelve around a custom live-edge walnut table, illuminated by hand-blown Murano glass pendants from Flos.' },
  { title: 'Dining Table', desc: 'Hans Wegner wishbone chairs surround the table, with a bespoke sideboard in smoked oak displaying artisan ceramics.' },
  { title: 'Kitchen', desc: 'Gaggenau full appliance suite with a Calacatta marble island, integrated herb garden, and concealed butler pantry.' },
  { title: 'The Island', desc: 'A 3-meter Calacatta Borghini marble waterfall island with integrated induction cooking and waterfall edge detail.' },
  { title: "Butler's Pantry", desc: 'Fully equipped secondary kitchen with additional refrigeration, wine storage, and preparation space.' },
  { title: 'Home Office', desc: 'A quiet retreat with custom walnut joinery, integrated task lighting, and acoustic treatment for focused work.' },
  { title: 'Bookshelf Wall', desc: 'Floor-to-ceiling custom walnut shelving with curated collection and integrated LED accent lighting.' },
  { title: 'Guest Suite', desc: 'A private sanctuary with en-suite facilities, premium Hästens bedding, and automated curtain systems.' },
  { title: 'Bed View', desc: 'Italian leather headboard with ambient bedside lighting and panoramic garden views through automated blinds.' },
  { title: 'Cinema Room', desc: 'Dedicated home theater with 4K laser projection, Dolby Atmos 9.1.4 surround, and acoustic fabric wall panels.' },
  { title: 'Fitness Center', desc: 'Fully equipped gym with Technogym equipment, rubber flooring, and mirrored walls.' },
  { title: 'Floating Stairs', desc: 'Architectural floating cantilevered steps in polished concrete with frameless tempered glass balustrades.' },
  { title: 'Master Suite', desc: 'A 45 sqm master retreat with panoramic garden views, motorized blackout curtains, and bespoke headboard.' },
  { title: 'Panoramic Views', desc: 'Floor-to-ceiling glazing frames the tropical canopy, with automated blinds responding to sunlight.' },
  { title: 'Bed Overview', desc: 'King-size Hästens Vividus mattress with bespoke Italian leather surround and integrated ambient lighting.' },
  { title: 'Dressing Room', desc: 'Custom walk-in wardrobe with integrated LED lighting, glass-fronted drawers, and curated display system.' },
  { title: 'Master Bath', desc: 'Freestanding Victoria + Albert bathtub, Dornbracht fixtures, heated Calacatta marble floors, and steam shower.' },
  { title: 'Vanity Area', desc: 'Double vanity with backlit mirror, integrated storage, and premium Dornbracht fixtures throughout.' },
  { title: 'Rooftop Terrace', desc: 'An elevated outdoor living space with panoramic views, retractable shade, and integrated weather station.' },
  { title: 'Infinity Pool', desc: '14-meter infinity edge pool with automated cover, saltwater chlorination, and submerged LED lighting.' },
  { title: 'Pool Deck', desc: 'Premium travertine deck with four loungers, integrated planters, and ambient recessed lighting.' },
  { title: 'Outdoor Dining', desc: 'A bespoke pergola sheltering seating for twelve, with integrated misting and ambient pendant lighting.' },
  { title: 'Fire Pit', desc: 'A natural gas fire pit surrounded by deep-seated lounge seating under the stars.' },
  { title: 'Luxury Garage', desc: 'Climate-controlled three-car gallery with epoxy flooring, EV charging stations, and workshop space.' },
];

export class CameraSystem {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.waypoints = waypoints;
    this.currentIndex = 0;
    this.targetPos = new THREE.Vector3(...waypoints[0].pos);
    this.targetLook = new THREE.Vector3(...waypoints[0].look);
    this.currentLook = new THREE.Vector3(...waypoints[0].look);
    this.isTransitioning = false;
    this.transitionProgress = 0;
    this.transitionDuration = 1.5;
    this.startPos = new THREE.Vector3();
    this.startLook = new THREE.Vector3();

    // Mouse look
    this.yaw = 0;
    this.pitch = 0;
    this.mouseDown = false;
    this.prevMouse = { x: 0, y: 0 };
    this.lookSensitivity = 0.003;
    this.targetYaw = 0;
    this.targetPitch = 0;

    // Free movement
    this.keys = {};
    this.moveSpeed = 5;
    this.isExterior = true;
    this.onWaypointChange = null;

    this._bindEvents();
  }

  _bindEvents() {
    this.domElement.addEventListener('mousedown', e => {
      this.mouseDown = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });
    this.domElement.addEventListener('mouseup', () => this.mouseDown = false);
    this.domElement.addEventListener('mouseleave', () => this.mouseDown = false);

    this.domElement.addEventListener('mousemove', e => {
      if (!this.mouseDown) return;
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this.prevMouse = { x: e.clientX, y: e.clientY };

      this.targetYaw -= dx * this.lookSensitivity;
      this.targetPitch -= dy * this.lookSensitivity;
      this.targetPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.targetPitch));
    });

    // Right-click drag for look
    this.domElement.addEventListener('contextmenu', e => e.preventDefault());

    document.addEventListener('keydown', e => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ') e.preventDefault();
    });
    document.addEventListener('keyup', e => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Scroll zoom (both exterior and interior)
    this.domElement.addEventListener('wheel', e => {
      if (this.isTransitioning) return;
      const forward = new THREE.Vector3();
      this.camera.getWorldDirection(forward);
      const speed = this.isExterior ? 2 : 1;
      this.camera.position.addScaledVector(forward, -e.deltaY * 0.01 * speed);
    }, { passive: true });
  }

  goTo(index) {
    if (index < 0 || index >= this.waypoints.length) return;
    this.currentIndex = index;
    const wp = this.waypoints[index];
    this.startPos.copy(this.camera.position);
    this.startLook.copy(this.currentLook);
    this.targetPos.set(...wp.pos);
    this.targetLook.set(...wp.look);
    this.isTransitioning = true;
    this.transitionProgress = 0;
    this.isExterior = wp.exterior;

    // Reset look angles
    const dir = new THREE.Vector3().subVectors(this.targetLook, this.targetPos).normalize();
    this.targetYaw = Math.atan2(-dir.x, -dir.z);
    this.targetPitch = Math.asin(dir.y);
    this.yaw = this.targetYaw;
    this.pitch = this.targetPitch;

    if (this.onWaypointChange) this.onWaypointChange(index, wp);
  }

  next() {
    this.goTo(Math.min(this.currentIndex + 1, this.waypoints.length - 1));
  }

  prev() {
    this.goTo(Math.max(this.currentIndex - 1, 0));
  }

  goToExterior() {
    this.goTo(0);
  }

  update(dt, time) {
    // Smooth look interpolation
    this.yaw += (this.targetYaw - this.yaw) * Math.min(dt * 10, 1);
    this.pitch += (this.targetPitch - this.pitch) * Math.min(dt * 10, 1);

    if (this.isTransitioning) {
      this.transitionProgress += dt / this.transitionDuration;
      if (this.transitionProgress >= 1) {
        this.transitionProgress = 1;
        this.isTransitioning = false;
      }
      const t = this.transitionProgress;
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      this.camera.position.lerpVectors(this.startPos, this.targetPos, ease);
      this.currentLook.lerpVectors(this.startLook, this.targetLook, ease);
    } else {
      // Free movement with WASD / arrow keys
      const forward = new THREE.Vector3();
      this.camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
      const speed = this.moveSpeed * dt;

      const move = new THREE.Vector3();
      if (this.keys['w'] || this.keys['arrowup']) move.add(forward);
      if (this.keys['s'] || this.keys['arrowdown']) move.sub(forward);
      if (this.keys['d'] || this.keys['arrowright']) move.add(right);
      if (this.keys['a'] || this.keys['arrowleft']) move.sub(right);
      if (this.keys[' '] || this.keys['q']) move.y += 1;
      if (this.keys['e'] || this.keys['shift']) move.y -= 1;

      if (move.length() > 0) {
        move.normalize().multiplyScalar(speed);
        this.camera.position.add(move);
        this.targetPos.copy(this.camera.position);
        // Look where camera is facing
        this.targetLook.copy(this.camera.position).add(
          new THREE.Vector3(
            -Math.sin(this.yaw) * Math.cos(this.pitch),
            Math.sin(this.pitch),
            -Math.cos(this.yaw) * Math.cos(this.pitch)
          ).multiplyScalar(10)
        );
        this.currentLook.copy(this.targetLook);
      } else {
        // Idle: keep camera at target position with current look direction
        this.camera.position.lerp(this.targetPos, 0.05);
        this.targetLook.set(
          this.camera.position.x - Math.sin(this.yaw) * Math.cos(this.pitch) * 10,
          this.camera.position.y + Math.sin(this.pitch) * 10,
          this.camera.position.z - Math.cos(this.yaw) * Math.cos(this.pitch) * 10
        );
        this.currentLook.lerp(this.targetLook, 0.08);
      }
    }

    // Apply look rotation from yaw/pitch
    const lookDir = new THREE.Vector3(
      -Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * Math.cos(this.pitch)
    );
    const lookTarget = this.camera.position.clone().add(lookDir.multiplyScalar(10));
    this.camera.lookAt(lookTarget);
    this.currentLook.copy(lookTarget);
  }

  getCurrentWaypoint() {
    return this.waypoints[this.currentIndex];
  }

  getTourDescription() {
    return tourDescriptions[this.currentIndex] || tourDescriptions[0];
  }
}
