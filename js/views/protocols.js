(function () {
  'use strict';
  LC.registerView('protocols', function () {
    const root = document.createElement('div');
    let cat = 'all';
    root.innerHTML = `<div class="view-header"><h1 class="view-title">📋 Protocol Library</h1><p class="view-subtitle">Step-by-step protocols for common cancer biology techniques. Click any step to start its timer.</p></div>
      <div class="tabs"><button class="tab active" data-cat="all">All</button><button class="tab" data-cat="Protein">Protein</button><button class="tab" data-cat="RNA/DNA">RNA / DNA</button><button class="tab" data-cat="Cell">Cell Assays</button></div>
      <div class="search-bar"><span>🔍</span><input id="pSearch" placeholder="Search protocols..." /></div><div id="pList"></div>`;

    function render(q) {
      q = (q || '').toLowerCase();
      root.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat));
      const list = LC_DATA.protocols.filter(p => (cat === 'all' || p.cat === cat) && (!q || p.title.toLowerCase().includes(q) || p.notes.toLowerCase().includes(q)));
      const host = root.querySelector('#pList');
      host.innerHTML = list.map(p => `<div class="card" style="margin-bottom:16px;"><div class="card-title">${p.title} <span class="badge badge-accent">${p.cat}</span></div><div class="card-sub">💡 ${p.notes}</div><div class="list">${p.steps.map((s, i) => `<div class="list-item"><div class="grow"><div style="font-weight:600;">${i+1}.</div> ${s}</div><button class="btn btn-sm btn-primary" data-start="${p.title}||${s}||${i}">⏱</button></div>`).join('')}</div></div>`).join('');
      host.querySelectorAll('[data-start]').forEach(b => { const [title, s, i] = b.dataset.start.split('||'); b.addEventListener('click', () => { const sec = 60 * 60; LC.addTimer(`${title} — step ${+i+1}`, sec); LC.toast(`Timer for: ${s.slice(0,60)}…`, 'success'); LC.navigate('timers'); }); });
    }
    root.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { cat = t.dataset.cat; render(root.querySelector('#pSearch').value); }));
    root.querySelector('#pSearch').addEventListener('input', e => render(e.target.value));
    render('');
    return root;
  });
})();
