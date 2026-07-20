(function () {
  'use strict';
  LC.registerView('drugs', function () {
    const root = document.createElement('div');
    let tab = 'drugs';
    root.innerHTML = `<div class="view-header"><h1 class="view-title">💊 Drugs & Inhibitors</h1><p class="view-subtitle">Common cancer biology compounds — targets, solvents, stock and working concentrations.</p></div>
      <div class="tabs"><button class="tab active" data-tab="drugs">Drugs / Inhibitors</button><button class="tab" data-tab="abx">Antibiotics (Selection)</button></div>
      <div class="search-bar"><span>🔍</span><input id="drSearch" placeholder="Search by name, target, pathway, or class..." /></div>
      <div id="drContent"></div>`;

    function render(q) {
      q = (q || '').toLowerCase();
      root.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
      const host = root.querySelector('#drContent');
      if (tab === 'drugs') {
        const list = LC_DATA.drugs.filter(d => !q || d.name.toLowerCase().includes(q) || d.target.toLowerCase().includes(q) || d.pathway.toLowerCase().includes(q) || d.class.toLowerCase().includes(q));
        host.innerHTML = `<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Drug</th><th>Class</th><th>Target</th><th>Pathway</th><th>Solvent</th><th>Working Conc</th><th>MW</th></tr></thead><tbody>${list.map(d => `<tr><td><strong>${d.name}</strong></td><td><span class="badge badge-accent">${d.class}</span></td><td>${d.target}</td><td>${d.pathway}</td><td class="mono">${d.solvent}</td><td class="mono">${d.workingConc}</td><td class="mono">${d.mw}</td></tr>`).join('')}</tbody></table></div></div>`;
      } else {
        const list = LC_DATA.antibiotics.filter(a => !q || a.name.toLowerCase().includes(q) || a.target.toLowerCase().includes(q) || a.resistance.toLowerCase().includes(q));
        host.innerHTML = `<div class="grid grid-auto">${list.map(a => `<div class="card" style="padding:16px;"><div class="card-title">${a.name}</div><div class="card-sub"><span class="badge badge-info">${a.class}</span></div><div class="table-wrap"><table class="table"><tr><td>Target</td><td>${a.target}</td></tr><tr><td>Resistance gene</td><td class="mono">${a.resistance}</td></tr><tr><td>Bacteria</td><td class="mono">${a.concBacteria}</td></tr><tr><td>Mammalian</td><td class="mono">${a.concMammalian}</td></tr><tr><td>Kill time</td><td>${a.killTime}</td></tr></table></div><div class="card-sub" style="margin-top:8px;">${a.notes}</div></div>`).join('')}</div>`;
      }
    }
    root.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { tab = t.dataset.tab; render(root.querySelector('#drSearch').value); }));
    root.querySelector('#drSearch').addEventListener('input', e => render(e.target.value));
    render('');
    return root;
  });
})();
