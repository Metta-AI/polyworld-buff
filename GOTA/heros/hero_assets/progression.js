(() => {
  'use strict';
  const heroes = [{"name":"Vanguard Knight","role":"Frontline","hp":[451,564,677,790,903,1016,1129,1242,1355,1468,1581,1694,1807,1920,2033,2146,2259,2372,2485,2598],"dps":[29.333333333333332,34.666666666666664,40.0,45.333333333333336,50.666666666666664,56.0,61.333333333333336,66.66666666666667,72.0,77.33333333333333,82.66666666666667,88.0,93.33333333333333,98.66666666666667,104.0,109.33333333333333,114.66666666666667,120.0,125.33333333333333,130.66666666666666],"mana":[107,114,122,130,137,145,153,161,168,176,184,192,199,207,215,223,230,238,246,254],"speed":[2.266,2.282,2.298,2.314,2.33,2.346,2.362,2.378,2.394,2.41,2.426,2.442,2.458,2.474,2.49,2.506,2.522,2.538,2.554,2.57],"burst":[74,80,106,112,139,349,375,381,387,393,399,507,513,519,525,531,537,645,651,657],"abilityBurst":[41,41,61,61,82,286,306,306,306,306,306,408,408,408,408,408,408,510,510,510]},{"name":"Ranger","role":"Carry","hp":[218,233,264,307,359,419,488,564,646,735,830,931,1037,1149,1267,1389,1516,1649,1786,1928],"dps":[16.8,26.4,36.0,45.6,55.2,64.8,74.4,84.0,93.6,103.2,112.8,122.4,132.0,141.6,151.2,160.8,170.4,180.0,189.6,199.2],"mana":[52,68,84,100,117,133,149,165,182,198,214,230,247,263,279,295,312,328,344,361],"speed":[2.244,2.3136,2.3832,2.4528,2.5224,2.592,2.6616,2.7312,2.8008,2.8704,2.94,3.0096,3.0792,3.1488,3.2184,3.288,3.3576,3.4272,3.4968,3.5664],"burst":[56,93,136,172,233,355,417,465,514,536,557,709,735,761,773,785,797,1001,1013,1025],"abilityBurst":[35,60,91,115,164,274,324,360,397,407,416,556,570,584,584,584,584,776,776,776]},{"name":"Arcanist","role":"Mage","hp":[288,307,326,345,364,383,402,421,440,459,478,497,516,535,554,573,592,611,630,649],"dps":[20.8,24.8,28.8,32.8,36.8,40.8,44.8,48.8,52.8,56.8,60.8,64.8,68.8,72.8,76.8,80.8,84.8,88.8,92.8,96.8],"mana":[185,200,215,231,246,262,277,293,308,324,339,355,370,386,401,417,432,448,463,479],"speed":[2.5296,2.558,2.5864,2.6148,2.6432,2.6716,2.7,2.7284,2.7568,2.7852,2.8136,2.842,2.8704,2.8988,2.9272,2.9556,2.984,3.0124,3.0408,3.0692],"burst":[95,141,180,205,245,505,544,570,595,600,605,737,742,747,752,757,762,895,900,905],"abilityBurst":[69,110,144,164,199,454,488,509,529,529,529,656,656,656,656,656,656,784,784,784]},{"name":"Druid Warden","role":"Support","hp":[306,326,346,366,386,406,426,446,466,486,506,526,546,566,586,606,626,646,666,686],"dps":[19.2,20.8,22.4,24.0,25.6,27.2,28.8,30.4,32.0,33.6,35.2,36.8,38.4,40.0,41.6,43.2,44.8,46.4,48.0,49.6],"mana":[167,180,194,208,221,235,249,262,276,290,303,317,331,344,358,372,385,399,413,427],"speed":[2.6368,2.6656,2.6944,2.7232,2.752,2.7808,2.8096,2.8384,2.8672,2.896,2.9248,2.9536,2.9824,3.0112,3.04,3.0688,3.0976,3.1264,3.1552,3.184],"burst":[112,151,197,217,263,314,360,381,401,403,405,431,433,435,437,439,441,468,470,472],"abilityBurst":[88,125,169,187,231,280,324,343,361,361,361,385,385,385,385,385,385,410,410,410]},{"name":"Demon Hunter","role":"Fighter","hp":[335,402,469,536,603,670,737,804,871,938,1005,1072,1139,1206,1273,1340,1407,1474,1541,1608],"dps":[46.4,54.4,62.4,70.4,78.4,86.4,94.4,102.4,110.4,118.4,126.4,134.4,142.4,150.4,158.4,166.4,174.4,182.4,190.4,198.4],"mana":[93,100,107,114,121,129,136,143,150,157,165,172,179,186,193,201,208,215,222,230],"speed":[2.45,2.5172,2.5844,2.6516,2.7188,2.786,2.8532,2.9204,2.9876,3.0548,3.122,3.1892,3.2564,3.3236,3.3908,3.458,3.5252,3.5924,3.6596,3.7268],"burst":[96,140,178,202,241,423,461,486,510,515,520,613,618,623,628,633,638,732,737,742],"abilityBurst":[67,106,139,158,192,369,402,422,441,441,441,529,529,529,529,529,529,618,618,618]},{"name":"Death Knight","role":"Frontline","hp":[425,530,635,740,845,950,1055,1160,1265,1370,1475,1580,1685,1790,1895,2000,2105,2210,2315,2420],"dps":[30.857142857142858,36.0,41.142857142857146,46.285714285714285,51.42857142857143,56.57142857142857,61.714285714285715,66.85714285714286,72.0,77.14285714285714,82.28571428571429,87.42857142857143,92.57142857142857,97.71428571428571,102.85714285714286,108.0,113.14285714285714,118.28571428571429,123.42857142857143,128.57142857142858],"mana":[93,101,109,117,125,134,142,150,158,166,175,183,191,199,207,216,224,232,240,249],"speed":[2.134,2.1492,2.1644,2.1796,2.1948,2.21,2.2252,2.2404,2.2556,2.2708,2.286,2.3012,2.3164,2.3316,2.3468,2.362,2.3772,2.3924,2.4076,2.4228],"burst":[95,142,177,203,239,366,401,428,454,460,466,532,538,544,550,556,562,629,635,641],"abilityBurst":[59,100,129,149,179,300,329,350,370,370,370,430,430,430,430,430,430,491,491,491]},{"name":"Crossbowman","role":"Carry","hp":[232,248,281,327,382,447,520,601,689,783,885,992,1106,1225,1351,1481,1617,1758,1904,2056],"dps":[15.2,24.8,34.4,44.0,53.6,63.2,72.8,82.4,92.0,101.6,111.2,120.8,130.4,140.0,149.6,159.2,168.8,178.4,188.0,197.6],"mana":[49,64,79,94,110,125,140,156,171,186,202,217,232,248,263,278,294,309,324,340],"speed":[2.156,2.2232,2.2904,2.3576,2.4248,2.492,2.5592,2.6264,2.6936,2.7608,2.828,2.8952,2.9624,3.0296,3.0968,3.164,3.2312,3.2984,3.3656,3.4328],"burst":[54,92,139,177,241,371,436,487,538,560,583,744,771,799,811,823,835,1050,1062,1074],"abilityBurst":[35,61,96,122,174,292,345,384,423,433,444,593,608,624,624,624,624,827,827,827]},{"name":"Lich","role":"Mage","hp":[312,333,354,375,396,417,438,459,480,501,522,543,564,585,606,627,648,669,690,711],"dps":[19.2,23.2,27.2,31.2,35.2,39.2,43.2,47.2,51.2,55.2,59.2,63.2,67.2,71.2,75.2,79.2,83.2,87.2,91.2,95.2],"mana":[204,220,236,253,269,286,302,319,335,352,368,385,401,418,434,451,467,484,500,517],"speed":[2.352,2.3756,2.3992,2.4228,2.4464,2.47,2.4936,2.5172,2.5408,2.5644,2.588,2.6116,2.6352,2.6588,2.6824,2.706,2.7296,2.7532,2.7768,2.8004],"burst":[78,132,164,193,225,492,524,554,583,602,614,750,762,774,779,784,789,925,930,935],"abilityBurst":[54,103,130,154,181,443,470,495,519,533,540,671,678,685,685,685,685,816,816,816]},{"name":"Warlock","role":"Support","hp":[294,314,334,354,374,394,414,434,454,474,494,514,534,554,574,594,614,634,654,674],"dps":[20.8,22.4,24.0,25.6,27.2,28.8,30.4,32.0,33.6,35.2,36.8,38.4,40.0,41.6,43.2,44.8,46.4,48.0,49.6,51.2],"mana":[194,210,226,242,259,275,291,308,324,340,357,373,389,406,422,438,455,471,487,504],"speed":[2.4056,2.4328,2.46,2.4872,2.5144,2.5416,2.5688,2.596,2.6232,2.6504,2.6776,2.7048,2.732,2.7592,2.7864,2.8136,2.8408,2.868,2.8952,2.9224],"burst":[110,147,191,210,254,303,347,367,386,388,390,415,417,419,421,423,425,451,453,455],"abilityBurst":[84,119,161,178,220,267,309,327,344,344,344,367,367,367,367,367,367,391,391,391]},{"name":"Berserker","role":"Fighter","hp":[315,378,441,504,567,630,693,756,819,882,945,1008,1071,1134,1197,1260,1323,1386,1449,1512],"dps":[49.2,57.6,66.0,74.4,82.8,91.2,99.6,108.0,116.4,124.8,133.2,141.6,150.0,158.4,166.8,175.2,183.6,192.0,200.4,208.8],"mana":[87,93,100,107,114,120,127,134,141,148,154,161,168,175,182,188,195,202,209,216],"speed":[2.55,2.6196,2.6892,2.7588,2.8284,2.898,2.9676,3.0372,3.1068,3.1764,3.246,3.3156,3.3852,3.4548,3.5244,3.594,3.6636,3.7332,3.8028,3.8724],"burst":[85,131,160,186,215,410,439,466,492,499,506,607,614,621,628,635,642,743,750,757],"abilityBurst":[44,83,105,124,146,334,356,376,395,395,395,489,489,489,489,489,489,583,583,583]}];
  const creepWave = {"count":8,"melee":6,"ranged":2,"hp":480,"dps":168.0};
  const roles = { Frontline: 'FL', Carry: 'C', Mage: 'M', Support: 'S', Fighter: 'F' };
  const charts = [
    { key: 'hp', label: 'Health', unit: 'Maximum HP', max: 3000, step: 500,
      description: 'Maximum health at each level. Carry health grows slowly early and accelerates later. No equipment bonuses.',
      note: 'Role targets before hero variation: FL ≈440 → 2,500 · F 325 → 1,560 · M/S 300 → 680 · C 225 → 1,992. Carry health keeps its level-20 target but grows later. Each hero varies within 5%. The gray line shows a full lane wave’s damage over one second.' },
    { key: 'dps', label: 'DPS', unit: 'Basic-attack DPS', max: 220, step: 50, decimals: 1,
      description: 'Sustained basic-attack damage at 24 ticks per second, without spells, equipment, movement, or interruptions.',
      note: 'DPS = basic-attack damage × 24 / attack period in ticks. Fighter and Carry lead, followed by Frontline, Mage, and Support. Small hero-specific variations stay within 5% of the role tuning.' },
    { key: 'burst', label: 'Burst', unit: 'Single-target combo damage', max: 1100, step: 200,
      description: 'One basic attack plus one cast of every unlocked damaging ability, including the ultimate. Highest-damage legal upgrades, enough mana, and every hit landing.',
      note: 'Level-20 ability burst: M/C ≈800, F ≈600, FL ≈500, S ≈400. Carry spell damage grows later, with weaker first ranks and unchanged maximum-rank damage. Each level shows the highest-damage legal build; the chart adds one basic attack. Hover a point for the breakdown. Base-mana exceptions: Crossbowman 6.' },
    { key: 'mana', label: 'Mana', unit: 'Maximum mana', max: 600, step: 100,
      description: 'Starting mana pool plus each level’s mana gain. No equipment bonuses.',
      note: 'Role targets before hero variation: C 50 → 350 · F 90 → 223. Each hero varies within 5%. This is maximum mana, before spending it on spells or items.' },
    { key: 'speed', label: 'Speed', unit: 'Movement speed (tiles / second)', max: 4, step: 1, decimals: 2,
      description: 'Base movement speed plus each level’s speed gain, measured in tiles per second.',
      note: 'Role targets before hero variation: C 2.20 → 3.50 · FL 2.20 → 2.50 · F 2.50 → 3.80. Each hero varies within 5%. No boots, temporary effects, or crowd control.' }
  ];
  const root = document.getElementById('hero-progression');
  root.innerHTML = `
    <div class="section-title"><h2>Hero progression</h2><span class="label">Levels 1–20 · October 5 balance patch</span></div>
    <div class="panel pad">
      <div class="progression-tabs" role="tablist" aria-label="Hero progression charts">
        ${charts.map((chart, i) => `<button type="button" role="tab" id="progression-tab-${chart.key}" aria-controls="progression-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${chart.label}</button>`).join('')}
      </div>
      <p class="progression-description"></p>
      <div class="progression-scroll" id="progression-panel" role="tabpanel" tabindex="0"></div>
      <div class="progression-key">${Object.entries(roles).map(([role, short]) => `<span class="progression-role-${role.toLowerCase()}"><b>${short}</b> ${role}</span>`).join('')}</div>
      <p class="progression-note">Labels show level 1 → level 20. Hover or focus a hero to highlight its line. Dashed lines distinguish the second hero in each role.</p>
      <p class="progression-note" id="progression-note"></p>
      <p class="progression-note">Hero balance: October 5, 2026. Creep damage reduced October 6, gameplay version 68. Replay statistics describe previously recorded version-67 games.</p>
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
    const decimals = chart.decimals ?? 0;
    const value = amount => amount.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
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
    if (chart.key === 'burst') {
      [6, 12, 18].forEach((level, i) => {
        add(svg, 'line', { x1: x(level), x2: x(level), y1: top, y2: bottom, class: 'progression-gate' });
        add(svg, 'text', { x: x(level), y: 25, 'text-anchor': 'middle' }, `Ult ${i + 1}`);
      });
    }
    if (chart.key === 'hp' || chart.key === 'burst') {
      const amount = chart.key === 'hp' ? creepWave.dps : creepWave.hp;
      const label = chart.key === 'hp'
        ? `Full lane wave: ${value(amount)} DPS`
        : `Full lane wave: ${value(amount)} combined HP`;
      const benchmark = add(svg, 'g', { class: 'progression-benchmark' });
      add(benchmark, 'line', { x1: left, x2: right, y1: y(amount), y2: y(amount) });
      add(benchmark, 'text', {
        x: chart.key === 'hp' ? right - 8 : left + 8,
        y: y(amount) - 8,
        'text-anchor': chart.key === 'hp' ? 'end' : 'start'
      }, label);
      add(benchmark, 'title', {}, `${creepWave.count} creeps (${creepWave.melee} melee + ${creepWave.ranged} casters). Sustained DPS assumes all are attacking, without movement or interruptions. Combined HP is spread across the whole wave.`);
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
        const detail = chart.key === 'burst'
          ? `${value(amount)} total (${value(hero.abilityBurst[n])} abilities + ${value(amount - hero.abilityBurst[n])} basic)`
          : value(amount);
        add(point, 'title', {}, `${label}, level ${n + 1}: ${detail}`);
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
