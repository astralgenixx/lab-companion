(function () {
  'use strict';
  LC.registerView('icc', function () {
    const root = document.createElement('div');
    let tab = 'icc';
    root.innerHTML = `<div class="view-header"><h1 class="view-title">🎨 Immunocytochemistry / IHC</h1><p class="view-subtitle">Antibody dilutions, protocol timer, fixation guides.</p></div>
      <div class="tabs"><button class="tab active" data-tab="icc">ICC</button><button class="tab" data-tab="ihc">IHC (FFPE)</button><button class="tab" data-tab="ab">Antibody</button><button class="tab" data-tab="timer">Protocol timer</button></div><div id="ic"></div>`;

    function render() {
      root.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
      const h = root.querySelector('#ic');
      if (tab === 'icc') {
        const steps = [{n:'Seed cells on coverslip',m:0},{n:'Fix: 4% PFA, 15 min RT (or 10 min cold MeOH for membrane)',m:15},{n:'Wash 3× PBS, 5 min each',m:15},{n:'Permeabilize: 0.1% Triton X-100 in PBS, 10 min RT',m:10},{n:'Wash 3× PBS, 5 min each',m:15},{n:'Block: 1% BSA + 0.1% Tween-20 in PBS, 1 h RT',m:60},{n:'Primary antibody in block, 4°C O/N',m:720},{n:'Wash 3× PBST, 5 min each',m:15},{n:'Secondary (Alexa Fluor) in block, 1 h RT, dark',m:60},{n:'Wash 3× PBST, 5 min each, dark',m:15},{n:'DAPI 1 µg/mL in PBS, 5 min RT, dark',m:5},{n:'Wash 2× PBS, mount with anti-fade',m:5}];
        h.innerHTML = `<div class="card"><div class="card-sub">Standard ICC on glass coverslips or chamber slides.</div><div class="list">${steps.map((s,i)=>`<div class="list-item"><div class="grow"><div style="font-weight:600;">${i+1}. ${s.n}</div><div class="card-sub">${s.m===0?'No time':s.m+' min'}</div></div>${s.m>0?'<button class="btn btn-sm btn-primary" data-s="'+i+'">⏱ Start</button>':''}</div>`).join('')}</div></div>`;
        h.querySelectorAll('[data-s]').forEach(b=>b.addEventListener('click',()=>{const s=steps[+b.dataset.s];LC.addTimer(s.n,s.m*60);LC.toast(`Started: ${s.n}`,'success');LC.navigate('timers');}));
      } else if (tab === 'ihc') {
        const steps = [{n:'Deparaffinize: xylene 3× 5 min',m:15},{n:'Rehydrate: 100%→95%→70% EtOH→dH₂O',m:15},{n:'Antigen retrieval: citrate pH 6.0, 95-100°C, 20 min',m:20},{n:'Cool RT, wash 3× PBS',m:20},{n:'Quench peroxidase: 3% H₂O₂/MeOH, 10 min',m:10},{n:'Wash 3× PBS, 5 min each',m:15},{n:'Block: 5% normal serum, 1 h RT',m:60},{n:'Primary antibody in block, 4°C O/N',m:720},{n:'Wash 3× PBST, 5 min each',m:15},{n:'Secondary (HRP-polymer), 30 min RT',m:30},{n:'Wash 3× PBST, 5 min each',m:15},{n:'DAB (1-10 min), hematoxylin, dehydrate, mount',m:10}];
        h.innerHTML = `<div class="card"><div class="card-sub">IHC on FFPE tissue sections.</div><div class="list">${steps.map((s,i)=>`<div class="list-item"><div class="grow"><div style="font-weight:600;">${i+1}. ${s.n}</div><div class="card-sub">${s.m===0?'No time':s.m+' min'}</div></div>${s.m>0?'<button class="btn btn-sm btn-primary" data-s="'+i+'">⏱ Start</button>':''}</div>`).join('')}</div></div>`;
        h.querySelectorAll('[data-s]').forEach(b=>b.addEventListener('click',()=>{const s=steps[+b.dataset.s];LC.addTimer(s.n,s.m*60);LC.toast(`Started: ${s.n}`,'success');LC.navigate('timers');}));
      } else if (tab === 'ab') {
        h.innerHTML = `<div class="card"><div class="card-sub">Typical ICC/IHC antibody working dilutions.</div>${Object.entries(LC_DATA.antibodyDilutions).map(([k,v])=>`<div class="card-title" style="margin-top:12px;">${k}</div><div class="table-wrap"><table class="table"><thead><tr><th>Reagent</th><th>Recommended dilution</th></tr></thead><tbody>${Object.entries(v).map(([r,d])=>`<tr><td>${r}</td><td class="mono">${d}</td></tr>`).join('')}</tbody></table></div>`).join('')}<div class="card-title" style="margin-top:16px;">Custom dilution</div><div class="grid grid-2"><div class="field"><label class="label">Stock concentration</label><div class="input-with-suffix"><input class="input" id="iabS" type="number" value="0.2" step="0.01" /><span class="suffix">mg/mL</span></div></div><div class="field"><label class="label">Working concentration</label><div class="input-with-suffix"><input class="input" id="iabW" type="number" value="2" step="0.1" /><span class="suffix">µg/mL</span></div></div><div class="field"><label class="label">Final volume</label><div class="input-with-suffix"><input class="input" id="iabV" type="number" value="200" /><span class="suffix">µL</span></div></div></div><div class="result highlight" id="iabRes">—</div></div>`;
        const $=id=>root.querySelector('#'+id);const calc=()=>{const s=+$('iabS').value,w=+$('iabW').value,v=+$('iabV').value;if(!s||!w||!v)return;const dil=s*1000/w;const vol=v/dil;$('iabRes').innerHTML=`Dilution <strong>1:${Math.round(dil)}</strong> → add <strong>${vol.toFixed(2)} µL</strong> Ab + diluent to ${v} µL.`;};['iabS','iabW','iabV'].forEach(id=>$(id).addEventListener('input',calc));calc();
      } else {
        const proto = [{n:'Fixation (4% PFA)',m:15},{n:'Wash (3× PBS)',m:15},{n:'Permeabilization (0.1% Triton)',m:10},{n:'Wash (3× PBS)',m:15},{n:'Block (1% BSA)',m:60},{n:'Primary Ab O/N',m:720}];
        h.innerHTML = `<div class="card"><div class="card-sub">Multi-step ICC timer.</div><div class="input-group"><input class="input" id="ipn" placeholder="Experiment name" /><button class="btn btn-primary" id="ipStart">▶ Start</button></div><div class="list" id="ipList" style="margin-top:12px;">${proto.map((s,i)=>`<div class="list-item"><div class="grow"><div style="font-weight:600;">${i+1}. ${s.n}</div><div class="card-sub">${s.m} min</div></div><button class="btn btn-sm btn-primary" data-s="${i}">⏱ Start</button></div>`).join('')}</div></div>`;
        h.querySelectorAll('[data-s]').forEach(b=>b.addEventListener('click',()=>{const s=proto[+b.dataset.s];LC.addTimer(s.n,s.m*60);LC.toast(`Started: ${s.n}`,'success');LC.navigate('timers');}));
        h.querySelector('#ipStart').addEventListener('click',()=>{const name=h.querySelector('#ipn').value||'ICC';LC.addTimer(`${name} - Fixation`,15*60);LC.toast('First step started','success');LC.navigate('timers');});
      }
    }
    root.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { tab = t.dataset.tab; render(); }));
    render(); return root;
  });
})();
