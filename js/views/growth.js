(function () {
  'use strict';
  LC.registerView('growth', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">📊 Growth Curves</h1><p class="view-subtitle">Plot cell proliferation, viability dose-response, or colony counts over time with Chart.js.</p></div>
      <div class="card"><div class="card-sub">Enter time points and values. Add multiple conditions/groups to compare.<br><em>All data stays on your device. Chart updates live.</em></div>
        <div class="grid grid-2"><div>
          <div class="card-title">Data input</div>
          <div class="field"><label class="label">X-axis label (e.g. Time)</label><input class="input" id="gxLabel" value="Time (hours)" /></div>
          <div class="field"><label class="label">Y-axis label (e.g. Cell count, % Viability, OD)</label><input class="input" id="gyLabel" value="Cell count (×10⁴)" /></div>
          <div class="field"><label class="label">Chart type</label><select class="select" id="gType"><option value="line">Line</option><option value="bar">Bar</option><option value="scatter">Scatter</option></select></div>
          <div class="card-title" style="margin-top:12px;">Groups / Series</div>
          <div id="gGroups"></div>
          <button class="btn btn-primary" id="gAddGroup" style="margin-top:8px;">+ Add group</button>
        </div><div><canvas id="gChart" style="max-height:400px;"></canvas></div></div></div>
      <div class="card"><div class="card-title">Quick templates</div><div class="quick-grid">
        <div class="quick-tile" data-tpl="prolif"><div class="quick-tile-icon">📈</div><div class="quick-tile-label">Proliferation (72 h)</div></div>
        <div class="quick-tile" data-tpl="dose"><div class="quick-tile-icon">📉</div><div class="quick-tile-label">Dose-response</div></div>
        <div class="quick-tile" data-tpl="colony"><div class="quick-tile-icon">🔵</div><div class="quick-tile-label">Colony count</div></div>
      </div></div>`;

    let chart = null;
    let groups = [{ name: 'Control', color: '#0d9488', points: [{ x: '0', y: '1' }, { x: '24', y: '2' }, { x: '48', y: '4' }, { x: '72', y: '7' }] }];

    function renderGroups() {
      const host = root.querySelector('#gGroups');
      host.innerHTML = groups.map((g, gi) => `<div class="card" style="padding:14px; margin-bottom:8px;"><div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;"><input class="input" value="${g.name}" style="flex:1;" data-gn="${gi}" placeholder="Group name" /><input class="input" type="color" value="${g.color || '#0d9488'}" style="width:44px; padding:2px;" data-gc="${gi}" /><button class="btn btn-sm" data-gdel="${gi}">🗑</button></div><div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:6px;" data-gp="${gi}">${g.points.map((p, pi) => `<div style="display:flex; gap:4px; align-items:center;"><input class="input" value="${p.x}" style="width:80px;" data-gx="${gi}|${pi}" placeholder="X" /><input class="input" value="${p.y}" style="width:80px;" data-gy="${gi}|${pi}" placeholder="Y" /><button class="btn btn-ghost btn-sm" data-ptdel="${gi}|${pi}">✕</button></div>`).join('')}<button class="btn btn-sm" data-ptadd="${gi}">+ Point</button></div></div>`).join('');
      wireGroupInputs();
    }
    function wireGroupInputs() {
      root.querySelectorAll('[data-gn]').forEach(el => el.addEventListener('input', () => { groups[el.dataset.gn].name = el.value; updateChart(); }));
      root.querySelectorAll('[data-gc]').forEach(el => el.addEventListener('input', () => { groups[el.dataset.gc].color = el.value; updateChart(); }));
      root.querySelectorAll('[data-gx]').forEach(el => el.addEventListener('input', () => { const [gi, pi] = el.dataset.gx.split('|'); groups[gi].points[pi].x = el.value; updateChart(); }));
      root.querySelectorAll('[data-gy]').forEach(el => el.addEventListener('input', () => { const [gi, pi] = el.dataset.gy.split('|'); groups[gi].points[pi].y = el.value; updateChart(); }));
      root.querySelectorAll('[data-gdel]').forEach(b => b.addEventListener('click', () => { groups.splice(+b.dataset.gdel, 1); if (groups.length === 0) groups.push({ name: 'Group 1', color: '#0d9488', points: [{ x: '0', y: '0' }] }); renderGroups(); updateChart(); }));
      root.querySelectorAll('[data-ptdel]').forEach(b => { const [gi, pi] = b.dataset.ptdel.split('|'); b.addEventListener('click', () => { groups[gi].points.splice(+pi, 1); renderGroups(); updateChart(); }); });
      root.querySelectorAll('[data-ptadd]').forEach(b => b.addEventListener('click', () => { groups[+b.dataset.ptadd].points.push({ x: '', y: '' }); renderGroups(); updateChart(); }));
    }
    root.querySelector('#gAddGroup').addEventListener('click', () => { const colors = ['#0d9488','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316']; groups.push({ name: `Group ${groups.length+1}`, color: colors[groups.length % colors.length], points: [{ x: '0', y: '1' }, { x: '24', y: '2' }, { x: '48', y: '4' }, { x: '72', y: '7' }] }); renderGroups(); updateChart(); });

    function updateChart() {
      const ctx = document.getElementById('gChart');
      if (!ctx || !window.Chart) return;
      const type = root.querySelector('#gType').value;
      if (chart) chart.destroy();
      chart = new Chart(ctx, { type, data: { datasets: groups.filter(g => g.points.some(p => p.x !== '' && p.y !== '')).map((g, i) => ({ label: g.name || `Group ${i+1}`, data: g.points.filter(p => p.x !== '' && p.y !== '').map(p => ({ x: parseFloat(p.x) || 0, y: parseFloat(p.y) || 0 })), borderColor: g.color, backgroundColor: g.color + '33', borderWidth: 2, tension: 0.3, pointRadius: 5, pointBackgroundColor: g.color, fill: type === 'line' })) }, options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() } }, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: (${ctx.parsed.x}, ${ctx.parsed.y})` } } }, scales: { x: { type: 'linear', title: { display: true, text: root.querySelector('#gxLabel').value, color: getComputedStyle(document.documentElement).getPropertyValue('--text-soft').trim() }, grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--border').trim() }, ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-soft').trim() } }, y: { title: { display: true, text: root.querySelector('#gyLabel').value, color: getComputedStyle(document.documentElement).getPropertyValue('--text-soft').trim() }, grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--border').trim() }, ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-soft').trim() }, beginAtZero: type !== 'scatter' } } } });
    }

    root.querySelector('#gType').addEventListener('change', updateChart);
    ['gxLabel', 'gyLabel'].forEach(id => root.querySelector('#' + id).addEventListener('input', updateChart));

    // Templates
    root.querySelectorAll('[data-tpl]').forEach(tile => tile.addEventListener('click', () => {
      if (tile.dataset.tpl === 'prolif') { groups = [{ name: 'Control', color: '#0d9488', points: [{x:'0',y:'1'},{x:'24',y:'2.5'},{x:'48',y:'5.2'},{x:'72',y:'10'}] }, { name: 'Drug A', color: '#ef4444', points: [{x:'0',y:'1'},{x:'24',y:'1.5'},{x:'48',y:'1.8'},{x:'72',y:'2.1'}] }]; root.querySelector('#gxLabel').value = 'Time (hours)'; root.querySelector('#gyLabel').value = 'Cell count (×10⁴)'; root.querySelector('#gType').value = 'line'; }
      if (tile.dataset.tpl === 'dose') { groups = [{ name: '24 h', color: '#0d9488', points: [{x:'0',y:'100'},{x:'0.01',y:'98'},{x:'0.1',y:'85'},{x:'1',y:'45'},{x:'10',y:'12'}] }, { name: '48 h', color: '#ef4444', points: [{x:'0',y:'100'},{x:'0.01',y:'95'},{x:'0.1',y:'70'},{x:'1',y:'30'},{x:'10',y:'5'}] }]; root.querySelector('#gxLabel').value = 'Drug concentration (µM)'; root.querySelector('#gyLabel').value = 'Viability (%)'; root.querySelector('#gType').value = 'line'; }
      if (tile.dataset.tpl === 'colony') { groups = [{ name: 'shScr', color: '#0d9488', points: [{x:'1','y':120},{x:'2','y':110},{x:'3','y':'98'}] }, { name: 'shGene X', color: '#ef4444', points: [{x:'1','y':45},{x:'2','y':38},{x:'3','y':'42'}] }]; root.querySelector('#gxLabel').value = 'Replicate'; root.querySelector('#gyLabel').value = 'Colony count'; root.querySelector('#gType').value = 'bar'; }
      renderGroups(); updateChart();
    }));

    renderGroups();
    setTimeout(updateChart, 200);
    return root;
  });
})();
