(() => {
  'use strict';
  const heroes = [{"name":"Vanguard Knight","role":"Frontline","hp":[330,418,506,594,682,770,858,946,1034,1122,1210,1298,1386,1474,1562,1650,1738,1826,1914,2002],"dps":[22.22222222222222,26.666666666666668,31.11111111111111,35.55555555555556,40.0,44.44444444444444,48.888888888888886,53.333333333333336,57.77777777777778,62.22222222222222,66.66666666666667,71.11111111111111,75.55555555555556,80.0,84.44444444444444,88.88888888888889,93.33333333333333,97.77777777777777,102.22222222222223,106.66666666666667],"burst":[65,70,95,100,125,202,227,232,237,242,247,288,293,298,303,308,313,354,359,364]},{"name":"Ranger","role":"Carry","hp":[25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44],"dps":[41.333333333333336,49.333333333333336,57.333333333333336,65.33333333333333,73.33333333333333,81.33333333333333,89.33333333333333,97.33333333333333,105.33333333333333,113.33333333333333,121.33333333333333,129.33333333333334,137.33333333333334,145.33333333333334,153.33333333333334,161.33333333333334,169.33333333333334,177.33333333333334,185.33333333333334,193.33333333333334],"burst":[79,117,147,169,199,300,330,352,374,396,410,463,477,491,497,503,509,563,569,575]},{"name":"Arcanist","role":"Mage","hp":[190,215,240,265,290,315,340,365,390,415,440,465,490,515,540,565,590,615,640,665],"dps":[30.4,36.8,43.2,49.6,56.0,62.4,68.8,75.2,81.6,88.0,94.4,100.8,107.2,113.6,120.0,126.4,132.8,139.2,145.6,152.0],"burst":[108,158,201,230,273,551,594,623,652,660,668,811,819,827,835,843,851,994,1002,1010]},{"name":"Druid Warden","role":"Support","hp":[250,298,346,394,442,490,538,586,634,682,730,778,826,874,922,970,1018,1066,1114,1162],"dps":[16.8,20.0,23.2,26.4,29.6,32.8,36.0,39.2,42.4,45.6,48.8,52.0,55.2,58.4,61.6,64.8,68.0,71.2,74.4,77.6],"burst":[21,25,29,33,37,109,113,117,121,125,129,167,171,175,179,183,187,225,229,233]},{"name":"Demon Hunter","role":"Fighter","hp":[220,256,292,328,364,400,436,472,508,544,580,616,652,688,724,760,796,832,868,904],"dps":[51.2,62.4,73.6,84.8,96.0,107.2,118.4,129.6,140.8,152.0,163.2,174.4,185.6,196.8,208.0,219.2,230.4,241.6,252.8,264.0],"burst":[97,142,181,207,247,354,393,419,445,452,459,516,523,530,537,544,551,608,615,622]},{"name":"Death Knight","role":"Frontline","hp":[350,412,474,536,598,660,722,784,846,908,970,1032,1094,1156,1218,1280,1342,1404,1466,1528],"dps":[25.714285714285715,30.857142857142858,36.0,41.142857142857146,46.285714285714285,51.42857142857143,56.57142857142857,61.714285714285715,66.85714285714286,72.0,77.14285714285714,82.28571428571429,87.42857142857143,92.57142857142857,97.71428571428571,102.85714285714286,108.0,113.14285714285714,118.28571428571429,123.42857142857143],"burst":[90,138,174,201,237,353,389,416,443,449,455,516,522,528,534,540,546,607,613,619]},{"name":"Crossbowman","role":"Carry","hp":[230,272,314,356,398,440,482,524,566,608,650,692,734,776,818,860,902,944,986,1028],"dps":[11.047619047619047,12.761904761904763,14.476190476190476,16.19047619047619,17.904761904761905,19.61904761904762,21.333333333333332,23.047619047619047,24.761904761904763,26.476190476190474,28.19047619047619,29.904761904761905,31.61904761904762,33.333333333333336,35.04761904761905,36.76190476190476,38.476190476190474,40.19047619047619,41.904761904761905,43.61904761904762],"burst":[126,185,228,262,305,429,472,506,540,569,588,654,673,692,701,710,719,786,795,804]},{"name":"Lich","role":"Mage","hp":[185,203,221,239,257,275,293,311,329,347,365,383,401,419,437,455,473,491,509,527],"dps":[27.0,33.0,39.0,45.0,51.0,57.0,63.0,69.0,75.0,81.0,87.0,93.0,99.0,105.0,111.0,117.0,123.0,129.0,135.0,141.0],"burst":[89,145,179,211,246,379,413,445,477,499,514,584,599,614,622,630,638,709,717,725]},{"name":"Warlock","role":"Support","hp":[240,286,332,378,424,470,516,562,608,654,700,746,792,838,884,930,976,1022,1068,1114],"dps":[18.0,22.285714285714285,26.571428571428573,30.857142857142858,35.142857142857146,39.42857142857143,43.714285714285715,48.0,52.285714285714285,56.57142857142857,60.857142857142854,65.14285714285714,69.42857142857143,73.71428571428571,78.0,82.28571428571429,86.57142857142857,90.85714285714286,95.14285714285714,99.42857142857143],"burst":[107,148,196,219,267,377,425,448,471,476,481,538,543,548,553,558,563,621,626,631]},{"name":"Berserker","role":"Fighter","hp":[300,355,410,465,520,575,630,685,740,795,850,905,960,1015,1070,1125,1180,1235,1290,1345],"dps":[63.6,73.2,82.8,92.4,102.0,111.6,121.2,130.8,140.4,150.0,159.6,169.2,178.8,188.4,198.0,207.6,217.2,226.8,236.4,246.0],"burst":[98,146,176,204,235,343,373,401,429,437,445,503,511,519,527,535,543,601,609,617]}];
  const roles = { Frontline: 'FL', Carry: 'C', Mage: 'M', Support: 'S', Fighter: 'F' };
  const charts = [
    { key: 'hp', label: 'Health', unit: 'Maximum HP', max: 2200, step: 500,
      description: 'Starting health plus each level’s HP gain. No equipment bonuses.',
      note: 'Ranger grows from 25 HP at level 1 to 44 HP at level 20.' },
    { key: 'dps', label: 'DPS', unit: 'Basic-attack DPS', max: 280, step: 50,
      description: 'Sustained basic-attack damage at 24 ticks per second, without spells, equipment, movement, or interruptions.',
      note: 'DPS = basic-attack damage × 24 / attack period in ticks.' },
    { key: 'burst', label: 'Burst', unit: 'Single-target combo damage', max: 1100, step: 200,
      description: 'One basic attack plus one cast of every unlocked damaging ability, including the ultimate. Highest-damage legal upgrades, enough mana, and every hit landing.',
      note: 'One cast per slot. Delayed spells take time to land. Base-mana exceptions: Crossbowman levels 6–12 and Death Knight level 6.' }
  ];
  const root = document.getElementById('hero-progression');
  root.innerHTML = `
    <div class="section-title"><h2>Hero progression</h2><span class="label">Levels 1–20 · October 5, 2026</span></div>
    <div class="panel pad">
      <div class="progression-tabs" role="tablist" aria-label="Hero progression charts">
        ${charts.map((chart, i) => `<button type="button" role="tab" id="progression-tab-${chart.key}" aria-controls="progression-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${chart.label}</button>`).join('')}
      </div>
      <p class="progression-description"></p>
      <div class="progression-scroll" id="progression-panel" role="tabpanel" tabindex="0"></div>
      <div class="progression-key">${Object.entries(roles).map(([role, short]) => `<span class="progression-role-${role.toLowerCase()}"><b>${short}</b> ${role}</span>`).join('')}</div>
      <p class="progression-note">Labels show level 1 → level 20. Hover or focus a hero to highlight its line. Dashed lines distinguish the second hero in each role.</p>
      <p class="progression-note" id="progression-note"></p>
      <p class="progression-note">Base-stat snapshot: GotA 2026.10.5.1. Match-version filtering applies to replay statistics.</p>
    </div>`;
  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  const panel = root.querySelector('[role="tabpanel"]');

  function add(parent, tag, attributes, text = '') {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    if (text) element.textContent = text;
    parent.append(element);
    return element;
  }

  function render(index) {
    const chart = charts[index];
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tabs[index].id);
    root.querySelector('.progression-description').textContent = chart.description;
    root.querySelector('#progression-note').textContent = chart.note;
    panel.replaceChildren();
    const svg = add(panel, 'svg', { viewBox: '0 0 1200 500', class: 'progression-svg', role: 'img',
      'aria-labelledby': 'progression-chart-title progression-chart-description' });
    add(svg, 'title', { id: 'progression-chart-title' }, `${chart.label} progression for all ten GotA heroes`);
    add(svg, 'desc', { id: 'progression-chart-description' }, chart.description);
    const left = 62, right = 765, top = 36, bottom = 440;
    const x = level => left + (level - 1) * (right - left) / 19;
    const y = value => bottom - value / chart.max * (bottom - top);
    const value = amount => amount.toLocaleString('en-US', { minimumFractionDigits: index === 1 ? 1 : 0, maximumFractionDigits: index === 1 ? 1 : 0 });
    add(svg, 'text', { x: left, y: 14 }, chart.unit);
    add(svg, 'text', { x: 1186, y: 14, 'text-anchor': 'end' }, 'Level 1 → level 20');
    for (let tick = 0; tick < chart.max; tick += chart.step) {
      add(svg, 'line', { x1: left, x2: right, y1: y(tick), y2: y(tick), class: 'progression-grid' });
      add(svg, 'text', { x: left - 14, y: y(tick) + 4, 'text-anchor': 'end' }, tick.toLocaleString('en-US'));
    }
    add(svg, 'line', { x1: left, x2: right, y1: bottom, y2: bottom, class: 'progression-axis' });
    for (const level of [1, 5, 10, 15, 20]) {
      add(svg, 'text', { x: x(level), y: bottom + 24, 'text-anchor': 'middle' }, String(level));
    }
    add(svg, 'text', { x: (left + right) / 2, y: 490, 'text-anchor': 'middle' }, 'Hero level');
    if (index === 2) {
      [6, 12, 18].forEach((level, i) => {
        add(svg, 'line', { x1: x(level), x2: x(level), y1: top, y2: bottom, class: 'progression-gate' });
        add(svg, 'text', { x: x(level), y: 25, 'text-anchor': 'middle' }, `Ult ${i + 1}`);
      });
    }
    const sorted = [...heroes].sort((a, b) => b[chart.key][19] - a[chart.key][19]);
    const positions = [];
    sorted.forEach((hero, i) => positions.push(Math.max(y(hero[chart.key][19]), i ? positions[i - 1] + 30 : top)));
    positions[positions.length - 1] = Math.min(bottom, positions.at(-1));
    for (let i = positions.length - 2; i >= 0; i--) positions[i] = Math.min(positions[i], positions[i + 1] - 30);
    sorted.forEach((hero, i) => {
      const values = hero[chart.key];
      const label = `${hero.name} (${roles[hero.role]})`;
      const secondary = heroes.filter(other => other.role === hero.role).indexOf(hero) === 1;
      const group = add(svg, 'g', { class: `progression-series progression-role-${hero.role.toLowerCase()}${secondary ? ' progression-secondary' : ''}`,
        tabindex: '0', 'aria-label': `${label}: ${value(values[0])} to ${value(values[19])}` });
      add(group, 'path', { d: values.map((amount, n) => `${n ? 'L' : 'M'}${x(n + 1).toFixed(2)},${y(amount).toFixed(2)}`).join(' '), class: 'progression-path' });
      values.forEach((amount, n) => {
        const point = add(group, 'circle', { cx: x(n + 1), cy: y(amount), r: n === 0 || n === 19 ? 4 : 2.5, class: 'progression-point' });
        add(point, 'title', {}, `${label}, level ${n + 1}: ${value(amount)}`);
      });
      add(group, 'path', { d: `M${right + 5},${y(values[19])} L794,${positions[i]} H800`, class: 'progression-leader' });
      add(group, 'text', { x: 810, y: positions[i] + 4, class: 'progression-name' }, label);
      add(group, 'text', { x: 1186, y: positions[i] + 4, 'text-anchor': 'end', class: 'progression-value' }, `${value(values[0])} → ${value(values[19])}`);
    });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => render(i));
    tab.addEventListener('keydown', event => {
      let next = i;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      render(next);
      tabs[next].focus();
    });
  });
  render(0);
})();
