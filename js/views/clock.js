(function () {
  'use strict';
  const defaultZones = [
    { name: 'Local', tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { name: 'Kolkata', tz: 'Asia/Kolkata' },
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' }
  ];
  let zones = JSON.parse(localStorage.getItem('lc.worldClock') || 'null') || defaultZones;
  function save() { localStorage.setItem('lc.worldClock', JSON.stringify(zones)); }

  LC.registerView('clock', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">🕐 World Clock</h1><p class="view-subtitle">Track collaborator hours, time-zone your experiments, schedule meetings.</p></div>
      <div class="grid grid-auto" id="zoneGrid"></div>
      <div class="card"><div class="card-title">Add a time zone</div><div class="input-group"><input class="input" id="nzn" placeholder="Label (e.g. PI, collaborator)" /><input class="input" id="nzt" placeholder="IANA tz (e.g. Europe/Berlin)" /><button class="btn btn-primary" id="az">+ Add</button></div><div class="card-sub">Examples: America/Los_Angeles, Europe/Paris, Asia/Singapore, Australia/Sydney</div></div>`;

    function render() {
      const host = root.querySelector('#zoneGrid');
      const now = new Date();
      host.innerHTML = zones.map((z, i) => {
        let time, date;
        try { time = now.toLocaleTimeString('en-US', { timeZone: z.tz, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }); date = now.toLocaleDateString('en-US', { timeZone: z.tz, weekday: 'short', month: 'short', day: 'numeric' }); } catch(e) { time = '—'; date = 'Unknown zone'; }
        return `<div class="card" style="padding:16px;"><div style="display:flex; justify-content:space-between; align-items:flex-start;"><div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">${LC.esc(z.name)}</div><div style="font-family:var(--mono); font-size:28px; font-weight:700; margin-top:4px;">${LC.esc(time)}</div><div style="font-size:12px; color:var(--text-soft); margin-top:2px;">${LC.esc(date)}</div></div>${i > 0 ? '<button class="btn btn-ghost btn-sm" data-rm="'+i+'">✕</button>' : ''}</div><div class="card-sub" style="margin-top:6px;">${LC.esc(z.tz)}</div></div>`;
      }).join('');
      host.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => { zones.splice(+b.dataset.rm, 1); save(); render(); }));
    }
    root.querySelector('#az').addEventListener('click', () => {
      const n = root.querySelector('#nzn').value.trim(), t = root.querySelector('#nzt').value.trim();
      if (!n || !t) { LC.toast('Both fields required', 'warn'); return; }
      try { new Intl.DateTimeFormat('en-US', { timeZone: t }); } catch(e) { LC.toast('Invalid time zone', 'danger'); return; }
      zones.push({ name: n, tz: t }); save(); render();
      root.querySelector('#nzn').value = ''; root.querySelector('#nzt').value = '';
    });
    render();
    setInterval(render, 1000);
    return root;
  });
})();
