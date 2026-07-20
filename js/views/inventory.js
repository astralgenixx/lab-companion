(function () {
  'use strict';
  LC.registerView('inventory', function () {
    const root = document.createElement('div');
    let cat = 'all', search = '';
    root.innerHTML = `<div class="view-header"><h1 class="view-title">📦 Inventory</h1><p class="view-subtitle">Track antibodies, reagents, chemicals, cell stocks, kits.</p></div>
      <div class="search-bar"><span>🔍</span><input id="iSearch" placeholder="Search items..." /></div>
      <div class="tabs" id="iCats"><button class="tab active" data-cat="all">All</button><button class="tab" data-cat="ab">Antibodies</button><button class="tab" data-cat="reagent">Reagents</button><button class="tab" data-cat="chemical">Chemicals</button><button class="tab" data-cat="kit">Kits</button><button class="tab" data-cat="cell">Cell stocks</button></div>
      <div class="card"><div class="card-title">+ Add item</div><div class="input-group"><input class="input" id="iName" placeholder="Name (e.g. anti-p53 antibody)" /><select class="select" id="iCat" style="max-width:140px;"><option value="ab">Antibody</option><option value="reagent">Reagent</option><option value="chemical">Chemical</option><option value="kit">Kit</option><option value="cell">Cell stock</option></select></div><div class="input-group" style="margin-top:6px;"><input class="input" id="iBrand" placeholder="Brand / catalog #" /><input class="input" id="iLot" placeholder="Lot #" /><input class="input" id="iLoc" placeholder="Location (e.g. -20°C box A)" /></div><div class="input-group" style="margin-top:6px;"><input class="input" id="iQty" type="number" placeholder="Quantity" /><input class="input" id="iExp" type="date" placeholder="Expiry" /><button class="btn btn-primary" id="iAdd">+ Add</button></div></div>
      <div class="card"><div class="card-title">Items</div><div id="iList" class="list"></div></div>`;

    function filter() { const q = search.toLowerCase(); return LC.State.inventory.filter(i => (cat==='all'||i.cat===cat) && (!q||i.name.toLowerCase().includes(q)||(i.brand||'').toLowerCase().includes(q))); }
    function render() {
      const lst = filter(), host = root.querySelector('#iList');
      if (lst.length === 0) { host.innerHTML = '<div class="list-empty">No items match.</div>'; return; }
      const today = new Date();
      host.innerHTML = lst.map(i => `<div class="list-item"><div class="grow"><div style="font-weight:600;">${LC.esc(i.name)} <span class="badge badge-info">${i.cat}</span>${i.exp && (new Date(i.exp)-today)/(1000*60*60*24) < 30 ? ' <span class="badge badge-warn">expiring</span>' : ''}</div><div class="card-sub">${LC.esc(i.brand||'')} ${i.lot?'· Lot '+LC.esc(i.lot):''} ${i.qty?'· Qty '+i.qty:''} ${i.exp?'· Exp '+i.exp:''} ${i.loc?'· '+LC.esc(i.loc):''}</div></div><button class="btn btn-ghost" data-del="${i.id}">🗑</button></div>`).join('');
      host.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => { LC.State.inventory = LC.State.inventory.filter(x => x.id !== b.dataset.del); LC.saveInventory(); render(); }));
    }
    root.querySelectorAll('#iCats .tab').forEach(t => t.addEventListener('click', () => { cat = t.dataset.cat; root.querySelectorAll('#iCats .tab').forEach(x => x.classList.toggle('active', x === t)); render(); }));
    root.querySelector('#iSearch').addEventListener('input', e => { search = e.target.value; render(); });
    root.querySelector('#iAdd').addEventListener('click', () => {
      const e = { id: LC.uid(), name: root.querySelector('#iName').value.trim(), cat: root.querySelector('#iCat').value, brand: root.querySelector('#iBrand').value.trim(), lot: root.querySelector('#iLot').value.trim(), loc: root.querySelector('#iLoc').value.trim(), qty: root.querySelector('#iQty').value, exp: root.querySelector('#iExp').value, added: new Date().toISOString() };
      if (!e.name) { LC.toast('Name required', 'warn'); return; }
      LC.State.inventory.unshift(e); LC.saveInventory(); ['iName','iBrand','iLot','iLoc','iQty','iExp'].forEach(id => root.querySelector('#'+id).value = ''); LC.toast('Item added', 'success'); render();
    });
    render(); return root;
  });
})();
