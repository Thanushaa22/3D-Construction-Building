export class UIManager {
  constructor() {
    this.elements = {
      loader: document.getElementById('loader'),
      ldBar: document.getElementById('ldBar'),
      ldPct: document.getElementById('ldPct'),
      startOverlay: document.getElementById('startOverlay'),
      startBtn: document.getElementById('startBtn'),
      ui: document.getElementById('ui'),
      roomName: document.getElementById('roomName'),
      roomSubtitle: document.getElementById('roomSubtitle'),
      navBar: document.getElementById('navBar'),
      miniMap: document.getElementById('miniMap'),
      mapDot: document.getElementById('mapDot'),
      infoCard: document.getElementById('infoCard'),
      cardTitle: document.getElementById('cardTitle'),
      cardDesc: document.getElementById('cardDesc'),
      cardTags: document.getElementById('cardTags'),
      closeCard: document.querySelector('.close-card'),
      tourOverlay: document.getElementById('tourOverlay'),
      tourTitle: document.getElementById('tourTitle'),
      tourDesc: document.getElementById('tourDesc'),
      crosshair: document.getElementById('crosshair'),
      btnPrev: document.getElementById('btnPrev'),
      btnNext: document.getElementById('btnNext'),
      btnExt: document.getElementById('btnExt'),
      btnTour: document.getElementById('btnTour'),
      btnInfo: document.getElementById('btnInfo'),
      btnFS: document.getElementById('btnFS'),
      weatherFx: document.getElementById('weatherFx'),
    };

    this.hideTimer = null;
    this.isUIShown = false;
    this.isTourMode = false;
    this.callbacks = {};
    this._bindEvents();
    this._setupAutoHide();
  }

  _bindEvents() {
    this.elements.closeCard?.addEventListener('click', () => this.hideInfoCard());
    this.elements.btnPrev?.addEventListener('click', () => this._emit('prev'));
    this.elements.btnNext?.addEventListener('click', () => this._emit('next'));
    this.elements.btnExt?.addEventListener('click', () => this._emit('exterior'));
    this.elements.btnTour?.addEventListener('click', () => this._emit('tour'));
    this.elements.btnFS?.addEventListener('click', () => this._toggleFullscreen());
    this.elements.btnInfo?.addEventListener('click', () => this._emit('toggleInfo'));

    // Time buttons
    document.querySelectorAll('[data-time]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-time]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._emit('timeChange', btn.dataset.time);
      });
    });

    // Weather buttons
    document.querySelectorAll('[data-weather]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-weather]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._emit('weatherChange', btn.dataset.weather);
      });
    });
  }

  _setupAutoHide() {
    let idleTimer;
    const resetIdle = () => {
      this.showUI();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => this.hideUI(), 4000);
    };
    document.addEventListener('mousemove', resetIdle);
    document.addEventListener('mousedown', resetIdle);
    document.addEventListener('keydown', resetIdle);
    resetIdle();
  }

  _emit(event, data) {
    if (this.callbacks[event]) this.callbacks[event](data);
  }

  on(event, cb) {
    this.callbacks[event] = cb;
  }

  setLoadingProgress(pct) {
    this.elements.ldBar.style.width = pct + '%';
    this.elements.ldPct.textContent = Math.round(pct) + '%';
  }

  hideLoader() {
    this.elements.loader.classList.add('done');
  }

  showStartScreen() {
    this.elements.startOverlay.classList.add('show');
  }

  hideStartScreen() {
    this.elements.startOverlay.classList.remove('show');
    this.elements.ui.classList.add('active');
    setTimeout(() => this.showUI(), 500);
  }

  showUI() {
    this.isUIShown = true;
    this.elements.navBar.classList.remove('hidden');
    this.elements.crosshair.classList.add('show');
    this.elements.miniMap.classList.add('show');
  }

  hideUI() {
    if (this.isTourMode) return;
    this.isUIShown = false;
    this.elements.navBar.classList.add('hidden');
    this.elements.crosshair.classList.remove('show');
    this.elements.miniMap.classList.remove('show');
  }

  updateRoom(name, sub) {
    this.elements.roomName.textContent = name;
    this.elements.roomSubtitle.textContent = sub;
    // Fade animation
    const rl = document.getElementById('roomLabel');
    rl.style.opacity = '0';
    setTimeout(() => { rl.style.opacity = '1'; }, 100);
  }

  updateMapPosition(wpIndex, total, isExterior) {
    // Simple map dot positioning
    const progress = wpIndex / (total - 1);
    const x = 20 + progress * 100;
    const y = isExterior ? 90 : 50;
    this.elements.mapDot.setAttribute('cx', x);
    this.elements.mapDot.setAttribute('cy', y);
  }

  showInfoCard(hotspot) {
    this.elements.cardTitle.textContent = hotspot.title;
    this.elements.cardDesc.textContent = hotspot.desc;
    this.elements.cardTags.innerHTML = hotspot.tags
      .map(t => `<span class="tag">${t}</span>`)
      .join('');
    this.elements.infoCard.classList.add('show');
  }

  hideInfoCard() {
    this.elements.infoCard.classList.remove('show');
  }

  showTourOverlay(desc) {
    this.elements.tourTitle.textContent = desc.title;
    this.elements.tourDesc.textContent = desc.desc;
    this.elements.tourOverlay.classList.add('show');
    this.isTourMode = true;
  }

  hideTourOverlay() {
    this.elements.tourOverlay.classList.remove('show');
    this.isTourMode = false;
  }

  setTourMode(active) {
    this.elements.btnTour?.classList.toggle('active', active);
    if (!active) this.hideTourOverlay();
  }

  _toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }
}
