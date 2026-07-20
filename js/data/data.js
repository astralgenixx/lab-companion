/* ============================================
   Lab Companion — Reference Data
   Cancer biology buffers, cell lines, protocols
   ============================================ */

(function () {
  'use strict';

  const DATA = {

    timerPresets: [
      { label: '30 sec', sec: 30 },
      { label: '1 min', sec: 60 },
      { label: '2 min', sec: 120 },
      { label: '5 min', sec: 300 },
      { label: '10 min', sec: 600 },
      { label: '15 min', sec: 900 },
      { label: '30 min', sec: 1800 },
      { label: '45 min', sec: 2700 },
      { label: '1 hour', sec: 3600 },
      { label: '2 hours', sec: 7200 },
      { label: '4 hours', sec: 14400 },
      { label: 'Overnight', sec: 57600 },
    ],

    bufferRecipes: [
      { name: 'PBS (10×)', volume: '1 L', ingredients: [
        { i: 'NaCl', a: 80, u: 'g' }, { i: 'KCl', a: 2, u: 'g' },
        { i: 'Na₂HPO₄·7H₂O', a: 14.4, u: 'g' }, { i: 'KH₂PO₄', a: 2.4, u: 'g' }
      ], ph: '7.4', notes: 'Autoclave. Dilute 1:10 for 1×.' },
      { name: 'TBS (10×)', volume: '1 L', ingredients: [
        { i: 'Tris base', a: 24.2, u: 'g' }, { i: 'NaCl', a: 87.6, u: 'g' }
      ], ph: '7.6', notes: 'Adjust pH with HCl. Autoclave.' },
      { name: 'TBST (1×)', volume: '1 L', ingredients: [
        { i: 'TBS 10×', a: 100, u: 'mL' }, { i: 'Tween-20', a: 1, u: 'mL' },
        { i: 'dH₂O', a: 899, u: 'mL' }
      ], ph: '7.6', notes: 'Mix well. Store at RT.' },
      { name: 'TAE (50×)', volume: '1 L', ingredients: [
        { i: 'Tris base', a: 242, u: 'g' }, { i: 'Glacial acetic acid', a: 57.1, u: 'mL' },
        { i: '0.5 M EDTA (pH 8)', a: 100, u: 'mL' }
      ], ph: '~8.3', notes: 'Dilute to 1× for running agarose gels.' },
      { name: 'TBE (10×)', volume: '1 L', ingredients: [
        { i: 'Tris base', a: 108, u: 'g' }, { i: 'Boric acid', a: 55, u: 'g' },
        { i: '0.5 M EDTA (pH 8)', a: 40, u: 'mL' }
      ], ph: '~8.3', notes: 'Better resolution for small DNA (<1 kb).' },
      { name: 'Laemmli buffer (4×)', volume: '10 mL', ingredients: [
        { i: '1 M Tris-HCl pH 6.8', a: 2.5, u: 'mL' }, { i: 'Glycerol', a: 4, u: 'mL' },
        { i: 'SDS', a: 0.8, u: 'g' }, { i: 'β-mercaptoethanol', a: 1, u: 'mL' },
        { i: 'Bromophenol blue', a: 4, u: 'mg' }
      ], ph: '6.8', notes: 'Add β-ME fresh. Store at -20°C.' },
      { name: 'SDS-PAGE Running buffer (10×)', volume: '1 L', ingredients: [
        { i: 'Tris base', a: 30.3, u: 'g' }, { i: 'Glycine', a: 144, u: 'g' },
        { i: 'SDS', a: 10, u: 'g' }
      ], ph: '8.3', notes: 'Do NOT adjust pH. Dilute to 1×.' },
      { name: 'Transfer buffer (Towbin)', volume: '1 L', ingredients: [
        { i: 'Tris base', a: 3.03, u: 'g' }, { i: 'Glycine', a: 14.4, u: 'g' },
        { i: 'Methanol', a: 200, u: 'mL' }
      ], ph: '~8.3', notes: 'Add 0.01-0.05% SDS for large proteins.' },
      { name: 'RIPA lysis buffer', volume: '100 mL', ingredients: [
        { i: '1 M Tris-HCl pH 7.5', a: 5, u: 'mL' }, { i: '5 M NaCl', a: 3, u: 'mL' },
        { i: '0.5 M EDTA', a: 0.2, u: 'mL' }, { i: 'NP-40', a: 1, u: 'mL' },
        { i: '10% SDS', a: 1, u: 'mL' }, { i: 'Sodium deoxycholate', a: 0.5, u: 'g' }
      ], ph: '7.5', notes: 'Add protease/phosphatase inhibitors fresh.' },
      { name: 'Coomassie stain', volume: '100 mL', ingredients: [
        { i: 'Coomassie R-250', a: 0.1, u: 'g' }, { i: 'Methanol', a: 50, u: 'mL' },
        { i: 'Acetic acid', a: 10, u: 'mL' }, { i: 'dH₂O', a: 40, u: 'mL' }
      ], ph: '—', notes: 'Cover tray. Reusable.' },
      { name: 'Destain', volume: '1 L', ingredients: [
        { i: 'Methanol', a: 100, u: 'mL' }, { i: 'Acetic acid', a: 100, u: 'mL' },
        { i: 'dH₂O', a: 800, u: 'mL' }
      ], ph: '—', notes: '' },
      { name: 'Stripping buffer', volume: '100 mL', ingredients: [
        { i: 'Glycine', a: 1.5, u: 'g' }, { i: 'SDS', a: 1, u: 'g' },
        { i: 'Tween-20', a: 1, u: 'mL' }
      ], ph: '2.2', notes: 'Adjust pH. Heat to 50°C before use.' },
      { name: 'Blocking buffer (WB)', volume: '50 mL', ingredients: [
        { i: 'Non-fat dry milk', a: 2.5, u: 'g' }, { i: 'TBST 1×', a: 50, u: 'mL' }
      ], ph: '—', notes: '5% milk/TBST. Use BSA 5% for phospho-proteins.' },
      { name: 'LB medium', volume: '1 L', ingredients: [
        { i: 'Tryptone', a: 10, u: 'g' }, { i: 'Yeast extract', a: 5, u: 'g' },
        { i: 'NaCl', a: 10, u: 'g' }
      ], ph: '7.0', notes: 'Autoclave. +1.5% agar for plates.' },
    ],

    cellLines: [
      { name: 'HeLa', tissue: 'Cervix', origin: 'Cervical adenocarcinoma', media: 'DMEM', supplements: '10% FBS, 1% P/S', doubling: 23, adherence: 'Adherent', biosafety: 'BSL-2' },
      { name: 'MCF-7', tissue: 'Breast', origin: 'Ductal carcinoma (ER+)', media: 'DMEM', supplements: '10% FBS, 1% P/S, 0.01 mg/mL insulin', doubling: 29, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'MDA-MB-231', tissue: 'Breast', origin: 'Adenocarcinoma (TNBC)', media: 'DMEM', supplements: '10% FBS, 1% P/S', doubling: 26, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'A549', tissue: 'Lung', origin: 'Carcinoma', media: 'DMEM', supplements: '10% FBS, 1% P/S', doubling: 22, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'HCT116', tissue: 'Colon', origin: 'Colorectal carcinoma', media: 'DMEM', supplements: '10% FBS, 1% P/S', doubling: 21, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'U87 MG', tissue: 'Brain', origin: 'Glioblastoma', media: 'DMEM', supplements: '10% FBS, 1% P/S, NEAA, sodium pyruvate', doubling: 34, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'PC-3', tissue: 'Prostate', origin: 'Adenocarcinoma (bone met)', media: 'RPMI-1640', supplements: '10% FBS, 1% P/S', doubling: 33, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'DU145', tissue: 'Prostate', origin: 'Carcinoma (brain met)', media: 'RPMI-1640', supplements: '10% FBS, 1% P/S', doubling: 27, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'K562', tissue: 'Bone marrow', origin: 'CML (blast crisis)', media: 'RPMI-1640', supplements: '10% FBS, 1% P/S', doubling: 24, adherence: 'Suspension', biosafety: 'BSL-1' },
      { name: 'Jurkat', tissue: 'Blood', origin: 'T-cell leukemia', media: 'RPMI-1640', supplements: '10% FBS, 1% P/S', doubling: 25, adherence: 'Suspension', biosafety: 'BSL-1' },
      { name: 'SKOV3', tissue: 'Ovary', origin: 'Adenocarcinoma', media: 'McCoy\'s 5A', supplements: '10% FBS, 1% P/S', doubling: 30, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'PANC-1', tissue: 'Pancreas', origin: 'Ductal adenocarcinoma', media: 'DMEM', supplements: '10% FBS, 1% P/S', doubling: 38, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'HepG2', tissue: 'Liver', origin: 'Hepatocellular carcinoma', media: 'DMEM', supplements: '10% FBS, 1% P/S', doubling: 28, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'MDA-MB-468', tissue: 'Breast', origin: 'Adenocarcinoma (TNBC)', media: 'DMEM', supplements: '10% FBS, 1% P/S', doubling: 32, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'HT-29', tissue: 'Colon', origin: 'Colorectal adenocarcinoma', media: 'McCoy\'s 5A', supplements: '10% FBS, 1% P/S', doubling: 24, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'SW480', tissue: 'Colon', origin: 'Colorectal adenocarcinoma', media: 'DMEM', supplements: '10% FBS, 1% P/S', doubling: 20, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'BT-474', tissue: 'Breast', origin: 'Ductal carcinoma (HER2+)', media: 'RPMI-1640', supplements: '10% FBS, 1% P/S, 10 µg/mL insulin', doubling: 40, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'SK-BR-3', tissue: 'Breast', origin: 'Adenocarcinoma (HER2+)', media: 'McCoy\'s 5A', supplements: '10% FBS, 1% P/S', doubling: 36, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'U2OS', tissue: 'Bone', origin: 'Osteosarcoma', media: 'DMEM', supplements: '10% FBS, 1% P/S', doubling: 24, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'Saos-2', tissue: 'Bone', origin: 'Osteosarcoma', media: 'McCoy\'s 5A', supplements: '15% FBS, 1% P/S', doubling: 36, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'LN-229', tissue: 'Brain', origin: 'Glioblastoma', media: 'DMEM', supplements: '5% FBS, 1% P/S', doubling: 31, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'T98G', tissue: 'Brain', origin: 'Glioblastoma multiforme', media: 'DMEM', supplements: '10% FBS, 1% P/S, NEAA', doubling: 45, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'THP-1', tissue: 'Blood', origin: 'Acute monocytic leukemia', media: 'RPMI-1640', supplements: '10% FBS, 1% P/S, 0.05 mM β-ME', doubling: 26, adherence: 'Suspension', biosafety: 'BSL-1' },
      { name: 'RAW 264.7', tissue: 'Blood', origin: 'Mouse macrophage (Abelson)', media: 'DMEM', supplements: '10% FBS, 1% P/S', doubling: 14, adherence: 'Semi-adherent', biosafety: 'BSL-1' },
      { name: 'NIH/3T3', tissue: 'Embryo', origin: 'Mouse fibroblast', media: 'DMEM', supplements: '10% CS, 1% P/S', doubling: 20, adherence: 'Adherent', biosafety: 'BSL-1' },
      { name: 'HEK293T', tissue: 'Kidney', origin: 'Human embryonic kidney (SV40)', media: 'DMEM', supplements: '10% FBS, 1% P/S', doubling: 18, adherence: 'Adherent', biosafety: 'BSL-1' },
    ],

    transferPresets: [
      { method: 'Wet (small proteins <30 kDa)', volt: '100', time: 45, notes: 'PVDF preferred. Pre-wet with MeOH.' },
      { method: 'Wet (30-100 kDa)', volt: '100', time: 60, notes: 'Cold room or ice pack. Standard for most.' },
      { method: 'Wet (100-200 kDa)', volt: '100', time: 90, notes: 'Add 0.01% SDS to transfer buffer.' },
      { method: 'Wet (>200 kDa)', volt: '30', time: 300, notes: 'O/N 30V cold. Add 0.05% SDS.' },
      { method: 'Semi-dry (standard)', volt: '15-25', time: 30, notes: 'Constant current ~1 mA/cm². Pre-soak filter.' },
      { method: 'Semi-dry (<30 kDa)', volt: '15', time: 15, notes: 'Short time to avoid blow-through.' },
    ],

    antibodyDilutions: {
      'Western Blot': { 'Primary antibody': '1:500 – 1:5000', 'Secondary-HRP': '1:5000 – 1:20000', 'Loading control (β-actin, GAPDH)': '1:5000 – 1:20000', 'Housekeeping (tubulin, vinculin)': '1:2000 – 1:10000' },
      'ICC / IF': { 'Primary antibody': '1:50 – 1:500', 'Alexa Fluor secondary': '1:200 – 1:1000', 'DAPI': '1 µg/mL (1:1000 of 1 mg/mL)' },
      'IHC (FFPE)': { 'Primary antibody': '1:50 – 1:500', 'HRP-polymer secondary': 'Ready-to-use', 'Hematoxylin': 'Ready-to-use, 1-3 min' },
      'Flow Cytometry': { 'Primary antibody': '1:50 – 1:200', 'Fluorophore secondary': '1:200 – 1:500', 'Viability dye (e.g. DAPI, 7-AAD)': '1:1000' },
      'ELISA': { 'Capture antibody': '1:200 – 1:1000', 'Detection antibody': '1:200 – 1:2000', 'Streptavidin-HRP': '1:200 – 1:1000' },
    },

    dnaLadder: [
      { bp: 10000, label: '10 kb' }, { bp: 8000, label: '8 kb' }, { bp: 6000, label: '6 kb' }, { bp: 5000, label: '5 kb' }, { bp: 4000, label: '4 kb' }, { bp: 3000, label: '3 kb' }, { bp: 2500, label: '2.5 kb' }, { bp: 2000, label: '2 kb' }, { bp: 1500, label: '1.5 kb' }, { bp: 1000, label: '1 kb' }, { bp: 750, label: '750 bp' }, { bp: 500, label: '500 bp' }, { bp: 250, label: '250 bp' }
    ],

    pcrRecipes: [
      { name: 'Standard 25 µL', final: 25, reagents: [
        { i: '2× Master Mix (e.g. GoTaq)', a: 12.5, u: 'µL' }, { i: 'Forward primer (10 µM)', a: 1, u: 'µL' },
        { i: 'Reverse primer (10 µM)', a: 1, u: 'µL' }, { i: 'Template DNA', a: 1, u: 'µL' },
        { i: 'Nuclease-free H₂O', a: 9.5, u: 'µL' }
      ]},
      { name: 'Standard 50 µL', final: 50, reagents: [
        { i: '2× Master Mix', a: 25, u: 'µL' }, { i: 'Forward primer (10 µM)', a: 2, u: 'µL' },
        { i: 'Reverse primer (10 µM)', a: 2, u: 'µL' }, { i: 'Template DNA', a: 2, u: 'µL' },
        { i: 'Nuclease-free H₂O', a: 19, u: 'µL' }
      ]},
      { name: 'qPCR 10 µL (SYBR)', final: 10, reagents: [
        { i: '2× SYBR Green MM', a: 5, u: 'µL' }, { i: 'Forward primer (10 µM)', a: 0.4, u: 'µL' },
        { i: 'Reverse primer (10 µM)', a: 0.4, u: 'µL' }, { i: 'cDNA (1:10)', a: 1, u: 'µL' },
        { i: 'Nuclease-free H₂O', a: 3.2, u: 'µL' }
      ]},
      { name: 'qPCR 20 µL (SYBR)', final: 20, reagents: [
        { i: '2× SYBR Green MM', a: 10, u: 'µL' }, { i: 'Forward primer (10 µM)', a: 0.8, u: 'µL' },
        { i: 'Reverse primer (10 µM)', a: 0.8, u: 'µL' }, { i: 'cDNA (1:10)', a: 2, u: 'µL' },
        { i: 'Nuclease-free H₂O', a: 6.4, u: 'µL' }
      ]},
    ],

    drugs: [
      { name: 'Doxorubicin', class: 'Anthracycline', target: 'Topoisomerase II / DNA intercalation', pathway: 'DNA damage response', mw: 543.5, solvent: 'H₂O / DMSO', stockConc: '10 mM in DMSO', workingConc: '0.1 – 10 µM', notes: 'Red fluorescent. Light sensitive. Store -20°C.' },
      { name: 'Cisplatin', class: 'Platinum', target: 'DNA crosslinking', pathway: 'DNA damage / apoptosis', mw: 300.0, solvent: 'DMF or saline', stockConc: '3.3 mM in DMF', workingConc: '1 – 100 µM', notes: 'Use fresh. Prepare in dark. Reactive with nucleophiles.' },
      { name: 'Paclitaxel', class: 'Taxane', target: 'Microtubule stabilization', pathway: 'Mitotic arrest', mw: 853.9, solvent: 'DMSO', stockConc: '10 mM', workingConc: '1 – 100 nM', notes: 'Store -20°C. Insoluble in water.' },
      { name: '5-Fluorouracil (5-FU)', class: 'Antimetabolite', target: 'Thymidylate synthase', pathway: 'Pyrimidine synthesis', mw: 130.1, solvent: 'DMSO / H₂O', stockConc: '50 mM in DMSO', workingConc: '1 – 50 µM', notes: 'Store at RT.' },
      { name: 'Etoposide', class: 'Podophyllotoxin', target: 'Topoisomerase II', pathway: 'DNA damage', mw: 588.6, solvent: 'DMSO', stockConc: '50 mM', workingConc: '1 – 100 µM', notes: 'Store -20°C.' },
      { name: 'Gemcitabine', class: 'Antimetabolite', target: 'Ribonucleotide reductase', pathway: 'DNA synthesis', mw: 263.2, solvent: 'H₂O / PBS', stockConc: '10 mM in PBS', workingConc: '10 – 100 nM', notes: 'Store -20°C.' },
      { name: 'Nutlin-3a', class: 'MDM2 inhibitor', target: 'MDM2-p53 interaction', pathway: 'p53', mw: 581.5, solvent: 'DMSO', stockConc: '10 mM', workingConc: '1 – 30 µM', notes: 'Only effective in p53 WT cells. Store -20°C.' },
      { name: 'MG-132', class: 'Proteasome inhibitor', target: '26S proteasome', pathway: 'Ubiquitin-proteasome', mw: 475.6, solvent: 'DMSO', stockConc: '10 mM', workingConc: '1 – 20 µM', notes: 'Short half-life in solution. Add fresh.' },
      { name: 'Bortezomib (Velcade)', class: 'Proteasome inhibitor', target: '26S proteasome (β5)', pathway: 'Ubiquitin-proteasome / NF-κB', mw: 384.2, solvent: 'DMSO', stockConc: '10 mM', workingConc: '5 – 100 nM', notes: 'Clinical proteasome inhibitor.' },
      { name: 'Staurosporine', class: 'Kinase inhibitor', target: 'Broad-spectrum kinases', pathway: 'Apoptosis', mw: 466.5, solvent: 'DMSO', stockConc: '1 mM', workingConc: '0.1 – 1 µM', notes: 'Potent apoptosis inducer. Light sensitive.' },
      { name: 'Rapamycin', class: 'mTOR inhibitor', target: 'mTORC1', pathway: 'PI3K/AKT/mTOR', mw: 914.2, solvent: 'DMSO', stockConc: '1 mM', workingConc: '10 – 100 nM', notes: 'Immunosuppressant. Store -20°C.' },
      { name: 'Torin 1', class: 'mTOR inhibitor', target: 'mTORC1/C2 (ATP-competitive)', pathway: 'PI3K/AKT/mTOR', mw: 607.6, solvent: 'DMSO', stockConc: '1 mM', workingConc: '50 – 250 nM', notes: 'More complete mTOR inhibition vs rapamycin.' },
      { name: 'LY294002', class: 'PI3K inhibitor', target: 'PI3K', pathway: 'PI3K/AKT', mw: 343.8, solvent: 'DMSO', stockConc: '10 mM', workingConc: '10 – 50 µM', notes: 'Reversible. Competes with ATP.' },
      { name: 'U0126', class: 'MEK inhibitor', target: 'MEK1/2', pathway: 'MAPK/ERK', mw: 426.5, solvent: 'DMSO', stockConc: '10 mM', workingConc: '1 – 10 µM', notes: 'Store -20°C. Protect from light.' },
      { name: 'PD98059', class: 'MEK inhibitor', target: 'MEK1', pathway: 'MAPK/ERK', mw: 267.3, solvent: 'DMSO', stockConc: '20 mM', workingConc: '10 – 50 µM', notes: 'Inhibits MEK activation (not activity).' },
      { name: 'SP600125', class: 'JNK inhibitor', target: 'JNK1/2/3', pathway: 'JNK/SAPK', mw: 220.2, solvent: 'DMSO', stockConc: '20 mM', workingConc: '10 – 50 µM', notes: 'ATP-competitive.' },
      { name: 'SB203580', class: 'p38 inhibitor', target: 'p38 MAPK', pathway: 'p38 MAPK', mw: 377.4, solvent: 'DMSO', stockConc: '10 mM', workingConc: '1 – 10 µM', notes: 'Do not use for COX inhibition studies.' },
      { name: 'Z-VAD-FMK', class: 'Caspase inhibitor', target: 'Pan-caspase', pathway: 'Apoptosis', mw: 467.5, solvent: 'DMSO', stockConc: '20 mM', workingConc: '10 – 100 µM', notes: 'Broad caspase inhibitor. Pre-treat 1-2 h.' },
      { name: 'Necrostatin-1', class: 'RIPK1 inhibitor', target: 'RIPK1', pathway: 'Necroptosis', mw: 259.2, solvent: 'DMSO', stockConc: '10 mM', workingConc: '10 – 50 µM', notes: 'Inhibits necroptosis. Store -20°C.' },
      { name: 'Chloroquine', class: 'Autophagy inhibitor', target: 'Lysosomal acidification', pathway: 'Autophagy', mw: 319.9, solvent: 'H₂O', stockConc: '50 mM in H₂O', workingConc: '10 – 50 µM', notes: 'Inhibits autophagic flux. Also used as anti-malarial.' },
      { name: 'Bafilomycin A1', class: 'V-ATPase inhibitor', target: 'Vacuolar H⁺ ATPase', pathway: 'Autophagy', mw: 622.8, solvent: 'DMSO', stockConc: '0.1 mM', workingConc: '50 – 200 nM', notes: 'Potent autophagy flux inhibitor.' },
      { name: 'Cycloheximide (CHX)', class: 'Translation inhibitor', target: 'Ribosome (80S)', pathway: 'Protein synthesis', mw: 281.4, solvent: 'DMSO / EtOH', stockConc: '10 mg/mL', workingConc: '10 – 100 µg/mL', notes: 'Used in CHX chase assays for half-life.' },
      { name: 'Actinomycin D', class: 'Transcription inhibitor', target: 'RNA polymerase I/II', pathway: 'Transcription', mw: 1255.4, solvent: 'DMSO', stockConc: '1 mg/mL', workingConc: '0.1 – 5 µg/mL', notes: 'Intercalates DNA. Potent, use with care.' },
      { name: 'H₂O₂', class: 'Oxidative stress', target: 'ROS generation', pathway: 'Oxidative stress', mw: 34.0, solvent: 'H₂O / PBS', stockConc: '30% (~10 M)', workingConc: '50 – 500 µM', notes: 'Prepare fresh. Light sensitive.' },
      { name: 'Tunicamycin', class: 'ER stress', target: 'N-linked glycosylation', pathway: 'UPR / ER stress', mw: 830.9, solvent: 'DMSO', stockConc: '5 mg/mL', workingConc: '0.5 – 5 µg/mL', notes: 'Induces ER stress via UPR activation.' },
      { name: 'Thapsigargin', class: 'SERCA inhibitor', target: 'SERCA pump', pathway: 'ER stress / Ca²⁺', mw: 650.8, solvent: 'DMSO', stockConc: '1 mM', workingConc: '0.1 – 1 µM', notes: 'Depletes ER Ca²⁺ stores.' },
      { name: 'Olaparib', class: 'PARP inhibitor', target: 'PARP1/2', pathway: 'DNA repair', mw: 434.5, solvent: 'DMSO', stockConc: '10 mM', workingConc: '0.1 – 10 µM', notes: 'Synthetic lethal in BRCA-mutant cells.' },
      { name: 'NU7441', class: 'DNA-PK inhibitor', target: 'DNA-PKcs', pathway: 'NHEJ / DNA repair', mw: 413.4, solvent: 'DMSO', stockConc: '10 mM', workingConc: '1 – 10 µM', notes: 'Potent and selective DNA-PK inhibitor.' },
      { name: 'YM155 (Sepantronium)', class: 'Survivin inhibitor', target: 'Survivin', pathway: 'Apoptosis', mw: 493.5, solvent: 'DMSO', stockConc: '10 mM', workingConc: '1 – 100 nM', notes: 'Suppresses survivin expression.' },
    ],

    antibiotics: [
      { name: 'Puromycin', class: 'Aminonucleoside', target: 'Ribosome', resistance: 'PuroR (pac gene)', concBacteria: '50-100 µg/mL', concMammalian: '1-10 µg/mL', killTime: '24-48 h', notes: 'Most common mammalian selection marker.' },
      { name: 'G418 (Geneticin)', class: 'Aminoglycoside', target: 'Ribosome', resistance: 'NeoR/KanR (neo gene)', concBacteria: '50 µg/mL', concMammalian: '200-1000 µg/mL', killTime: '48-72 h', notes: 'Common for stable cell line generation. Titrate per cell line.' },
      { name: 'Hygromycin B', class: 'Aminoglycoside', target: 'Ribosome', resistance: 'HygR (hph gene)', concBacteria: '100-200 µg/mL', concMammalian: '50-500 µg/mL', killTime: '48-96 h', notes: 'Fast kill. Good for double selection.' },
      { name: 'Blasticidin S', class: 'Nucleoside', target: 'Ribosome', resistance: 'BsdR (bsd gene)', concBacteria: '50-100 µg/mL', concMammalian: '2-20 µg/mL', killTime: '24-48 h', notes: 'Fastest kill. Good for rapid selection.' },
      { name: 'Zeocin', class: 'Glycopeptide', target: 'DNA', resistance: 'ZeoR (Sh ble gene)', concBacteria: '25-50 µg/mL', concMammalian: '50-400 µg/mL', killTime: '48-96 h', notes: 'Intercalates DNA. Works in bacteria and mammalian cells.' },
      { name: 'Ampicillin', class: 'β-Lactam', target: 'Cell wall', resistance: 'AmpR (bla gene)', concBacteria: '100 µg/mL', concMammalian: 'N/A', killTime: 'N/A', notes: 'Bacterial selection only.' },
      { name: 'Kanamycin', class: 'Aminoglycoside', target: 'Ribosome', resistance: 'KanR/NeoR', concBacteria: '50 µg/mL', concMammalian: 'N/A', killTime: 'N/A', notes: 'Bacterial selection. Same resistance gene as G418.' },
    ],

    transfectionReagents: [
      { name: 'Lipofectamine 3000', type: 'Lipid nanoparticle', cellTypes: 'Most adherent & suspension cells', efficiency: 'High', toxicity: 'Low', notes: 'Use Opti-MEM for complex formation. 2-4 µL reagent per µg DNA.' },
      { name: 'Lipofectamine RNAiMAX', type: 'Lipid nanoparticle', cellTypes: 'Most cell types for siRNA', efficiency: 'Very high', toxicity: 'Very low', notes: 'Designed for siRNA. Very low working volume.' },
      { name: 'Polyethylenimine (PEI)', type: 'Cationic polymer', cellTypes: 'HEK293T, HeLa, CHO (adherent)', efficiency: 'Medium-high', toxicity: 'Medium', notes: 'Cost-effective for large-scale production. 3:1 PEI:DNA ratio.' },
      { name: 'FuGENE HD', type: 'Non-liposomal lipid', cellTypes: 'Broad spectrum (serum compatible)', efficiency: 'High', toxicity: 'Very low', notes: 'Works in serum-containing media. Good for hard-to-transfect cells.' },
      { name: 'Calcium phosphate', type: 'Chemical precipitation', cellTypes: 'HEK293T, HeLa', efficiency: 'Medium', toxicity: 'Low', notes: 'Very low cost. Requires careful pH and timing.' },
      { name: 'ViaFect', type: 'Lipid-based', cellTypes: 'Broad spectrum', efficiency: 'High', toxicity: 'Low', notes: 'Works with serum. Simple protocol: add reagent to DNA+media.' },
      { name: 'JetPEI', type: 'Cationic polymer', cellTypes: 'Adherent & suspension', efficiency: 'High', toxicity: 'Low-medium', notes: 'Scalable. Good for AAV/lentivirus production.' },
      { name: 'Nucleofection (Lonza)', type: 'Electroporation', cellTypes: 'All (program-dependent)', efficiency: 'Very high', toxicity: 'Medium', notes: 'Needs specific kit + Nucleofector device. Good for primary cells.' },
      { name: 'Neon Transfection', type: 'Electroporation', cellTypes: 'All (pipette tip format)', efficiency: 'Very high', toxicity: 'Low-medium', notes: 'Open-format electroporation. Use 10 µL or 100 µL tips.' },
    ],

    protocols: [
      { cat: 'Protein', title: 'Whole Cell Lysate Preparation (RIPA)', steps: [
        'Wash cells 2× with ice-cold PBS',
        'Add ice-cold RIPA buffer + PI cocktail (100 µL per 10⁶ cells or 500 µL per 10 cm dish)',
        'Scrape cells, transfer to pre-chilled 1.5 mL tube',
        'Incubate on ice 30 min, vortex every 10 min',
        'Centrifuge 14,000g × 15 min at 4°C',
        'Transfer supernatant to new tube (= lysate)',
        'Quantify protein (BCA / Bradford). Aliquot. Store -80°C.'
      ], notes: 'Keep everything cold. Add phosphatase inhibitors for phospho-detection.' },
      { cat: 'Protein', title: 'BCA Protein Assay', steps: [
        'Prepare BSA standards (0, 0.1, 0.2, 0.5, 1.0, 2.0 mg/mL) in same buffer as samples',
        'Dilute unknown samples (e.g. 1:10 in H₂O)',
        'Pipette 10 µL standard/sample + 200 µL BCA working reagent per well (96-well plate)',
        'Incubate 30 min at 37°C',
        'Read A562. Plot standard curve. Calculate sample concentration.'
      ], notes: 'Working reagent = 50:1 Reagent A:B. Linear range: 0.02–2.0 mg/mL.' },
      { cat: 'Protein', title: 'Immunoprecipitation (IP)', steps: [
        'Pre-clear lysate: add 30 µL Protein A/G beads, rotate 1 h at 4°C. Discard beads.',
        'Add primary antibody (1-5 µg per 500 µg lysate), rotate O/N at 4°C',
        'Add 40 µL Protein A/G beads, rotate 2-4 h at 4°C',
        'Spin 2,000g × 2 min at 4°C. Keep beads.',
        'Wash 3× with lysis buffer (no detergents in last wash)',
        'Add 30-40 µL 2× Laemmli buffer. Boil 5 min at 95°C.',
        'Spin briefly. Load supernatant on SDS-PAGE.'
      ], notes: 'Include IgG control (same species, same amount). 10% input = load 50 µg lysate directly.' },
      { cat: 'RNA/DNA', title: 'RNA Extraction (TRIzol)', steps: [
        'Wash cells 1× PBS. Add 1 mL TRIzol per 10 cm dish. Scrape.',
        'Incubate 5 min at RT. Add 200 µL chloroform. Shake 15 sec.',
        'Incubate 3 min at RT. Centrifuge 12,000g × 15 min at 4°C.',
        'Transfer upper aqueous phase to new tube (~400-500 µL)',
        'Add 500 µL isopropanol. Incubate 10 min at RT.',
        'Centrifuge 12,000g × 10 min at 4°C. Discard supernatant.',
        'Wash pellet with 1 mL 75% EtOH. Centrifuge 7,500g × 5 min.',
        'Air-dry 5-10 min. Resuspend in 30-50 µL DEPC-treated H₂O.',
        'Measure A260/A280. Store at -80°C.'
      ], notes: 'Work in RNase-free hood. Use filter tips. All steps at 4°C where possible.' },
      { cat: 'RNA/DNA', title: 'cDNA Synthesis', steps: [
        'Set up: RNA (1 µg) + 1 µL oligo-dT/random primers + 1 µL dNTP (10 mM) + DEPC-H₂O to 13 µL',
        'Heat 65°C × 5 min. Chill on ice 2 min.',
        'Add: 4 µL 5× First-Strand Buffer + 1 µL DTT (0.1 M) + 1 µL RNase Inhibitor + 1 µL Reverse Transcriptase (e.g. M-MLV, Superscript)',
        'Incubate: 25°C × 5 min → 42°C × 60 min → 70°C × 15 min',
        'Dilute with 80 µL H₂O (for qPCR). Store -20°C.'
      ], notes: 'Use random hexamers for total RNA. Oligo-dT for mRNA only. Include no-RT control.' },
      { cat: 'RNA/DNA', title: 'qPCR Data Analysis (ΔΔCt)', steps: [
        'Export Ct values from qPCR software. Check amplification curves for each well.',
        'Calculate ΔCt = Ct(target gene) – Ct(housekeeping gene) for each sample',
        'Calculate ΔΔCt = ΔCt(treated sample) – ΔCt(control sample)',
        'Fold change = 2^(-ΔΔCt)',
        'For statistical analysis: run t-test on ΔCt values (not fold change)',
        'Report mean ± SEM of at least 3 biological replicates'
      ], notes: 'Housekeeping: GAPDH, β-actin, 18S, or B2M. Verify HK stability under your conditions.' },
      { cat: 'Cell', title: 'Crystal Violet Proliferation Assay', steps: [
        'Seed cells in 96-well plate (500-5000 cells/well, depending on growth rate)',
        'At each time point: remove media. Wash gently with PBS.',
        'Fix with 100 µL 4% PFA or ice-cold MeOH, 10 min RT',
        'Remove fixative. Add 50 µL 0.5% crystal violet (in 25% MeOH), 10 min RT',
        'Wash plate gently under running tap water until clear. Air-dry O/N.',
        'Add 100 µL 10% acetic acid. Shake 20 min.',
        'Read A590. Plot absorbance vs time.'
      ], notes: 'Stain DNA proportionally to cell number. Can store dried plates indefinitely.' },
      { cat: 'Cell', title: 'Wound Healing / Scratch Assay', steps: [
        'Seed cells to reach ~90% confluence next day in a 6-well plate',
        'Using a sterile 200 µL tip, scratch a straight line through the monolayer across the well center',
        'Wash 2× PBS to remove detached cells. Add fresh media (± treatment).',
        'Image immediately (t=0). Mark reference points on the bottom of the plate.',
        'Image every 6-12 h at the same positions. Continue until wound closes (or up to 48 h).',
        'Analyze: measure wound width at each time point using ImageJ.'
      ], notes: 'For proliferation control: add mitomycin C (10 µg/mL, 2 h pre-scratch). Use serum-free or low-serum media if growth confounds migration.' },
      { cat: 'Cell', title: 'MTT Cell Viability Assay', steps: [
        'Seed cells in 96-well plate, treat with compounds for desired time',
        'Add 20 µL MTT (5 mg/mL in PBS) to each well (final 0.5 mg/mL). Include blank wells (media only).',
        'Incubate 3-4 h at 37°C. Purple formazan crystals form.',
        'Remove media carefully. Add 150 µL DMSO to dissolve crystals.',
        'Shake 10 min on orbital shaker (protect from light).',
        'Read A570 (reference A630). Calculate: % viability = (A570_treated / A570_control) × 100.'
      ], notes: 'MTT is light-sensitive. For suspension cells, spin plate before removing media.' },
      { cat: 'Cell', title: 'Annexin V / PI Apoptosis Assay', steps: [
        'Harvest cells (include floating cells). Wash 2× cold PBS.',
        'Resuspend in 100 µL 1× Annexin Binding Buffer at ~1×10⁶ cells/mL',
        'Add 5 µL Annexin V-FITC (or APC). Incubate 15 min RT, dark.',
        'Add 5 µL PI (or 7-AAD). Incubate 5 min.',
        'Add 400 µL Binding Buffer. Analyze by flow cytometry within 1 h.',
        'Quadrants: Q1=PI⁺/AV⁻ (necrotic), Q2=PI⁺/AV⁺ (late apoptotic), Q3=PI⁻/AV⁻ (live), Q4=PI⁻/AV⁺ (early apoptotic).'
      ], notes: 'Always include unstained, AV-only, and PI-only controls for compensation.' },
    ],

    sirnaDesign: {
      rules: [
        'Length: 19-25 nt duplex with 2-nt 3\' overhangs (usually dTdT)',
        'GC content: 30-52% (optimal ~36%)',
        'Avoid: runs of ≥4 identical bases, especially poly-G',
        'Avoid: sequences with ≥7 consecutive matches to off-target genes (BLAST)',
        'Target region: ORF, 50-100 nt downstream of start codon',
        'Avoid: 5\' and 3\' UTRs (regulatory protein binding sites)',
        'Avoid: intronic regions',
        'Thermodynamic asymmetry: lower stability at 5\' end of antisense strand',
        'Chemical modification: 2\'-OMe or LNA at selected positions reduce off-targets',
      ],
      controls: [
        'Non-targeting (scrambled) siRNA — same base composition, no known target',
        'Positive control — siRNA against a housekeeping gene (e.g., GAPDH, PLK1)',
        'Untransfected control — cells with transfection reagent only',
        'Mock transfection — transfection reagent without siRNA',
      ],
      tips: [
        'Validate knockdown at mRNA level (qPCR) 24-48 h post-transfection',
        'Validate at protein level (WB) 48-72 h post-transfection (depends on half-life)',
        'Use at least 2 independent siRNA sequences per target to control for off-targets',
        'Rescue experiment: express siRNA-resistant cDNA to confirm specificity',
        'Typical siRNA working concentration: 10-100 nM (titrate for your cell line)',
      ]
    },
  };

  window.LC_DATA = DATA;
})();
