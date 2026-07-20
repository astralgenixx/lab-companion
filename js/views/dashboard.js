(function () {
  'use strict';
  LC.registerView('dashboard', function () {
    const root = document.createElement('div');
    const now = new Date();
    const hour = now.getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const openTasks = LC.State.tasks.filter(t => !t.done).length;
    const runningTimers = LC.State.timers.filter(t => t.state === 'running').length;
    const notebookEntries = LC.State.notebook.length;
    const invCount = LC.State.inventory.length;
    root.innerHTML = `<div class="view-header"><h1 class="view-title">${greet} 👋</h1><p class="view-subtitle">Here's your lab at a glance — ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
      <div class="dash-grid">
        <div class="dash-stat"><div class="dash-stat-icon" style="background:var(--accent-soft); color:var(--accent)">⏱️</div><div><div class="dash-stat-value">${runningTimers}</div><div class="dash-stat-label">Active timers</div></div></div>
        <div class="dash-stat"><div class="dash-stat-icon" style="background:var(--info-soft); color:var(--info)">✅</div><div><div class="dash-stat-value">${openTasks}</div><div class="dash-stat-label">Open tasks</div></div></div>
        <div class="dash-stat"><div class="dash-stat-icon" style="background:var(--success-soft); color:var(--success)">📓</div><div><div class="dash-stat-value">${notebookEntries}</div><div class="dash-stat-label">Notebook entries</div></div></div>
        <div class="dash-stat"><div class="dash-stat-icon" style="background:var(--warn-soft); color:var(--warn)">📦</div><div><div class="dash-stat-value">${invCount}</div><div class="dash-stat-label">Inventory items</div></div></div>
      </div>
      <div class="card"><div class="card-title">Quick actions</div><div class="quick-grid">
        ${['timers|⏱️|Start a timer','western|🧫|Western blot','gel|⚡|Gel calculator','calc-cellcount|🔢|Cell count','calc-dilution|💧|Dilution','calc-centrifuge|🌀|rpm → g','recipes|📖|Buffer recipes','cellculture|🦠|Cell culture','celllines|🗂️|Cell line DB','icc|🎨|ICC / IHC','pcr|🧬|PCR setup','notebook|📓|Notebook'].map(x => { const [v,i,l] = x.split('|'); return `<div class="quick-tile" data-go="${v}"><div class="quick-tile-icon">${i}</div><div class="quick-tile-label">${l}</div></div>`; }).join('')}
      </div></div>
      <div class="grid grid-2">
        <div class="card"><div class="card-title">Quick start timer</div><p class="card-sub">Common lab durations — click to start.</p><div class="tag-row" id="dashPresets"></div></div>
        <div class="card"><div class="card-title">Quick C₁V₁ = C₂V₂</div><div class="field"><label class="label">Stock conc (C₁)</label><div class="input-with-suffix"><input class="input" id="dqC1" type="number" value="100" /><span class="suffix">mM</span></div></div><div class="field"><label class="label">Final conc (C₂)</label><div class="input-with-suffix"><input class="input" id="dqC2" type="number" value="10" /><span class="suffix">mM</span></div></div><div class="field"><label class="label">Final volume (V₂)</label><div class="input-with-suffix"><input class="input" id="dqV2" type="number" value="10" /><span class="suffix">mL</span></div></div><div class="result highlight" id="dqResult">—</div></div>
      </div>`;
    root.querySelectorAll('.quick-tile').forEach(t => t.addEventListener('click', () => LC.navigate(t.dataset.go)));
    const presetHost = root.querySelector('#dashPresets');
    LC_DATA.timerPresets.forEach(p => { const c = document.createElement('button'); c.className = 'preset-chip'; c.textContent = '⏱ ' + p.label; c.addEventListener('click', () => { LC.addTimer(p.label, p.sec); LC.toast(`Started ${p.label} timer`, 'success'); LC.navigate('timers'); }); presetHost.appendChild(c); });
    const c1 = root.querySelector('#dqC1'), c2 = root.querySelector('#dqC2'), v2 = root.querySelector('#dqV2'), res = root.querySelector('#dqResult');
    function compute() { const a = +c1.value, b = +c2.value, c = +v2.value; if (!a || !b || !c) { res.textContent = 'Enter values'; return; } const v1 = (b * c) / a; res.innerHTML = `Add <strong>${v1.toFixed(3)} mL</strong> of stock, top up to ${c} mL.`; }
    [c1, c2, v2].forEach(el => el.addEventListener('input', compute));
    compute();
    return root;
  });
})();
