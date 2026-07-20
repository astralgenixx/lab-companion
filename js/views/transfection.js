(function () {
  'use strict';
  LC.registerView('transfection', function () {
    const root = document.createElement('div');
    let tab = 'reagents';
    root.innerHTML = `<div class="view-header"><h1 class="view-title">💉 Transfection & siRNA</h1><p class="view-subtitle">Reagent comparison, siRNA/shRNA design rules, optimization tips.</p></div>
      <div class="tabs"><button class="tab active" data-tab="reagents">Reagents</button><button class="tab" data-tab="sirna">siRNA Design</button><button class="tab" data-tab="calc">Transfection Calc</button></div><div id="tfContent"></div>`;

    function render() {
      root.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
      const h = root.querySelector('#tfContent');
      if (tab === 'reagents') {
        h.innerHTML = `<div class="card"><div class="card-sub">Choice depends on cell type, cargo (DNA/RNA/protein), and scale (plate to production).</div><div class="table-wrap"><table class="table"><thead><tr><th>Reagent</th><th>Type</th><th>Best for</th><th>Efficiency</th><th>Toxicity</th><th>Notes</th></tr></thead><tbody>${LC_DATA.transfectionReagents.map(r => `<tr><td><strong>${r.name}</strong></td><td>${r.type}</td><td>${r.cellTypes}</td><td class="mono">${r.efficiency}</td><td>${r.toxicity}</td><td>${r.notes}</td></tr>`).join('')}</tbody></table></div></div>`;
      } else if (tab === 'sirna') {
        h.innerHTML = `<div class="card"><div class="card-title">siRNA Design Rules</div><div class="card-sub">Based on Reynolds et al. (2004) and Dharmacon / IDT guidelines.</div><div class="list">${LC_DATA.sirnaDesign.rules.map((r,i) => `<div class="list-item"><div class="grow"><strong>${i+1}.</strong> ${r}</div></div>`).join('')}</div></div>
          <div class="card"><div class="card-title">Essential Controls</div><div class="list">${LC_DATA.sirnaDesign.controls.map((c,i) => `<div class="list-item"><div class="grow"><strong>${i+1}.</strong> ${c}</div></div>`).join('')}</div></div>
          <div class="card"><div class="card-title">Pro Tips</div><div class="list">${LC_DATA.sirnaDesign.tips.map((t,i) => `<div class="list-item"><div class="grow"><strong>${i+1}.</strong> ${t}</div></div>`).join('')}</div></div>`;
      } else {
        h.innerHTML = `<div class="card"><div class="card-sub">Calculate DNA/RNA and transfection reagent volumes.</div><div class="grid grid-2"><div><div class="field"><label class="label">Vessel type</label><select class="select" id="tfVes"><option value="96">96-well</option><option value="24">24-well</option><option value="12">12-well</option><option value="6" selected>6-well</option><option value="35">35 mm</option><option value="60">60 mm</option><option value="100">100 mm</option><option value="t25">T25</option><option value="t75">T75</option></select></div><div class="field"><label class="label">Total DNA/RNA per well (µg)</label><input class="input" id="tfDNA" type="number" value="2" step="0.1" /></div><div class="field"><label class="label">Reagent:DNA ratio (v:w)</label><div class="input-with-suffix"><input class="input" id="tfRatio" type="number" value="3" step="0.5" /><span class="suffix">µL:1 µg</span></div></div><div class="result highlight" id="tfRes"></div></div><div><div class="card-title">Quick reference</div><div class="table-wrap"><table class="table"><thead><tr><th>Vessel</th><th>Cells/well</th><th>DNA (µg)</th><th>Lipo (µL)</th></tr></thead><tbody><tr><td>96-well</td><td class="mono">1-4 ×10⁴</td><td class="mono">0.1-0.2</td><td class="mono">0.3-0.6</td></tr><tr><td>24-well</td><td class="mono">5-20 ×10⁴</td><td class="mono">0.5-1</td><td class="mono">1.5-3</td></tr><tr><td>12-well</td><td class="mono">1-4 ×10⁵</td><td class="mono">0.5-1.5</td><td class="mono">1.5-4.5</td></tr><tr><td>6-well</td><td class="mono">2-10 ×10⁵</td><td class="mono">1-3</td><td class="mono">3-9</td></tr><tr><td>10 cm</td><td class="mono">2-4 ×10⁶</td><td class="mono">5-12</td><td class="mono">15-36</td></tr><tr><td>T75</td><td class="mono">4-8 ×10⁶</td><td class="mono">10-25</td><td class="mono">30-75</td></tr></tbody></table></div></div></div></div>`;
        const areas = { '96': 0.32, '24': 1.9, '12': 3.8, '6': 9.6, '35': 9.6, '60': 28.3, '100': 78.5, 't25': 25, 't75': 75 };
        const $ = id => root.querySelector('#' + id);
        const calc = () => { const a = areas[$('tfVes').value] || 9.6; const dna = +$('tfDNA').value; const ratio = +$('tfRatio').value; const reagent = dna * ratio; $('tfRes').innerHTML = `Per well: <strong>${dna.toFixed(1)} µg</strong> DNA/RNA + <strong>${reagent.toFixed(1)} µL</strong> reagent<br>Dilute in <strong>${Math.round(a*10)} µL</strong> Opti-MEM per well.`; };
        ['tfVes','tfDNA','tfRatio'].forEach(id => $(id).addEventListener('input', calc)); calc();
      }
    }
    root.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { tab = t.dataset.tab; render(); }));
    render(); return root;
  });
})();
