(function () {
  'use strict';
  LC.registerView('celllines', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">🗂️ Cell Line Database</h1><p class="view-subtitle">Common cancer cell lines with media, doubling time, biosafety, and notes.</p></div>
      <div class="search-bar"><span>🔍</span><input id="clSearch" placeholder="Search by name, tissue, or origin..." /></div>
      <div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Name</th><th>Tissue</th><th>Origin</th><th>Media</th><th>Doubling</th><th>Type</th><th>BSL</th></tr></thead><tbody id="clBody"></tbody></table></div></div>`;

    function render(q) {
      q = (q || '').toLowerCase();
      const list = LC_DATA.cellLines.filter(c => !q || c.name.toLowerCase().includes(q) || c.tissue.toLowerCase().includes(q) || c.origin.toLowerCase().includes(q));
      root.querySelector('#clBody').innerHTML = list.map(c => `<tr><td><strong>${c.name}</strong><div class="card-sub" style="margin:0;">${c.supplements}</div></td><td>${c.tissue}</td><td>${c.origin}</td><td>${c.media}</td><td class="mono">${c.doubling} h</td><td><span class="badge ${c.adherence==='Suspension'?'badge-info':'badge-accent'}">${c.adherence}</span></td><td><span class="badge ${c.biosafety==='BSL-2'?'badge-warn':'badge-success'}">${c.biosafety}</span></td></tr>`).join('');
    }
    root.querySelector('#clSearch').addEventListener('input', e => render(e.target.value));
    render('');
    return root;
  });
})();
