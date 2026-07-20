(function () {
  'use strict';
  LC.registerView('pcr', function () {
    const root = document.createElement('div');
    let tab = 'mix';
    root.innerHTML = `<div class="view-header"><h1 class="view-title">🧬 PCR / qPCR Setup</h1><p class="view-subtitle">Master mix calculators, cycling parameters, primer Tm helper.</p></div>
      <div class="tabs"><button class="tab active" data-tab="mix">Master mix</button><button class="tab" data-tab="cyc">Cycling</button><button class="tab" data-tab="tm">Primer Tm</button><button class="tab" data-tab="dt">Dilution from stock</button></div><div id="pc"></div>`;

    function render() {
      root.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
      const h = root.querySelector('#pc');
      const $ = id => root.querySelector('#' + id);

      if (tab === 'mix') {
        h.innerHTML = `<div class="card"><div class="card-sub">Pick a master mix template, set # of reactions, and auto-scale.</div><div class="grid grid-2"><div><div class="field"><label class="label">Protocol</label><select class="select" id="pTpl"></select></div><div class="field"><label class="label">Number of reactions</label><input class="input" id="pN" type="number" value="24" /></div><div class="field"><label class="label">Extra (%) for pipetting loss</label><input class="input" id="pX" type="number" value="10" /></div><div class="result highlight" id="pRes">—</div></div><div><div class="card-title">Reagents</div><div class="table-wrap"><table class="table"><thead><tr><th>Reagent</th><th>Per rxn</th><th>Total (×N)</th></tr></thead><tbody id="pTbl"></tbody></table></div></div></div></div>`;
        const tplSel = root.querySelector('#pTpl');
        tplSel.innerHTML = LC_DATA.pcrRecipes.map((r,i) => `<option value="${i}">${r.name}</option>`).join('');
        const calc = () => { const tpl = LC_DATA.pcrRecipes[+tplSel.value]; const n = +$('pN').value; const x = +$('pX').value/100; const totalR = n*(1+x); const totalVol = tpl.final*totalR; $('pTbl').innerHTML = tpl.reagents.map(r => `<tr><td>${r.i}</td><td class="mono">${r.a} ${r.u}</td><td class="mono">${(r.a*totalR).toFixed(1)} ${r.u}</td></tr>`).join(''); $('pRes').innerHTML = `Total volume: <strong>${totalVol.toFixed(0)} µL</strong> (${n} rxns + ${(x*100).toFixed(0)}% overage)`; };
        [tplSel, $('pN'), $('pX')].forEach(el => el.addEventListener('input', calc)); calc();
      } else if (tab === 'cyc') {
        h.innerHTML = `<div class="card"><div class="card-sub">Total PCR run time and timing breakdown.</div><div class="grid grid-2"><div><div class="field"><label class="label">Initial time</label><div class="input-with-suffix"><input class="input" id="pcIt" type="number" value="3" /><span class="suffix">min</span></div></div><div class="field"><label class="label">Each step time</label><div class="input-with-suffix"><input class="input" id="pcSt" type="number" value="30" /><span class="suffix">s</span></div></div><div class="field"><label class="label"># cycles</label><input class="input" id="pcC" type="number" value="35" /></div><div class="field"><label class="label">Final extension</label><div class="input-with-suffix"><input class="input" id="pcFt" type="number" value="5" /><span class="suffix">min</span></div></div></div><div><div class="result highlight" id="pcRes"></div><div class="result" id="pcBreakdown"></div><button class="btn btn-primary" id="pcStart">⏱ Start PCR timer</button></div></div></div>`;
        const calc = () => { const It=+$('pcIt').value,St=+$('pcSt').value,C=+$('pcC').value,Ft=+$('pcFt').value; const total=It*60+C*St*3+Ft*60; $('pcRes').innerHTML=`<strong>${LC.fmtTime(total)}</strong> (${(total/60).toFixed(1)} min)`; $('pcBreakdown').innerHTML=`Initial: ${It} min\nDenaturation: ${St}s × ${C} = ${St*C}s\nAnnealing: ${St}s × ${C} = ${St*C}s\nExtension: ${St}s × ${C} = ${St*C}s\nFinal extension: ${Ft} min\n\nRamp times not included (cycler-specific).`; };
        ['pcIt','pcSt','pcC','pcFt'].forEach(id=>$(id).addEventListener('input', calc)); calc();
        $('pcStart').addEventListener('click',()=>{const It=+$('pcIt').value,St=+$('pcSt').value,C=+$('pcC').value,Ft=+$('pcFt').value;LC.addTimer('PCR run',It*60+C*St*3+Ft*60);LC.toast('PCR timer started','success');LC.navigate('timers');});
      } else if (tab === 'tm') {
        h.innerHTML = `<div class="card"><div class="card-sub">Estimate primer Tm (Wallace rule: Tm = 2°C×(A+T) + 4°C×(G+C)). Valid for <20 nt.</div><div class="field"><label class="label">Primer sequence (5'→3')</label><input class="input" id="tmSeq" value="ATGCATGCATGCATGCATGC" style="font-family:var(--mono); text-transform:uppercase;" /></div><div class="result highlight" id="tmRes">—</div><div class="card-sub">• Length 18-25 nt · GC 40-60% · 3' G/C clamp · Avoid hairpins & dimers · Matched Tm ±1-2°C · Avoid runs ≥4 same base</div></div>`;
        const calc = () => { const s = $('tmSeq').value.toUpperCase().replace(/[^ATGC]/g,''); if(!s){$('tmRes').textContent='Enter a sequence';return;} const a=(s.match(/A/g)||[]).length,t=(s.match(/T/g)||[]).length,g=(s.match(/G/g)||[]).length,c=(s.match(/C/g)||[]).length; const tmW=2*(a+t)+4*(g+c); const gcPct=((g+c)/s.length*100).toFixed(1); $('tmRes').innerHTML=`Length: <strong>${s.length}</strong> nt · GC: <strong>${gcPct}%</strong> · Tm: <strong>${tmW}°C</strong>`; };
        $('tmSeq').addEventListener('input', calc); calc();
      } else {
        h.innerHTML = `<div class="card"><div class="card-sub">Resuspend lyophilized primers and prepare working stocks.</div><div class="grid grid-2"><div><div class="field"><label class="label">nmol of primer</label><div class="input-with-suffix"><input class="input" id="dtN" type="number" value="25" step="0.1" /><span class="suffix">nmol</span></div></div><div class="field"><label class="label">Stock concentration</label><div class="input-with-suffix"><input class="input" id="dtS" type="number" value="100" /><span class="suffix">µM</span></div></div><div class="result highlight" id="dtRes">—</div></div><div><div class="card-title">Working stock</div><div class="field"><label class="label">Working conc</label><div class="input-with-suffix"><input class="input" id="dtW" type="number" value="10" /><span class="suffix">µM</span></div></div><div class="field"><label class="label">Final volume</label><div class="input-with-suffix"><input class="input" id="dtV" type="number" value="100" /><span class="suffix">µL</span></div></div><div class="result" id="dtRes2">—</div></div></div></div>`;
        const calc1 = () => { const n=+$('dtN').value,s=+$('dtS').value; if(!n||!s)return; const vol=(n*1e6)/s; $('dtRes').innerHTML=`Add <strong>${vol.toFixed(1)} µL</strong> TE/H₂O to reach ${s} µM stock.`; };
        const calc2 = () => { const s=+$('dtS').value,w=+$('dtW').value,v=+$('dtV').value; if(!s||!w||!v)return; const vol=(w/s)*v; $('dtRes2').innerHTML=`Add <strong>${vol.toFixed(2)} µL</strong> stock + <strong>${(v-vol).toFixed(2)} µL</strong> diluent → ${v} µL at ${w} µM.`; };
        ['dtN','dtS'].forEach(id=>$(id).addEventListener('input',calc1));
        ['dtS','dtW','dtV'].forEach(id=>$(id).addEventListener('input',calc2));
        calc1(); calc2();
      }
    }
    root.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { tab = t.dataset.tab; render(); }));
    render(); return root;
  });
})();
