(function () {
  'use strict';

  function unitToMultiplier(u) {
    const map = { 'M': 1, 'mM': 1e3, 'µM': 1e6, 'nM': 1e9, 'pM': 1e12, 'mg/mL': 1, 'µg/mL': 1e3, 'ng/mL': 1e6, '%': 1, '×': 1 };
    return map[u] || 1;
  }
  function closestUnit(val, type) {
    // type: 'conc' or 'vol'
    if (type === 'conc') {
      if (val >= 1) return 'M';
      if (val >= 1e-3) return 'mM';
      if (val >= 1e-6) return 'µM';
      return 'nM';
    }
    if (val >= 1e3) return 'L';
    if (val >= 1) return 'mL';
    if (val >= 1e-3) return 'µL';
    return 'nL';
  }

  // === Molarity ===
  LC.registerView('calc-molarity', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">🧪 Molarity Calculator</h1><p class="view-subtitle">Prepare stock solutions from solid or dilute from stock.</p></div>
      <div class="tabs"><button class="tab active" data-tab="solid">From solid</button><button class="tab" data-tab="dilute">Stock → working</button></div><div id="mc"></div>`;
    let tab = 'solid';
    function $(id) { return root.querySelector('#' + id); }
    function render() {
      root.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
      const host = root.querySelector('#mc');
      if (tab === 'solid') {
        host.innerHTML = `<div class="card"><div class="card-sub">For solids: weigh the calculated mass, dissolve in ~80% volume, adjust to final volume.</div><div class="grid grid-2"><div><div class="field"><label class="label">Molecular weight (g/mol)</label><div class="input-with-suffix"><input class="input" id="mw" type="number" value="58.44" /><span class="suffix">g/mol</span></div></div><div class="field"><label class="label">Desired concentration</label><div class="input-with-suffix"><input class="input" id="conc" type="number" value="1" /><span class="suffix">M</span></div></div><div class="field"><label class="label">Final volume</label><div class="input-with-suffix"><input class="input" id="vol" type="number" value="100" /><span class="suffix">mL</span></div></div><div class="result highlight" id="mRes">—</div></div><div><div class="card-title">Common MW</div><div class="table-wrap"><table class="table"><thead><tr><th>Compound</th><th>MW</th></tr></thead><tbody><tr><td>NaCl</td><td class="mono">58.44</td></tr><tr><td>KCl</td><td class="mono">74.55</td></tr><tr><td>Tris base</td><td class="mono">121.14</td></tr><tr><td>Glycine</td><td class="mono">75.07</td></tr><tr><td>EDTA disodium</td><td class="mono">372.24</td></tr><tr><td>Glucose</td><td class="mono">180.16</td></tr><tr><td>SDS</td><td class="mono">288.38</td></tr><tr><td>DTT</td><td class="mono">154.25</td></tr></tbody></table></div></div></div></div>`;
        const $ = id => root.querySelector('#' + id);
        const calc = () => { const mw = +$('mw').value, c = +$('conc').value, v = +$('vol').value; if (!mw || !c || !v) { $('mRes').textContent = 'Enter values'; return; } const mass = mw * c * (v / 1000); $('mRes').innerHTML = `Weigh <strong>${mass.toFixed(4)} g</strong> and dissolve in ${v} mL.`; };
        ['mw','conc','vol'].forEach(id => $(id).addEventListener('input', calc));
        calc();
      } else {
        host.innerHTML = `<div class="card"><div class="card-sub">Make a working solution from a concentrated stock.</div><div class="field"><label class="label">Stock concentration</label><div class="input-group"><input class="input" id="dsC" type="number" value="100" /><select class="select" id="dsCU" style="max-width:80px;"><option value="M">M</option><option value="mM" selected>mM</option><option value="µM">µM</option></select></div></div><div class="field"><label class="label">Desired concentration</label><div class="input-group"><input class="input" id="dwC" type="number" value="10" /><select class="select" id="dwCU" style="max-width:80px;"><option value="M">M</option><option value="mM" selected>mM</option><option value="µM">µM</option></select></div></div><div class="field"><label class="label">Final volume</label><div class="input-with-suffix"><input class="input" id="dv" type="number" value="10" /><span class="suffix">mL</span></div></div><div class="result highlight" id="dRes2">—</div></div>`;
        const $ = id => root.querySelector('#' + id);
        const calc = () => { const sC = +$('dsC').value, sU = $('dsCU').value; const wC = +$('dwC').value, wU = $('dwCU').value; const v = +$('dv').value; if (!sC || !wC || !v) { $('dRes2').textContent = 'Enter values'; return; } const sCNorm = sC / unitToMultiplier(sU); const wCNorm = wC / unitToMultiplier(wU); const v1 = (wCNorm / sCNorm) * v; $('dRes2').innerHTML = `Add <strong>${v1 < 0.01 ? (v1*1000).toFixed(2)+' µL' : v1.toFixed(2)+' mL'}</strong> of stock + diluent to ${v} mL final.`; };
        ['dsC','dsCU','dwC','dwCU','dv'].forEach(id => $(id).addEventListener('input', calc));
        calc();
      }
    }
    root.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { tab = t.dataset.tab; render(); }));
    render();
    return root;
  });

  // === Dilution ===
  LC.registerView('calc-dilution', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">💧 Dilution Calculator</h1><p class="view-subtitle">Simple C₁V₁ = C₂V₂ with unit awareness. Serial dilution and antibody dilutions.</p></div>
      <div class="card"><div class="card-sub">C₁V₁ = C₂V₂ — change any field to compute automatically.</div><div class="grid grid-2"><div><div class="field"><label class="label">Stock conc (C₁)</label><div class="input-group"><input class="input" id="dC1" type="number" value="100" /><select class="select" id="dC1U" style="max-width:80px;"><option value="M">M</option><option value="mM" selected>mM</option><option value="µM">µM</option></select></div></div><div class="field"><label class="label">Final conc (C₂)</label><div class="input-group"><input class="input" id="dC2" type="number" value="10" /><select class="select" id="dC2U" style="max-width:80px;"><option value="M">M</option><option value="mM" selected>mM</option><option value="µM">µM</option></select></div></div><div class="field"><label class="label">Final volume (V₂)</label><div class="input-with-suffix"><input class="input" id="dV2" type="number" value="10" /><span class="suffix">mL</span></div></div></div><div><div class="field"><label class="label">Stock volume (V₁) — auto</label><div class="input-with-suffix"><input class="input" id="dV1" type="number" value="1" disabled /><span class="suffix">mL</span></div></div><div class="field"><label class="label">Diluent to add</label><div class="input-with-suffix"><input class="input" id="dDil" type="number" disabled /><span class="suffix">mL</span></div></div></div></div><div class="result highlight" id="dRes">—</div></div>
      <div class="card"><div class="card-title">Serial dilution</div><div class="grid grid-2"><div><div class="field"><label class="label">Starting concentration</label><div class="input-with-suffix"><input class="input" id="sdC" type="number" value="1" /><span class="suffix">M</span></div></div><div class="field"><label class="label">Dilution factor at each step</label><div class="input-with-suffix"><input class="input" id="sdF" type="number" value="10" /><span class="suffix">×</span></div></div><div class="field"><label class="label">Number of steps</label><input class="input" id="sdN" type="number" value="5" /></div></div><div><div class="result" id="sdRes"></div></div></div></div>`;
    const $ = id => root.querySelector('#' + id);
    const calc = () => { const c1 = +$('dC1').value, u1 = unitToMultiplier($('dC1U').value); const c2 = +$('dC2').value, u2 = unitToMultiplier($('dC2U').value); const v2 = +$('dV2').value; if (!c1 || !c2 || !v2) { $('dRes').textContent = 'Enter values'; return; } const v1 = ((c2 / u2) / (c1 / u1)) * v2; const dil = v2 - v1; $('dV1').value = v1.toFixed(3); $('dDil').value = dil.toFixed(3); $('dRes').innerHTML = `Take <strong>${v1.toFixed(3)} mL</strong> of stock, add <strong>${dil.toFixed(3)} mL</strong> diluent → ${v2} mL at ${c2} ${$('dC2U').value}.<br>Dilution factor: <strong>1:${Math.round(c1/c2*u2/u1)}</strong>`; };
    ['dC1','dC1U','dC2','dC2U','dV2'].forEach(id => $(id).addEventListener('input', calc));
    calc();

    const calcSerial = () => { const c0 = +$('sdC').value, f = +$('sdF').value, n = +$('sdN').value; if (!c0 || !f || !n) return; let rows = ''; let c = c0; for (let i = 1; i <= n; i++) { c = c / f; rows += `Step ${i}: ${c < 1e-3 ? (c*1e6).toFixed(2)+' µM' : c < 1 ? (c*1e3).toFixed(2)+' mM' : c.toFixed(2)+' M'}<br>`; } $('sdRes').innerHTML = rows; };
    ['sdC','sdF','sdN'].forEach(id => $(id).addEventListener('input', calcSerial));
    calcSerial();
    return root;
  });

  // === Centrifuge ===
  LC.registerView('calc-centrifuge', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">🌀 Centrifuge — rpm ↔ g</h1><p class="view-subtitle">Convert between rpm and relative centrifugal force (RCF). RCF = (1.118×10⁻⁵) × r × rpm²</p></div>
      <div class="card"><div class="card-sub">Enter the centrifuge radius (from center of rotor to tube bottom, in cm). Most benchtop rotors are ~7-9 cm (e.g. 7.2 cm for FA-24×2), floor centrifuges ~15-20 cm.</div><div class="grid grid-2"><div><div class="field"><label class="label">Rotor radius (cm)</label><div class="input-with-suffix"><input class="input" id="cr" type="number" value="7.2" step="0.1" /><span class="suffix">cm</span></div></div><div class="field"><label class="label">Speed (rpm)</label><input class="input" id="crpm" type="number" value="13000" /></div><div class="result highlight" id="cRpm2G">—</div></div><div><div class="field"><label class="label">Desired RCF (× g)</label><div class="input-with-suffix"><input class="input" id="cg" type="number" value="15000" /><span class="suffix">g</span></div></div><div class="field"><label class="label">Speed (rpm) — auto</label><input class="input" id="cG2Rpm" disabled /></div><div class="result highlight" id="cG2R">—</div></div></div></div>
      <div class="card"><div class="card-title">Common centrifuge presets</div><div class="table-wrap"><table class="table"><thead><tr><th>Cell type / purpose</th><th>RCF (g)</th><th>Time</th></tr></thead><tbody><tr><td>Mammalian cells (gentle pellet)</td><td class="mono">300</td><td>5 min</td></tr><tr><td>Mammalian cells (standard)</td><td class="mono">500</td><td>5 min</td></tr><tr><td>Bacteria (pellet)</td><td class="mono">4000-6000</td><td>10-15 min</td></tr><tr><td>Protein A/G beads</td><td class="mono">5000</td><td>30 s pulse</td></tr><tr><td>Microcentrifuge (standard)</td><td class="mono">13000-15000</td><td>10-30 min</td></tr><tr><td>DNA precipitation</td><td class="mono">12000-15000</td><td>15-30 min</td></tr><tr><td>Mitochondria isolation</td><td class="mono">600-10000</td><td>varies</td></tr></tbody></table></div></div>`;
    const $ = id => root.querySelector('#' + id);
    const calcRpm2G = () => { const r = +$('cr').value, rpm = +$('crpm').value; if (!r || !rpm) return; const g = 1.118e-5 * r * rpm * rpm; $('cRpm2G').innerHTML = `<strong>${Math.round(g)} g</strong> (${(g/1000).toFixed(1)} kg)`; }; const calcG2R = () => { const r = +$('cr').value, g = +$('cg').value; if (!r || !g) return; const rpm = Math.sqrt(g / (1.118e-5 * r)); $('cG2Rpm').value = Math.round(rpm); $('cG2R').innerHTML = `<strong>${Math.round(rpm)} rpm</strong> with r = ${r} cm`; };
    ['cr','crpm'].forEach(id => $(id).addEventListener('input', calcRpm2G));
    ['cr','cg'].forEach(id => $(id).addEventListener('input', calcG2R));
    calcRpm2G(); calcG2R();
    return root;
  });

  // === Concentration (A260/A280) ===
  LC.registerView('calc-concentration', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">📈 Concentration Calculator</h1><p class="view-subtitle">A260 DNA/RNA quantification, A280 protein estimation, Beer-Lambert law.</p></div>
      <div class="card"><div class="card-sub">A260-based quantification for nucleic acids.</div><div class="grid grid-2"><div><div class="field"><label class="label">A260 reading</label><input class="input" id="a260" type="number" value="0.5" step="0.001" /></div><div class="field"><label class="label">Type</label><select class="select" id="aType"><option value="dna">dsDNA (50 µg/mL per A260)</option><option value="rna">RNA (40 µg/mL per A260)</option><option value="ssdna">ssDNA (33 µg/mL per A260)</option></select></div><div class="field"><label class="label">Dilution factor</label><input class="input" id="aDil" type="number" value="100" /></div><div class="result highlight" id="aRes">—</div></div><div><div class="card-title">A260/A280 purity</div><div class="field"><label class="label">A260</label><input class="input" id="p260" type="number" value="1.8" step="0.001" /></div><div class="field"><label class="label">A280</label><input class="input" id="p280" type="number" value="1.0" step="0.001" /></div><div class="result" id="pRes"></div><div class="card-sub" style="margin-top:8px;"><strong>DNA:</strong> 1.8-2.0 = pure, &lt;1.7 = protein contamination<br><strong>RNA:</strong> 2.0-2.2 = pure, &lt;2.0 = protein or phenol contamination</div></div></div></div>
      <div class="card"><div class="card-title">A280 protein estimation</div><div class="card-sub">At 280 nm, a 1 mg/mL protein solution has ~1.0 AU (varies by sequence). Use known extinction coefficient for accuracy.</div><div class="field"><label class="label">A280 reading</label><input class="input" id="prA" type="number" value="0.5" step="0.001" /></div><div class="field"><label class="label">Estimated ε₁% (1 mg/mL = ? AU)</label><input class="input" id="prE" type="number" value="1.0" step="0.1" /></div><div class="result highlight" id="prRes">—</div></div>`;
    const $ = id => root.querySelector('#' + id);
    const calcA = () => { const a = +$('a260').value, dil = +$('aDil').value; const type = $('aType').value; const factors = { dna: 50, rna: 40, ssdna: 33 }; const f = factors[type] || 50; if (!a) return; $('aRes').innerHTML = `<strong>${(a*f*dil).toFixed(1)} µg/mL</strong> (total in cuvette: ${(a*f).toFixed(2)} µg/mL)`; };
    const calcP = () => { const a260 = +$('p260').value, a280 = +$('p280').value; if (!a260 || !a280) return; const r = a260 / a280; let q = r >= 1.8 && r <= 2.0 ? '✓ Pure DNA' : r >= 2.0 && r <= 2.4 ? '✓ Pure RNA' : r < 1.7 ? '⚠ Protein or phenol contamination' : r > 2.4 ? '⚠ Degraded RNA or salt contamination' : '—'; $('pRes').innerHTML = `Ratio: <strong>${r.toFixed(2)}</strong> — ${q}`; };
    const calcPr = () => { const a = +$('prA').value, e = +$('prE').value; if (!a || !e) return; $('prRes').innerHTML = `Estimated concentration: <strong>${(a/e).toFixed(2)} mg/mL</strong>`; };
    ['a260','aDil','aType'].forEach(id => $(id).addEventListener('input', calcA));
    ['p260','p280'].forEach(id => $(id).addEventListener('input', calcP));
    ['prA','prE'].forEach(id => $(id).addEventListener('input', calcPr));
    calcA(); calcP(); calcPr();
    return root;
  });

  // === Cell Count ===
  LC.registerView('calc-cellcount', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">🔢 Cell Count Calculator</h1><p class="view-subtitle">Hemocytometer counting, viability (Trypan Blue), and seeding density.</p></div>
      <div class="card"><div class="card-sub">Standard Neubauer: count 4 corner squares, average, multiply by dilution × 10⁴.</div><div class="grid grid-2"><div><div class="field"><label class="label">Square 1 (top-left)</label><input class="input" id="hc1" type="number" value="120" /></div><div class="field"><label class="label">Square 2 (top-right)</label><input class="input" id="hc2" type="number" value="115" /></div><div class="field"><label class="label">Square 3 (bottom-left)</label><input class="input" id="hc3" type="number" value="125" /></div><div class="field"><label class="label">Square 4 (bottom-right)</label><input class="input" id="hc4" type="number" value="118" /></div><div class="field"><label class="label">Dilution factor (1:n)</label><input class="input" id="hcDil" type="number" value="2" /></div></div><div><div class="field"><label class="label">Total volume (mL)</label><div class="input-with-suffix"><input class="input" id="hcVol" type="number" value="10" /><span class="suffix">mL</span></div></div><div class="result highlight" id="hcRes">—</div><div class="card-title" style="margin-top:16px;">Viability</div><div class="field"><label class="label">Live cells counted (#)</label><input class="input" id="hcLive" type="number" /></div><div class="field"><label class="label">Dead (blue) cells counted (#)</label><input class="input" id="hcDead" type="number" /></div><div class="result" id="hcViab"></div></div></div></div>
      <div class="card"><div class="card-title">Seeding calculator</div><div class="card-sub">Given cell count, calculate plating volume for desired density.</div><div class="grid grid-2"><div><div class="field"><label class="label">Cell concentration (cells/mL)</label><input class="input" id="scConc" type="number" value="1.2e6" /></div><div class="field"><label class="label">Seeding density (cells/well)</label><input class="input" id="scDens" type="number" value="50000" /></div><div class="field"><label class="label">Number of wells</label><input class="input" id="scN" type="number" value="12" /></div></div><div><div class="field"><label class="label">Well format</label><select class="select" id="scFmt"><option value="6">6-well (2 mL media/well)</option><option value="12">12-well (1 mL/well)</option><option value="24">24-well (500 µL/well)</option><option value="48">48-well (200 µL/well)</option><option value="96">96-well (100 µL/well)</option></select></div><div class="result highlight" id="scRes">—</div></div></div></div>`;
    const $ = id => root.querySelector('#' + id);
    const calcHC = () => { const c1=+$('hc1').value,c2=+$('hc2').value,c3=+$('hc3').value,c4=+$('hc4').value; const dil=+$('hcDil').value,vol=+$('hcVol').value; if (!c1||!c2||!c3||!c4||!dil) return; const avg = (c1+c2+c3+c4)/4; const cellsPerMl = avg * dil * 1e4; const total = cellsPerMl * vol; $('hcRes').innerHTML = `Average: <strong>${avg.toFixed(1)} cells/square</strong><br>Concentration: <strong>${cellsPerMl < 1e6 ? (cellsPerMl/1e4).toFixed(1)+' × 10⁴' : (cellsPerMl/1e6).toFixed(2)+' × 10⁶'} cells/mL</strong><br>Total cells: <strong>${(total/1e6).toFixed(2)} × 10⁶</strong> in ${vol} mL`; };
    const calcViab = () => { const l=+$('hcLive').value,d=+$('hcDead').value; if (!l||!d) { $('hcViab').textContent = ''; return; } const v = l/(l+d)*100; $('hcViab').innerHTML = `Viability: <strong>${v.toFixed(1)}%</strong> (${l} live / ${l+d} total)`; };
    const calcSeed = () => { const conc=+$('scConc').value,dens=+$('scDens').value,n=+$('scN').value; if (!conc||!dens||!n) return; const volPerWell = dens/conc*1000; const total = volPerWell*n; $('scRes').innerHTML = `Per well: <strong>${volPerWell.toFixed(1)} µL</strong> cells + media to fill<br>Total cell volume: <strong>${total.toFixed(1)} µL</strong> for ${n} wells`; };
    ['hc1','hc2','hc3','hc4','hcDil','hcVol'].forEach(id => $(id).addEventListener('input', calcHC));
    ['hcLive','hcDead'].forEach(id => $(id).addEventListener('input', calcViab));
    ['scConc','scDens','scN','scFmt'].forEach(id => $(id).addEventListener('input', calcSeed));
    calcHC(); calcSeed();
    return root;
  });

  // === Unit Converter ===
  LC.registerView('calc-units', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">📏 Unit Converter</h1><p class="view-subtitle">Quick conversions: volume, mass, molar, temperature.</p></div>
      <div class="card"><div class="grid grid-2"><div><div class="field"><label class="label">Category</label><select class="select" id="ucCat"><option value="vol">Volume</option><option value="mass">Mass</option><option value="conc">Molar concentration</option></select></div><div class="field"><label class="label">Value</label><input class="input" id="ucIn" type="number" value="1" /></div><div class="field"><label class="label">From</label><select class="select" id="ucFrom"></select></div><div class="field"><label class="label">To</label><select class="select" id="ucTo"></select></div><div class="result highlight" id="ucRes">—</div></div><div><div class="card-title">Lab quick ref</div><div class="table-wrap"><table class="table"><thead><tr><th>Unit</th><th>Equivalent</th></tr></thead><tbody><tr><td>1 L</td><td class="mono">1000 mL</td></tr><tr><td>1 mL</td><td class="mono">1000 µL</td></tr><tr><td>1 µL</td><td class="mono">1000 nL</td></tr><tr><td>1 g</td><td class="mono">1000 mg</td></tr><tr><td>1 mg</td><td class="mono">1000 µg</td></tr><tr><td>1 µg</td><td class="mono">1000 ng</td></tr><tr><td>1 M</td><td class="mono">1000 mM</td></tr><tr><td>1 mM</td><td class="mono">1000 µM</td></tr><tr><td>1 µM</td><td class="mono">1000 nM</td></tr></tbody></table></div></div></div></div>`;
    const uMap = {
      vol: ['L', 'mL', 'µL', 'nL', 'gal', 'qt', 'pt', 'fl oz'],
      mass: ['kg', 'g', 'mg', 'µg', 'ng', 'pg', 'lb', 'oz'],
      conc: ['M', 'mM', 'µM', 'nM', 'pM', 'mg/mL', 'µg/mL', 'ng/mL']
    };
    function getFactor(cat, unit) {
      const maps = {
        vol: { L:1, mL:0.001, µL:1e-6, nL:1e-9, gal:3.785, qt:0.9463, pt:0.4732, 'fl oz':0.02957 },
        mass: { kg:1000, g:1, mg:0.001, µg:1e-6, ng:1e-9, pg:1e-12, lb:453.6, oz:28.35 },
        conc: { M:1, mM:0.001, µM:1e-6, nM:1e-9, pM:1e-12, 'mg/mL':1, 'µg/mL':0.001, 'ng/mL':1e-6 }
      };
      return (maps[cat] || {})[unit] || 1;
    }
    function populate(cat) {
      const units = uMap[cat] || [];
      const f = root.querySelector('#ucFrom'), t = root.querySelector('#ucTo');
      f.innerHTML = units.map(u => `<option value="${u}" ${u===units[0]?'selected':''}>${u}</option>`).join('');
      t.innerHTML = units.map(u => `<option value="${u}" ${u===units[units.length-1]?'selected':''}>${u}</option>`).join('');
    }
    const calc = () => { const cat = root.querySelector('#ucCat').value; const v = +root.querySelector('#ucIn').value; const fu = root.querySelector('#ucFrom').value; const tu = root.querySelector('#ucTo').value; if (!v) { root.querySelector('#ucRes').textContent = 'Enter a value'; return; } const r = v * getFactor(cat, fu) / getFactor(cat, tu); root.querySelector('#ucRes').innerHTML = `<strong>${v} ${fu}</strong> = <strong>${r.toExponential(4)}</strong> ${tu}`; };
    root.querySelector('#ucCat').addEventListener('change', () => { populate(root.querySelector('#ucCat').value); calc(); });
    ['ucIn','ucFrom','ucTo'].forEach(id => root.querySelector('#'+id).addEventListener('input', calc));
    populate('vol');
    calc();
    return root;
  });

  // === IC50 / Dose-Response ===
  LC.registerView('calc-ic50', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">📉 IC50 / Dose-Response</h1><p class="view-subtitle">Quick IC50 estimation from dose-response data. For rigorous analysis, use GraphPad/Prism or R.</p></div>
      <div class="card"><div class="card-sub">Enter concentration-response pairs. Uses log(conc) vs response interpolation.</div>
        <div class="grid grid-2"><div><div class="card-title">Data</div><div id="icData" style="max-height:300px; overflow-y:auto;"></div><button class="btn" id="icAddRow" style="margin-top:8px;">+ Add row</button></div><div><div class="result highlight" id="icRes"></div><canvas id="icChart" style="max-height:250px;"></canvas></div></div></div>`;

    let rows = [{ conc: '0.01', resp: '95' }, { conc: '0.1', resp: '82' }, { conc: '1', resp: '48' }, { conc: '10', resp: '15' }, { conc: '100', resp: '3' }];
    let chart = null;
    function render() {
      const h = root.querySelector('#icData');
      h.innerHTML = rows.map((r,i) => `<div class="input-group" style="margin-bottom:4px;"><input class="input" value="${r.conc}" data-icc="${i}" placeholder="Conc (µM)" style="width:100px;" /><input class="input" value="${r.resp}" data-icr="${i}" placeholder="Response (%)" style="width:100px;" /><button class="btn btn-ghost btn-sm" data-icdel="${i}">✕</button></div>`).join('');
      h.querySelectorAll('[data-icc]').forEach(el => el.addEventListener('input', () => { rows[el.dataset.icc].conc = el.value; update(); }));
      h.querySelectorAll('[data-icr]').forEach(el => el.addEventListener('input', () => { rows[el.dataset.icr].resp = el.value; update(); }));
      h.querySelectorAll('[data-icdel]').forEach(b => b.addEventListener('click', () => { rows.splice(+b.dataset.icdel, 1); render(); update(); }));
    }
    root.querySelector('#icAddRow').addEventListener('click', () => { rows.push({ conc: '', resp: '' }); render(); update(); });

    function update() {
      const pts = rows.map(r => ({ x: parseFloat(r.conc) || 0, y: parseFloat(r.resp) || 0 })).filter(p => p.x > 0).sort((a,b) => a.x - b.x);
      const res = root.querySelector('#icRes');
      if (pts.length < 3) { res.innerHTML = 'Need ≥3 concentration points.'; return; }
      // Find two points that bracket 50%
      let ic50 = null;
      for (let i = 0; i < pts.length - 1; i++) {
        if ((pts[i].y >= 50 && pts[i+1].y <= 50) || (pts[i].y <= 50 && pts[i+1].y >= 50)) {
          const frac = (50 - pts[i].y) / (pts[i+1].y - pts[i].y);
          ic50 = Math.pow(10, Math.log10(pts[i].x) + frac * (Math.log10(pts[i+1].x) - Math.log10(pts[i].x)));
          break;
        }
      }
      const maxResp = Math.max(...pts.map(p => p.y));
      const minResp = Math.min(...pts.map(p => p.y));
      res.innerHTML = ic50 !== null ? `IC50 ≈ <strong>${ic50.toFixed(2)} µM</strong><br>Max effect: ${maxResp.toFixed(0)}% · Residual: ${minResp.toFixed(0)}%` : '50% not crossed in this range.';

      const ctx = document.getElementById('icChart');
      if (!ctx || !window.Chart) return;
      if (chart) chart.destroy();
      chart = new Chart(ctx, { type: 'scatter', data: { datasets: [{ label: 'Data', data: pts, borderColor: '#ef4444', backgroundColor: '#ef4444', pointRadius: 6 }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { type: 'logarithmic', title: { display: true, text: 'Concentration (µM)' }, grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--border').trim() } }, y: { title: { display: true, text: 'Response (%)' }, min: 0, max: 110, grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--border').trim() } } } } });
    }
    render();
    setTimeout(update, 300);
    return root;
  });

  // === Protein MW from sequence ===
  LC.registerView('calc-proteinmw', function () {
    const root = document.createElement('div');
    root.innerHTML = `<div class="view-header"><h1 class="view-title">🧬 Protein Tools</h1><p class="view-subtitle">Molecular weight from amino acid sequence, extinction coefficient, pI estimation.</p></div>
      <div class="card"><div class="card-sub">Paste a protein sequence (single-letter AA code). Extinction coefficient at 280 nm calculated from Trp, Tyr, and Cys (disulfide) residues.</div>
        <div class="field"><label class="label">Amino acid sequence (single-letter)</label><textarea class="textarea" id="pmSeq" rows="4" placeholder="MADQLTEEQI AEFKEAFSLF DKDGDGTITT KELGTVMRSL..." style="font-family:var(--mono); font-size:12px;"></textarea></div>
        <div class="grid grid-3"><div class="result highlight" id="pmMw"><span class="result-label">Molecular Weight</span>—</div><div class="result highlight" id="pmExt"><span class="result-label">Ext. Coefficient (280 nm)</span>—</div><div class="result highlight" id="pmPi"><span class="result-label">Estimated pI</span>—</div></div>
        <div class="result" id="pmAACount"></div>
        <div class="card-sub" style="margin-top:8px;">MW = sum of residue weights + H₂O (18.015). Extinction coefficient based on Trp (5500), Tyr (1490), Cys (125) M⁻¹cm⁻¹. pI uses approximate pKa values.</div></div>`;

    const aaMw = { A:89.09, R:174.20, N:132.12, D:133.10, C:121.15, E:147.13, Q:146.15, G:75.07, H:155.16, I:131.17, L:131.17, K:146.19, M:149.21, F:165.19, P:115.13, S:105.09, T:119.12, W:204.23, Y:181.19, V:117.15 };
    const pKa = { C:8.3, D:3.9, E:4.3, H:6.0, K:10.5, R:12.5, Y:10.1, Nterm:8.0, Cterm:3.5 };

    const calc = () => {
      const seq = root.querySelector('#pmSeq').value.toUpperCase().replace(/[^A-Z]/g, '');
      if (!seq) { root.querySelector('#pmMw').innerHTML = '<span class="result-label">Molecular Weight</span>—'; root.querySelector('#pmExt').innerHTML = '<span class="result-label">Ext. Coefficient (280 nm)</span>—'; root.querySelector('#pmPi').innerHTML = '<span class="result-label">Estimated pI</span>—'; root.querySelector('#pmAACount').innerHTML = ''; return; }
      let mw = 18.015;
      const counts = {};
      seq.split('').forEach(a => { mw += (aaMw[a] || 110); counts[a] = (counts[a] || 0) + 1; });
      const trp = counts['W'] || 0, tyr = counts['Y'] || 0, cys = counts['C'] || 0;
      const ext280 = trp * 5500 + tyr * 1490 + cys * 125;

      // Approximate pI
      let pi = 7.0;
      for (let t = 0; t < 20; t++) {
        let net = 0;
        for (const a of seq) {
          if (a === 'D' || a === 'E' || a === 'C' || a === 'Y') net -= 1 / (1 + Math.pow(10, pKa[a] - pi));
          if (a === 'R' || a === 'K' || a === 'H') net += 1 / (1 + Math.pow(10, pi - pKa[a]));
        }
        net += 1 / (1 + Math.pow(10, pi - pKa['Nterm']));
        net -= 1 / (1 + Math.pow(10, pKa['Cterm'] - pi));
        pi += net * 0.5;
        if (Math.abs(net) < 0.01) break;
      }

      root.querySelector('#pmMw').innerHTML = `<span class="result-label">Molecular Weight</span><strong>${(mw/1000).toFixed(2)} kDa</strong> (${mw.toFixed(1)} Da)`;
      root.querySelector('#pmExt').innerHTML = `<span class="result-label">Ext. Coefficient (280 nm)</span><strong>${ext280} M⁻¹cm⁻¹</strong><br>0.1% (=1 g/L): A280 ≈ ${(ext280/mw*10).toFixed(2)}`;
      root.querySelector('#pmPi').innerHTML = `<span class="result-label">Estimated pI</span><strong>${pi.toFixed(2)}</strong>`;
      root.querySelector('#pmAACount').innerHTML = `${seq.length} residues · ${Object.keys(counts).length} unique AAs · W:${trp} Y:${tyr} C:${cys}`;
    };
    root.querySelector('#pmSeq').addEventListener('input', calc);
    return root;
  });
})();
