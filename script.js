const TARGETS = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 0.99];

  const MEME_BUCKETS = [
    ['MAXIMUM COPIUM', 'DELUSION% SPEEDRUN', 'FARMING HOPIUM'],
    ['HUFFING THAT COPIUM', 'HOPIUM STOCKS UP 📈', 'PAIN BEGINS'],
    ['COIN FLIP WITH MY SOUL', 'REALITY LOADING...', 'THE GRIND AWAKENS'],
    ['NO TURNING BACK', 'PAIN IS REAL NOW', 'HALFWAY TO SUFFERING'],
    ['SUFFERING.EXE', 'SOUL SOLD. RECEIPT LOST.', 'THE GRIND NEVER ENDS'],
    ['LOCKED IN MISERY', 'SO CLOSE SO TIRED', 'DON\'T BREAK NOW'],
    ['WORTH IT? ASKING', 'DIGNITY SOLD SEPARATELY', 'THE END IN SIGHT'],
    ['LAST CHANCE CASINO', 'GAME READS YOUR TEARS', 'FINAL FORM SUFFERING'],
    ['WHAT IS SLEEP', 'ITEM NOT FOUND. NEITHER IS HOPE.', 'THE 1% THAT BREAKS YOU'],
    ['EXISTENCE IS SUFFERING', 'I HAVE BECOME THE GRIND', 'IT\'S OVER']
  ];

  const lastMemeIdx = new Array(MEME_BUCKETS.length).fill(-1);

  function getMeme(probPercent) {
    let bucket;
    bucket = Math.min(Math.floor(probPercent / 10), 9);
    const options = MEME_BUCKETS[bucket];
    const prev = lastMemeIdx[bucket];
    let pick;
    do { pick = Math.floor(Math.random() * options.length); } while (options.length > 1 && pick === prev);
    lastMemeIdx[bucket] = pick;
    return options[pick];
  }

function updatePresetHighlights() {
    const baseVal = parseFloat(document.getElementById('baseRate').value.trim());
    const mulVal  = parseFloat(document.getElementById('multiplier').value.trim());
    document.querySelectorAll('[data-base]').forEach(btn => {
      btn.classList.toggle('active', parseFloat(btn.dataset.base) === baseVal);
    });
    document.querySelectorAll('[data-mul]').forEach(btn => {
      btn.classList.toggle('active', parseFloat(btn.dataset.mul) === mulVal);
    });
  }

  function setBaseRate(rate) {
    document.getElementById('baseRate').value = rate;
    update();
  }

  function setMultiplier(mul) {
    document.getElementById('multiplier').value = mul;
    update();
  }

  function resetAll() {
    document.getElementById('baseRate').value = '0.01';
    document.getElementById('multiplier').value = '1';
    update();
  }

  function resetMultiplier() {
    document.getElementById('multiplier').value = '1';
    update();
  }

  let currentTheme = 'dark'; // 'dark' or 'light'
  let rainbowMode = false;

  const SKULL_TOOLTIPS = [
    'I am the apex of this reality',
    'This is inevitable',
    'I will show you true power',
    'Your resistance is futile',
    'You cannot comprehend what I have become',
    'Everything bends to my will',
    'Witness my true form',
    'Your mind cannot contain the truth',
    'I have remade reality in my image',
    'There is no escape. There never was.'
  ];

  function updateThemeClass() {
    const theme = rainbowMode ? (currentTheme === 'light' ? 'rainbow-light' : 'rainbow') : currentTheme;
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    updateThemeClass();
    document.getElementById('themeBtn').textContent = currentTheme === 'dark' ? '☀ Light' : '☾ Dark';
  }

  function toggleRainbow() {
    rainbowMode = !rainbowMode;
    updateThemeClass();
    document.getElementById('rainbowBtn').textContent = rainbowMode ? '❓ Y r u ghae?' : '🌈 Im hella ghae';
  }

  let lastEffectiveRate = 0;
  let lastMaxKills = 0;

