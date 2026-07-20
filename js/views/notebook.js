(function () {
  'use strict';
  LC.registerView('notebook', function () {
    const root = document.createElement('div');
    let editing = null;
    root.innerHTML = `<div class="view-header"><h1 class="view-title">📓 Lab Notebook</h1><p class="view-subtitle">Daily experiment log — search, edit, export. Stored locally in your browser.</p></div>
      <div class="search-bar"><span>🔍</span><input id="nSearch" placeholder="Search notes..." /><span style="margin-left:8px; font-size:12px; color:var(--text-muted);">Template:</span><select class="select" id="nTpl" style="max-width:160px;"><option value="">Blank</option><option value="wb">Western Blot</option><option value="icc">ICC / IF</option><option value="ip">IP / Co-IP</option><option value="qpcr">qPCR</option><option value="viab">Viability Assay</option><option value="clone">Cloning</option></select></div>
      <div class="card"><div class="card-title" id="nFormTitle">+ New entry</div><div class="input-group"><input class="input" id="nTitle" placeholder="Title (e.g. WB: p53 expression after doxorubicin)" /><input class="input" id="nDate" type="date" /></div><div class="input-group" style="margin-top:6px;"><input class="input" id="nTags" placeholder="Tags (comma separated, e.g. WB, MCF7, p53)" /><input class="input" id="nCell" placeholder="Cell line / sample" /></div><div class="field" style="margin-top:8px;"><label class="label">Notes</label><textarea class="textarea" id="nBody" rows="8" placeholder="Aim:&#10;Materials:&#10;Protocol:&#10;Results:&#10;Next steps:"></textarea></div><div style="display:flex; gap:8px;"><button class="btn btn-primary" id="nSave">💾 Save</button><button class="btn" id="nCancel" style="display:none;">Cancel</button></div></div>
      <div class="card"><div class="card-title">Entries</div><div id="nList" class="list"></div></div>`;

    function render(q) {
      q = (q || '').toLowerCase();
      const list = LC.State.notebook.filter(n => !q || (n.title||'').toLowerCase().includes(q) || (n.body||'').toLowerCase().includes(q) || (n.tags||'').toLowerCase().includes(q));
      const host = root.querySelector('#nList');
      if (list.length === 0) { host.innerHTML = '<div class="list-empty">No entries yet.</div>'; return; }
      host.innerHTML = list.map(n => { const preview = (n.body||'').replace(/[#*`]/g,'').slice(0,200); return `<div class="list-item" style="flex-direction:column; align-items:flex-start; padding:14px;"><div style="display:flex; width:100%; gap:8px; align-items:flex-start;"><div class="grow"><div style="font-weight:600;">${LC.esc(n.title||'Untitled')}</div><div class="card-sub">${n.date||''} ${n.cell?'· '+LC.esc(n.cell):''} ${n.tags?'· '+LC.esc(n.tags):''}</div></div><div style="display:flex; gap:4px;"><button class="btn btn-sm" data-edit="${n.id}">✏️</button><button class="btn btn-sm" data-exp="${n.id}">⤓</button><button class="btn btn-sm" data-del="${n.id}">🗑</button></div></div><div style="margin-top:8px; font-size:13px; color:var(--text-soft); white-space:pre-wrap;">${LC.esc(preview)}${preview.length>=200?'…':''}</div></div>`; }).join('');
      host.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => { const n = LC.State.notebook.find(x => x.id === b.dataset.edit); if (!n) return; editing = n.id; root.querySelector('#nTitle').value = n.title; root.querySelector('#nDate').value = n.date; root.querySelector('#nTags').value = n.tags; root.querySelector('#nCell').value = n.cell; root.querySelector('#nBody').value = n.body; root.querySelector('#nFormTitle').textContent = '✏️ Editing entry'; root.querySelector('#nCancel').style.display = ''; window.scrollTo(0, 0); }));
      host.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => { if (!confirm('Delete this entry?')) return; LC.State.notebook = LC.State.notebook.filter(x => x.id !== b.dataset.del); LC.saveNotebook(); render(root.querySelector('#nSearch').value); }));
      host.querySelectorAll('[data-exp]').forEach(b => b.addEventListener('click', () => { const n = LC.State.notebook.find(x => x.id === b.dataset.exp); if (!n) return; const md = `# ${n.title}\n\nDate: ${n.date}\nSample: ${n.cell}\nTags: ${n.tags}\n\n${n.body}\n`; const blob = new Blob([md], { type: 'text/markdown' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${(n.title||'entry').replace(/[^a-z0-9]+/gi,'-')}-${n.date||''}.md`; a.click(); URL.revokeObjectURL(url); }));
    }
    function reset() { editing = null; root.querySelector('#nTitle').value = ''; root.querySelector('#nTags').value = ''; root.querySelector('#nCell').value = ''; root.querySelector('#nBody').value = ''; root.querySelector('#nDate').value = new Date().toISOString().slice(0, 10); root.querySelector('#nFormTitle').textContent = '+ New entry'; root.querySelector('#nCancel').style.display = 'none'; }
    root.querySelector('#nDate').value = new Date().toISOString().slice(0, 10);
    root.querySelector('#nSave').addEventListener('click', () => { const entry = { id: editing || LC.uid(), title: root.querySelector('#nTitle').value.trim(), date: root.querySelector('#nDate').value, tags: root.querySelector('#nTags').value.trim(), cell: root.querySelector('#nCell').value.trim(), body: root.querySelector('#nBody').value, updated: new Date().toISOString() }; if (editing) { const i = LC.State.notebook.findIndex(x => x.id === editing); if (i >= 0) LC.State.notebook[i] = { ...LC.State.notebook[i], ...entry }; } else { LC.State.notebook.unshift(entry); } LC.saveNotebook(); reset(); LC.toast('Saved', 'success'); render(root.querySelector('#nSearch').value); });
    root.querySelector('#nCancel').addEventListener('click', reset);
    root.querySelector('#nSearch').addEventListener('input', e => render(e.target.value));
    root.querySelector('#nTpl').addEventListener('change', () => {
      const tpl = root.querySelector('#nTpl').value;
      const templates = {
        wb: { title: 'Western Blot: ', tags: 'WB', body: 'Aim: Detect [protein] in [samples].\n\nSamples: [cell line / tissue], [treatment]\n\nGel: [%] SDS-PAGE\nTransfer: [wet/semi-dry], [V], [min]\nPrimary Ab: [name], [dilution], [incubation]\nSecondary Ab: [HRP/AP], [dilution]\nDetection: ECL, [exposure time]\n\nResults:\n\nConclusions:' },
        icc: { title: 'ICC: ', tags: 'ICC, IF', body: 'Aim: Localize [protein] in [cell line].\n\nFixation: [4% PFA / MeOH], [time] RT\nPermeabilization: [% Triton / saponin], [time]\nBlocking: [% BSA / serum], [time]\nPrimary Ab: [name], [dilution], [incubation]\nSecondary Ab: [Alexa Fluor], [dilution]\nMounting: [ProLong / Fluoromount] + DAPI\n\nImaging: [confocal / widefield], [obj lens]\n\nResults:\n\nConclusions:' },
        ip: { title: 'IP: ', tags: 'IP, Co-IP', body: 'Aim: Immunoprecipitate [bait] and detect [prey].\n\nLysate: [cell line], [treatment], [lysis buffer]\nInput: [µg] total protein\nIP Ab: [name], [µg/IP]\nBeads: Protein [A/G], [volume]\nWashes: [buffer], [number]×\n\nWB detection:\nBait: [verified], [input %]\nCo-IP: [detected / not detected]\nIgG control: [clean / band]\n\nResults:\n\nConclusions:' },
        qpcr: { title: 'qPCR: ', tags: 'qPCR', body: 'Aim: Quantify [gene] expression in [samples].\n\nRNA extraction: [TRIzol / kit], [date]\ncDNA: [RT kit], [input ng]\nPrimers: [Fwd seq], [Rev seq]\nMaster mix: [SYBR / TaqMan], [vol]\nCycler: [instrument], [program]\nHK gene: [GAPDH / β-actin / B2M]\n\nΔΔCt analysis:\n[table or attach file]\n\nResults:\n\nConclusions:' },
        viab: { title: 'Viability: ', tags: 'viability, MTT', body: 'Aim: Test [compound] cytotoxicity in [cell line].\n\nPlate: [format], [cells/well], [media]\nTreatment: [concentrations], [duration]\nAssay: [MTT / CTG / SRB], [protocol]\nReadout: [instrument], [wavelength]\n\nResults:\n% Viability at each dose:\n\nIC50: [calculated]\n\nConclusions:' },
        clone: { title: 'Cloning: ', tags: 'cloning', body: 'Aim: Clone [gene] into [vector].\n\nVector: [name], [selection marker]\nInsert: [gene], [source cDNA / gBlock]\nPCR: [primers], [template], [conditions]\nDigestion: [enzymes], [site 1], [site 2]\nLigation: [vector:insert ratio], [enzyme]\nTransformation: [strain], [selection]\n\nColony PCR: [pos/total]\nSequencing: [confirmed / pending]\n\nNotes:' },
      };
      if (templates[tpl]) {
        const t = templates[tpl];
        root.querySelector('#nTitle').value = t.title;
        root.querySelector('#nTags').value = t.tags;
        root.querySelector('#nBody').value = t.body;
      }
    });
    render(''); return root;
  });
})();
