/* ============================================
   Lab Companion — Main App
   Routing, state, persistence, timers, toasts
   ============================================ */

(function () {
  'use strict';

  const State = {
    currentView: 'dashboard',
    timers: [],
    notebook: [],
    tasks: [],
    inventory: [],
    customRecipes: [],
    theme: 'light',
    settings: { notifications: true }
  };

  const Views = {};

  /* ---------- Storage ---------- */
  const S = {
    key: n => `lc.${n}`,
    get(n, f) { try { const v = localStorage.getItem(S.key(n)); return v === null ? f : JSON.parse(v); } catch(e) { return f; } },
    set(n, v) { try { localStorage.setItem(S.key(n), JSON.stringify(v)); } catch(e) {} }
  };

  function load() {
    State.timers = S.get('timers', []);
    State.notebook = S.get('notebook', []);
    State.tasks = S.get('tasks', []);
    State.inventory = S.get('inventory', []);
    State.customRecipes = S.get('customRecipes', []);
    State.theme = S.get('theme', 'light');
    State.settings = S.get('settings', { notifications: true });
    document.documentElement.setAttribute('data-theme', State.theme);
    const sun = document.querySelector('.icon-sun'), moon = document.querySelector('.icon-moon');
    if (sun && moon) { sun.style.display = State.theme === 'light' ? 'block' : 'none'; moon.style.display = State.theme === 'light' ? 'none' : 'block'; }
  }

  /* ---------- Router ---------- */
  window.LC = window.LC || {};
  Object.assign(window.LC, {
    State, Views, S,
    registerView(name, fn) { Views[name] = fn; },
    navigate(view) {
      if (!Views[view]) view = 'dashboard';
      State.currentView = view;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === view));
      const main = document.getElementById('mainView');
      if (!main) return;
      main.innerHTML = '';
      const render = Views[view];
      if (render) {
        const out = render();
        if (typeof out === 'string') main.innerHTML = out;
        else if (out instanceof HTMLElement) main.appendChild(out);
      }
      const sb = document.getElementById('sidebar');
      const ov = document.getElementById('sidebarOverlay');
      if (sb) sb.classList.remove('open');
      if (ov) ov.classList.remove('open');
      window.scrollTo(0, 0);
    },

    saveTimers() { S.set('timers', State.timers); },
    saveNotebook() { S.set('notebook', State.notebook); },
    saveTasks() { S.set('tasks', State.tasks); },
    saveInventory() { S.set('inventory', State.inventory); },
    saveCustomRecipes() { S.set('customRecipes', State.customRecipes); },

    fmtTime(sec) {
      sec = Math.max(0, Math.round(sec));
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      return `${m}:${String(s).padStart(2,'0')}`;
    },

    addTimer(label, sec) {
      const t = { id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), label: label || 'Timer', totalSec: sec, endsAt: Date.now() + sec * 1000, state: 'running', fired: false, created: Date.now() };
      State.timers.unshift(t);
      this.saveTimers();
    },

    pauseTimer(id) {
      const t = State.timers.find(x => x.id === id);
      if (!t) return;
      if (t.state === 'running') { t.remaining = Math.max(0, t.endsAt - Date.now()); t.state = 'paused'; }
      else if (t.state === 'paused') { t.endsAt = Date.now() + (t.remaining || 0); t.state = 'running'; t.fired = false; }
      this.saveTimers();
    },

    stopTimer(id) {
      State.timers = State.timers.filter(x => x.id !== id);
      this.saveTimers();
    },

    toast(msg, type) {
      const cont = document.getElementById('toastContainer');
      if (!cont) return;
      const el = document.createElement('div');
      el.className = 'toast' + (type ? ' ' + type : '');
      el.textContent = msg;
      cont.appendChild(el);
      setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; el.style.transition = 'all 0.2s'; }, 2400);
      setTimeout(() => el.remove(), 2700);
    },

    beep() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = 880;
        o.type = 'sine';
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);
        o.connect(g).connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 1.0);
      } catch(e) {}
    },

    esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); },
    uid() { return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8); },
    nowISO() { return new Date().toISOString().slice(0, 16); },
  });

  /* ---------- Timer engine ---------- */
  function tickTimers() {
    const now = Date.now();
    let anyRunning = false, firstRunning = null;
    State.timers.forEach(t => {
      if (t.state === 'running') {
        anyRunning = true;
        if (!firstRunning) firstRunning = t;
        if (Math.max(0, t.endsAt - now) === 0 && !t.fired) {
          t.state = 'done'; t.fired = true;
          LC.beep();
          LC.toast(`${t.label} done!`, 'success');
          if (LC.State.settings.notifications && Notification && Notification.permission === 'granted') {
            try { new Notification('Lab Companion', { body: `${t.label} — done!` }); } catch(e) {}
          }
          LC.saveTimers();
        }
      }
    });
    const pill = document.getElementById('activeTimerPill');
    if (pill) {
      if (anyRunning && firstRunning) {
        pill.hidden = false;
        const remMs = Math.max(0, firstRunning.endsAt - now);
        pill.querySelector('#activeTimerLabel').textContent = `${firstRunning.label}  ${LC.fmtTime(remMs / 1000)}`;
      } else { pill.hidden = true; }
    }
  }

  /* ---------- Clock ---------- */
  function tickClock() {
    const now = new Date();
    const tc = document.getElementById('topbarClock'), td = document.getElementById('topbarDate');
    if (tc) tc.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    if (td) td.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    tickTimers();
  }

  /* ---------- Boot ---------- */
  function wireNav() {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); LC.navigate(el.dataset.view); });
    });
    document.getElementById('menuToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
      document.getElementById('sidebarOverlay').classList.toggle('open');
    });
    document.getElementById('sidebarOverlay').addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebarOverlay').classList.remove('open');
    });
    document.getElementById('themeToggle').addEventListener('click', () => {
      State.theme = State.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', State.theme);
      S.set('theme', State.theme);
      const sun = document.querySelector('.icon-sun'), moon = document.querySelector('.icon-moon');
      if (sun && moon) { sun.style.display = State.theme === 'light' ? 'block' : 'none'; moon.style.display = State.theme === 'light' ? 'none' : 'block'; }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    load();
    wireNav();
    tickClock();
    setInterval(tickClock, 1000);
    LC.navigate('dashboard');
    if (State.settings.notifications && Notification && Notification.permission === 'default') {
      try { Notification.requestPermission(); } catch(e) {}
    }
  });
})();
