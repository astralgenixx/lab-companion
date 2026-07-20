(function () {
  'use strict';
  LC.registerView('tasks', function () {
    const root = document.createElement('div');
    let filter = 'open';
    root.innerHTML = `<div class="view-header"><h1 class="view-title">✅ Tasks</h1><p class="view-subtitle">Lab to-dos — experiments to run, reagents to order, samples to fix.</p></div>
      <div class="card"><div class="input-group"><input class="input" id="tIn" placeholder="Add a task..." /><select class="select" id="tP" style="max-width:120px;"><option value="med">Priority: Med</option><option value="high">Priority: High</option><option value="low">Priority: Low</option></select><input class="input" id="tD" type="date" style="max-width:160px;" /><button class="btn btn-primary" id="tAdd">+ Add</button></div></div>
      <div class="tabs"><button class="tab active" data-f="open">Open</button><button class="tab" data-f="done">Done</button><button class="tab" data-f="all">All</button></div>
      <div class="card"><div id="tList" class="list"></div></div>`;

    function render() {
      const list = LC.State.tasks.filter(t => filter==='all'?true:filter==='open'?!t.done:t.done);
      const host = root.querySelector('#tList');
      if (list.length === 0) { host.innerHTML = '<div class="list-empty">Nothing here.</div>'; return; }
      host.innerHTML = list.map(t => { const p=t.priority||'med'; return `<div class="list-item ${t.done?'done':''}"><input type="checkbox" ${t.done?'checked':''} data-tog="${t.id}" /><div class="grow"><div>${LC.esc(t.text)} <span class="badge badge-${p==='high'?'danger':'info'}">${p==='high'?'High':p==='low'?'Low':'Med'}</span></div><div class="card-sub">${t.due?'Due '+t.due:''} ${t.created?'· added '+t.created.slice(0,10):''}</div></div><button class="btn btn-sm" data-del="${t.id}">🗑</button></div>`; }).join('');
      host.querySelectorAll('[data-tog]').forEach(c => c.addEventListener('change', () => { const t = LC.State.tasks.find(x => x.id === c.dataset.tog); if (t) { t.done = c.checked; LC.saveTasks(); render(); } }));
      host.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => { LC.State.tasks = LC.State.tasks.filter(x => x.id !== b.dataset.del); LC.saveTasks(); render(); }));
    }
    root.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { filter = t.dataset.f; root.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === t)); render(); }));
    root.querySelector('#tAdd').addEventListener('click', () => { const text = root.querySelector('#tIn').value.trim(); if (!text) return; LC.State.tasks.unshift({ id: LC.uid(), text, priority: root.querySelector('#tP').value, due: root.querySelector('#tD').value, done: false, created: new Date().toISOString() }); LC.saveTasks(); root.querySelector('#tIn').value = ''; root.querySelector('#tD').value = ''; render(); });
    root.querySelector('#tIn').addEventListener('keydown', e => { if (e.key === 'Enter') root.querySelector('#tAdd').click(); });
    render(); return root;
  });
})();
