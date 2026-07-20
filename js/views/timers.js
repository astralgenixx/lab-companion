(function () {
  'use strict';
  function renderTimerCard(t) {
    const now = Date.now();
    const remMs = t.state === 'running' ? Math.max(0, t.endsAt - now) : t.state === 'paused' ? t.remaining || 0 : 0;
    const remSec = remMs / 1000;
    const isDone = t.state === 'done', isRunning = t.state === 'running';
    return `<div class="timer-card ${isRunning ? 'running' : ''} ${isDone ? 'done' : ''}"><div style="flex:1"><div class="timer-label">${LC.esc(t.label)}</div><div class="timer-display">${LC.fmtTime(remSec)}</div><div class="timer-sub">${isDone ? '✓ Done' : isRunning ? 'Running' : t.state === 'paused' ? 'Paused' : '—'} · Total ${LC.fmtTime(t.totalSec)}</div></div><div class="timer-actions">${!isDone ? `<button class="btn ${isRunning ? 'btn-warn' : 'btn-primary'}" data-act="${isRunning ? 'pause' : 'resume'}" data-id="${t.id}">${isRunning ? '⏸' : '▶'}</button>` : ''}<button class="btn btn-sm" data-act="add1" data-id="${t.id}">+1 min</button><button class="btn btn-ghost btn-sm" data-act="del" data-id="${t.id}">🗑</button></div></div>`;
  }

  // Timers view
  LC.registerView('timers', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">⏱️ Timers</h1><p class="view-subtitle">Run multiple lab timers in parallel — perfect for incubations, washes, and digestions.</p></div>
      <div class="card"><div class="card-title">Add a timer</div><div class="grid grid-3"><div class="field"><label class="label">Label</label><input class="input" id="tLabel" placeholder="e.g. PBST wash" /></div><div class="field"><label class="label">Hours</label><input class="input" id="tH" type="number" min="0" value="0" /></div><div class="field"><label class="label">Minutes</label><input class="input" id="tM" type="number" min="0" value="10" /></div></div><div class="tag-row" id="tPresets"></div><div style="margin-top:12px; display:flex; gap:8px;"><button class="btn btn-primary" id="tStart">▶ Start timer</button><button class="btn" id="tReset">Reset form</button></div></div>
      <div class="card"><div class="card-title">Active timers</div><div id="tList" class="timer-grid"></div></div>`;

    const presetHost = root.querySelector('#tPresets');
    LC_DATA.timerPresets.forEach(p => { const c = document.createElement('button'); c.className = 'preset-chip'; c.textContent = '⏱ ' + p.label; c.addEventListener('click', () => { root.querySelector('#tLabel').value = p.label; root.querySelector('#tH').value = Math.floor(p.sec / 3600); root.querySelector('#tM').value = Math.floor((p.sec % 3600) / 60); }); presetHost.appendChild(c); });

    root.querySelector('#tStart').addEventListener('click', () => {
      const label = root.querySelector('#tLabel').value.trim() || 'Timer';
      const h = +root.querySelector('#tH').value || 0;
      const m = +root.querySelector('#tM').value || 0;
      const sec = h * 3600 + m * 60;
      if (sec <= 0) { LC.toast('Set a duration', 'warn'); return; }
      LC.addTimer(label, sec);
      LC.toast(`Started ${label} (${h}h ${m}m)`, 'success');
      render();
    });
    root.querySelector('#tReset').addEventListener('click', () => { root.querySelector('#tLabel').value = ''; root.querySelector('#tH').value = 0; root.querySelector('#tM').value = 10; });

    function render() {
      const host = root.querySelector('#tList');
      if (LC.State.timers.length === 0) { host.innerHTML = '<div class="list-empty">No timers yet — add one above or pick a preset.</div>'; return; }
      host.innerHTML = LC.State.timers.map(renderTimerCard).join('');
      host.querySelectorAll('[data-act]').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.dataset.id, act = b.dataset.act;
          if (act === 'del') { LC.stopTimer(id); LC.toast('Timer removed'); render(); }
          else if (act === 'pause' || act === 'resume') { LC.pauseTimer(id); render(); }
          else if (act === 'add1') { const t = LC.State.timers.find(x => x.id === id); if (t) { if (t.state === 'running') t.endsAt += 60000; else t.remaining = (t.remaining || 0) + 60000; t.totalSec += 60; LC.saveTimers(); render(); } }
        });
      });
    }
    render();
    setInterval(render, 1000);
    return root;
  });

  // Stopwatch view
  const sw = { running: false, startedAt: 0, elapsed: 0, laps: [] };

  LC.registerView('stopwatch', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">⏲️ Stopwatch</h1><p class="view-subtitle">Precise timing with laps.</p></div>
      <div class="card"><div class="stopwatch-display" id="swDisplay">00:00:00<span class="stopwatch-ms">.00</span></div><div style="display:flex; gap:8px; justify-content:center;"><button class="btn btn-primary btn-lg" id="swStart">▶ Start</button><button class="btn btn-warn btn-lg" id="swLap">🏁 Lap</button><button class="btn btn-danger btn-lg" id="swStop">⏸ Stop</button><button class="btn btn-lg" id="swReset">↺ Reset</button></div></div>
      <div class="card"><div class="card-title">Laps</div><div class="lap-list" id="swLaps"></div></div>`;

    function refreshDisplay() {
      const el = root.querySelector('#swDisplay');
      if (!el) return;
      const total = sw.elapsed + (sw.running ? Date.now() - sw.startedAt : 0);
      el.innerHTML = LC.fmtTime(Math.floor(total/1000)) + '<span class="stopwatch-ms">.' + String(Math.floor((total%1000)/10)).padStart(2,'0') + '</span>';
    }
    function refreshLaps() {
      const host = root.querySelector('#swLaps');
      if (sw.laps.length === 0) { host.innerHTML = '<div class="list-empty">No laps yet.</div>'; return; }
      host.innerHTML = sw.laps.slice().reverse().map((l, i) => `<div class="lap-row"><span>#${sw.laps.length - i} — ${LC.esc(l.label)}</span><span>${l.time}</span></div>`).join('');
    }
    root.querySelector('#swStart').addEventListener('click', () => { if (!sw.running) { sw.running = true; sw.startedAt = Date.now(); } });
    root.querySelector('#swStop').addEventListener('click', () => { if (sw.running) { sw.elapsed += Date.now() - sw.startedAt; sw.running = false; } });
    root.querySelector('#swReset').addEventListener('click', () => { sw.running = false; sw.elapsed = 0; sw.laps = []; refreshDisplay(); refreshLaps(); });
    root.querySelector('#swLap').addEventListener('click', () => { const total = sw.elapsed + (sw.running ? Date.now() - sw.startedAt : 0); sw.laps.push({ label: 'Lap ' + (sw.laps.length + 1), time: LC.fmtTime(Math.floor(total/1000)) + '.' + String(Math.floor((total%1000)/10)).padStart(2,'0') }); refreshLaps(); });
    refreshLaps();
    setInterval(refreshDisplay, 60);
    return root;
  });
})();