function updateSliderTrack(pct) {
    document.getElementById('killSlider').style.setProperty('--slider-val', pct);
  }

  function onSliderInput() {
    const pct = parseInt(document.getElementById('killSlider').value);
    updateSliderTrack(pct);
    if (lastMaxKills <= 0) return;
    const kills = pct >= 100 ? lastMaxKills : Math.round((pct / 100) * lastMaxKills);
    document.getElementById('killCount').value = kills;
    updateSkulls();
  }

  function onKillCountInput() {
    updateSkulls();
    syncSliderToKillCount();
  }

  function syncSliderToKillCount() {
    if (lastMaxKills <= 0) return;
    const kills = parseInt(document.getElementById('killCount').value);
    if (isNaN(kills) || kills < 0) {
      document.getElementById('killSlider').value = 0;
      updateSliderTrack(0);
      return;
    }
    const pct = Math.min(Math.round((kills / lastMaxKills) * 100), 100);
    document.getElementById('killSlider').value = pct;
    updateSliderTrack(pct);
  }

  function updateSkulls() {
    const killRaw = document.getElementById('killCount').value.trim();
    const kills = parseInt(killRaw);
    const row = document.getElementById('skullRow');
    const lbl = document.getElementById('skullLabel');

    if (!killRaw || isNaN(kills) || kills < 0 || lastEffectiveRate <= 0) {
      row.innerHTML = '';
      for (let i = 0; i < 10; i++) {
        const wrap = document.createElement('span');
        wrap.className = 'skull-wrap';
        wrap.title = SKULL_TOOLTIPS[i];
        const base = document.createElement('span');
        base.className = 'skull-base';
        base.textContent = i === 9 ? '⚰️' : '💀';
        const fill = document.createElement('span');
        fill.className = 'skull-filled';
        fill.textContent = i === 9 ? '⚰️' : '💀';
        fill.style.width = '0%';
        wrap.appendChild(base);
        wrap.appendChild(fill);
        row.appendChild(wrap);
      }
      lbl.textContent = '';
      document.getElementById('memeLabel').textContent = '';
      document.querySelectorAll('#tbody tr').forEach(tr => tr.classList.remove('row-highlight'));
      document.getElementById('killSlider').value = 0;
      updateSliderTrack(0);
      return;
    }
    const prob = cumProb(lastEffectiveRate, kills);
    const filled = prob * 10; // out of 10 skulls

    row.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const wrap = document.createElement('span');
      wrap.className = 'skull-wrap';
      wrap.title = SKULL_TOOLTIPS[i];

      const base = document.createElement('span');
      base.className = 'skull-base';
      base.textContent = i === 9 ? '⚰️' : '💀';

      const fill = document.createElement('span');
      fill.className = 'skull-filled';
      fill.textContent = i === 9 ? '⚰️' : '💀';

      if (i < Math.floor(filled)) {
        fill.style.width = '100%';
      } else if (i === Math.floor(filled)) {
        const partial = (filled - Math.floor(filled)) * 100;
        fill.style.width = partial.toFixed(1) + '%';
      } else {
        fill.style.width = '0%';
      }

      wrap.appendChild(base);
      wrap.appendChild(fill);
      row.appendChild(wrap);
    }

    lbl.textContent = `~${(prob * 100).toFixed(2)}% cumulative probability`;
    const killPct = lastMaxKills > 0 ? Math.min((kills / lastMaxKills) * 100, 100) : 0;
    document.getElementById('memeLabel').textContent = getMeme(killPct);
    syncSliderToKillCount();

    // Highlight the row corresponding to the highest threshold the user has reached
    document.querySelectorAll('#tbody tr').forEach(tr => tr.classList.remove('row-highlight'));
    const rows = document.querySelectorAll('#tbody tr');
    let highlightRow = null;
    TARGETS.forEach((target, i) => {
      const n = periodsForTarget(lastEffectiveRate, target);
      if (kills >= n) highlightRow = rows[i];
    });
    if (highlightRow) highlightRow.classList.add('row-highlight');
  }

  function periodsForTarget(p, target) {
    // 1 - (1-p)^n >= target  =>  n >= log(1-target)/log(1-p)
    if (p <= 0) return Infinity;
    if (p >= 1) return 1;
    return Math.ceil(Math.log(1 - target) / Math.log(1 - p));
  }

  function cumProb(p, n) {
    return 1 - Math.pow(1 - p, n);
  }

  function update() {
    const baseRaw = document.getElementById('baseRate').value.trim();
    const mulRaw  = document.getElementById('multiplier').value.trim();
    const errEl   = document.getElementById('errMsg');
    const brInput = document.getElementById('baseRate');
    const mulInput = document.getElementById('multiplier');

    const basePercent = parseFloat(baseRaw);
    const base = basePercent / 100;  // Convert from percentage to decimal
    const mul  = parseFloat(mulRaw);

    brInput.classList.toggle('invalid', isNaN(basePercent) || basePercent <= 0 || basePercent >= 100);
    mulInput.classList.toggle('invalid', isNaN(mul) || mul <= 0);

    if (isNaN(basePercent) || basePercent <= 0 || basePercent >= 100) {
      errEl.textContent = 'Base rate must be a number between 0 and 100 (exclusive).';
      return;
    }
    if (isNaN(mul) || mul <= 0) {
      errEl.textContent = 'Multiplier must be a positive number.';
      return;
    }
    errEl.textContent = '';

    const effectiveRate = Math.min(base * mul, 0.9999999);

    lastEffectiveRate = effectiveRate;
    lastMaxKills = periodsForTarget(effectiveRate, 0.99);

    document.getElementById('effectiveRateDisplay').textContent = (effectiveRate * 100).toFixed(2) + '%';

    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    let prevN = 0;

    prevN = 0;
    TARGETS.forEach((target, i) => {
      const n = periodsForTarget(effectiveRate, target);
      const pct = target * 100;

      const tr = document.createElement('tr');

      const tdProb = document.createElement('td');
      tdProb.className = 'col-periods';
      tdProb.textContent = pct === 99 ? '≥99%' : `≥${pct}%`;
      tr.appendChild(tdProb);

      const tdTarget = document.createElement('td');
      tdTarget.style.padding = '0';
      const cellWrap = document.createElement('div');
      cellWrap.className = 'col-cum bar-cell';
      cellWrap.style.padding = '0';

      let barLabel = '';
      let barPct = 0;

      if (i === 0 || prevN === Infinity || n === Infinity) {
        barLabel = ' ';
        barPct = n === Infinity ? 0 : (n / lastMaxKills) * 100;
      } else {
        const delta = n - prevN;
        const deltaPercent = ((delta / prevN) * 100).toFixed(0);
        barLabel = `+${delta.toLocaleString()} (${deltaPercent}%)`;
        barPct = (n / lastMaxKills) * 100;
      }

      cellWrap.style.setProperty('--bar-pct', barPct.toFixed(2) + '%');
      const bar = document.createElement('div');
      bar.className = 'bar-bg';
      const label = document.createElement('span');
      label.className = 'bar-val';
      label.style.padding = '9px 16px';
      label.style.position = 'relative';
      label.style.display = 'block';

      if (barLabel) {
        const parts = barLabel.match(/^(.+)\s(\(.+?\))$/);
        if (parts) {
          label.textContent = parts[1] + ' ';
          const pctSpan = document.createElement('span');
          pctSpan.textContent = parts[2];
          pctSpan.style.color = 'var(--muted)';
          label.appendChild(pctSpan);
        } else {
          label.textContent = barLabel;
        }
      }

      cellWrap.appendChild(bar);
      cellWrap.appendChild(label);
      tdTarget.appendChild(cellWrap);

      const tdN = document.createElement('td');
      tdN.className = 'col-single';
      tdN.textContent = n === Infinity ? '∞' : n.toLocaleString();
      prevN = n;

      tr.appendChild(tdN);
      tr.appendChild(tdTarget);
      tbody.appendChild(tr);
    });

    updateSkulls();
    updatePresetHighlights();
  }

  update();
  updateThemeClass();
  updateSliderTrack(0);
  updateSkulls();

