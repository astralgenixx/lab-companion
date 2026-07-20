(function () {
  'use strict';
  LC.registerView('recipes', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">📖 Buffer Recipes</h1><p class="view-subtitle">Common buffers and solutions for molecular biology and biochemistry.</p></div>
      <div class="search-bar"><span>🔍</span><input id="rSearch" placeholder="Search by name or ingredient..." /></div>`;
    function render(q) {
      q = (q || '').toLowerCase();
      const list = LC_DATA.bufferRecipes.filter(r => !q || r.name.toLowerCase().includes(q) || r.ingredients.some(i => i.i.toLowerCase().includes(q)));
      root.querySelectorAll('.card-custom').forEach(c => c.remove());
      list.forEach(r => {
        const card = document.createElement('div');
        card.className = 'card card-custom';
        card.style.marginTop = '16px';
        card.innerHTML = `<div class="card-title">${LC.esc(r.name)} · <span style="color:var(--accent);">${LC.esc(r.volume)}</span>${r.ph ? ' · pH ' + r.ph : ''}</div>${r.notes ? '<div class="card-sub">💡 ' + LC.esc(r.notes) + '</div>' : ''}<div class="table-wrap"><table class="table"><thead><tr><th>Ingredient</th><th>Amount</th><th>Unit</th></tr></thead><tbody>${r.ingredients.map(i => `<tr><td>${i.i}</td><td class="mono">${i.a}</td><td>${i.u}</td></tr>`).join('')}</tbody></table></div>`;
        root.appendChild(card);
      });
    }
    root.querySelector('#rSearch').addEventListener('input', e => render(e.target.value));
    render('');
    return root;
  });
})();
