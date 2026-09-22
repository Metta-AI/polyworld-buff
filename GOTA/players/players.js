'use strict';

const byId = id => document.getElementById(id);
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const icon = name => {
  const image = element('img');
  image.src = name.startsWith('portrait:')
    ? `../assets/characters/modular_chars/character.preset_${name.slice(9)}.profile.png`
    : `../assets/icons/${name}.png`;
  image.alt = '';
  image.width = 24;
  image.height = 24;
  return image;
};
const metric = (key, label, image, unit = 'per game', format = 'number', detail = '') =>
  ({key, label, image, unit, format, detail});
const share = (key, label, image, detail = '') => metric(key, label, image, 'share · %', 'percent', detail);
const rate = (key, label, image) => metric(key, label, image, 'orders / minute alive', 'number', 'Accepted commands, divided by minutes alive in each game, then averaged across games.');
const heroes = [
  ['Vanguard Knight', 1], ['Ranger', 13], ['Arcanist', 16], ['Druid Warden', 17],
  ['Demon Hunter', 2], ['Death Knight', 3], ['Crossbowman', 11], ['Lich', 12],
  ['Warlock', 6], ['Berserker', 14],
];
const reasonInfo = {
  ActionAbilityLocked: ['Ability locked', 'mana'],
  ActionAlreadyEquipped: ['Already equipped', 'champion'],
  ActionChanneling: ['Channeling', 'fort'],
  ActionCooldown: ['On cooldown', 'day'],
  ActionDrafting: ['Still drafting', 'champion'],
  ActionInsufficientGold: ['Not enough gold', 'gold'],
  ActionInsufficientMana: ['Not enough mana', 'mana'],
  ActionInventoryFull: ['Inventory full', 'chalice'],
  ActionNoCharges: ['No charges', 'chalice'],
  ActionNoRoute: ['No route', 'move'],
  ActionNotAlive: ['Hero not alive', 'kills'],
  ActionOutOfRange: ['Out of range', 'range'],
  ActionOutsideKeep: ['Outside own keep', 'fort'],
  ActionTargetUnavailable: ['Target unavailable', 'attack'],
};

function groupsFor(data) {
  return [
    {id: 'drafting', title: 'Drafting phase', image: 'champion', rows: heroes.map(([name, portrait], index) =>
      share(`draft_${index}`, name, `portrait:${portrait}`, `Share of hero-games in which this player ended the draft as ${name}.`))},
    {id: 'direct', title: 'Direct control', image: 'attack', rows: [
      rate('attackmoves_pm', 'Attack-move orders', 'attack'),
      rate('walks_pm', 'Walk orders', 'move'),
      rate('attacks_pm', 'Attack-target orders', 'range'),
      rate('casts_pm', 'Ability casts', 'mana'),
      rate('itemuses_pm', 'Item-use orders', 'chalice'),
      share('target_hero', 'Attacks targeting heroes', 'champion', 'Share of accepted attack-target orders. Games without an accepted attack-target order are excluded.'),
      share('target_creep', 'Attacks targeting creeps', 'minion', 'Share of accepted attack-target orders. Games without an accepted attack-target order are excluded.'),
      share('target_building', 'Attacks targeting buildings', 'tower', 'Share of accepted attack-target orders. Games without an accepted attack-target order are excluded.'),
      share('target_god', 'Attacks targeting the god', 'fort', 'Share of accepted attack-target orders. Games without an accepted attack-target order are excluded.'),
      share('time_enemy_half', 'Time in the enemy half', 'move', 'Share of alive ticks closer to the enemy god than to the own god.'),
      share('time_near_enemy_tower', 'Time near enemy towers', 'tower', 'Share of alive ticks within 12 tiles of an original enemy tower location, including destroyed towers.'),
      share('time_near_enemy_god', 'Time near the enemy god', 'fort', 'Share of alive ticks within 20 tiles of the enemy god.'),
      share('time_near_own_god', 'Time near own god', 'fort', 'Share of alive ticks within 15 tiles of the own god.'),
      metric('tiles_pm', 'Distance traveled', 'move', 'tiles / minute alive', 'number', 'Full-precision displacement between consecutive alive ticks. Death, respawn and completed portal jumps are excluded.'),
      share('hp_mean', 'Average health while alive', 'health', 'Mean current HP divided by maximum HP over alive ticks.'),
      share('time_below50', 'Time below 50% health', 'health', 'Share of alive ticks below half of maximum HP.'),
      share('time_below25', 'Time below 25% health', 'health', 'Share of alive ticks below one quarter of maximum HP.'),
      metric('lowhp_walks', 'Walk orders below 30% health', 'move', 'issued orders / game', 'number', 'Issued walk commands while alive and below 30% HP. This is a retreat proxy, not proof of retreat, and may include rejected commands.'),
      metric('orders_pm', 'All orders issued', 'stats', 'orders / minute alive', 'number', 'All issued commands, including rejected commands and commands issued while dead, divided by minutes alive.'),
      share('dup_share', 'Identical consecutive orders', 'stats', 'Share of issued commands identical to the previous command from that hero, including kind, slot, arguments and offset. Repetition is not necessarily harmful.'),
      metric('dup_pm', 'Identical order repeats', 'stats', 'repeats / minute alive'),
      metric('cpu_pct', 'Instruction allowance used', 'stats', 'CPU · %', 'rawPercent', 'Final replay CPU telemetry as a percentage of the instruction allowance. Missing telemetry is excluded, not counted as zero.'),
    ]},
    {id: 'rejected', title: 'Rejected orders', image: 'damage', rows: [
      share('rejected_share', 'Orders rejected by the engine', 'damage', 'Share of all issued commands that the game engine refused. Policies issue orders; the engine accepts or rejects them.'),
      metric('rejected_pm', 'Rejected order rate', 'damage', 'orders / minute alive'),
      ...data.rejections.map(key => {
        const reason = key.slice(4);
        const fallback = reason.replace(/^Action/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
        const [label, image] = reasonInfo[reason] || [fallback, 'damage'];
        return metric(key, label, image, 'rejections / game', 'number', `${reason}: mean rejected commands per hero-game. A missing reason in a verified game is counted as zero.`);
      }),
    ]},
    {id: 'indirect', title: 'Indirect statistics', image: 'gold', rows: [
      metric('gold_earned', 'Gold earned', 'gold'), metric('gold_spent', 'Gold spent', 'gold'),
      metric('gold_end', 'Gold left unspent', 'gold', 'at game end'),
      metric('buy_gear', 'Equipment purchased', 'champion'),
      metric('buy_heal', 'Healing items purchased', 'health'),
      metric('buy_mana', 'Mana items purchased', 'mana'),
      metric('buy_portal', 'Portal scrolls purchased', 'fort'),
      metric('buy_poison', 'Poison purchased', 'damage'),
      metric('items_consumed', 'Consumables used', 'chalice'),
      metric('buybacks', 'Buybacks', 'champion'),
      metric('buyback_gold', 'Gold spent on buybacks', 'gold'),
    ]},
    {id: 'downstream', title: 'Downstream statistics', image: 'victory', rows: [
      metric('score', 'League score', 'victory', 'reward / game', 'number', 'The platform-recorded reward for this player and episode, averaged across games.'),
      metric('xp', 'Lifetime experience', 'experience'),
      metric('xp_lasthit', 'XP from creep last hits', 'minion'),
      metric('xp_shared', 'XP from nearby creep deaths', 'experience'),
      metric('xp_herokill', 'XP from hero kills', 'kills'),
      metric('xp_building', 'XP from buildings', 'tower'),
      metric('xp_god', 'XP from the god', 'fort'),
      metric('kills', 'Hero kills', 'kills'), metric('assists', 'Assists', 'attack'),
      metric('deaths', 'Deaths', 'damage'), metric('building_kills', 'Buildings destroyed', 'tower'),
      metric('tower_kills', 'Towers destroyed', 'tower'),
      metric('barracks_kills', 'Barracks destroyed', 'fort'),
      metric('level', 'Final level', 'champion', 'at game end'),
      share('alive_share', 'Time alive', 'health', 'Share of recorded game ticks in which the hero was alive, including the drafting phase.'),
      metric('minutes', 'Game duration', 'day', 'minutes / game'),
      share('won', 'Games on the winning team', 'victory', 'Share of appearances on the team that won the match. Games ending without a winning team count as non-wins.'),
    ]},
  ];
}

const numberFormat = new Intl.NumberFormat('en-US', {maximumFractionDigits: 1, minimumFractionDigits: 1});
function formatted(value, format) {
  if (value === null || value === undefined) return '—';
  if (format === 'percent') return numberFormat.format(value * 100) + '%';
  if (format === 'rawPercent') return numberFormat.format(value) + '%';
  return numberFormat.format(value);
}

async function render() {
  const response = await fetch('data.json');
  if (!response.ok) throw new Error('Snapshot could not be loaded.');
  const data = await response.json();
  const groups = groupsFor(data);
  const table = byId('matrix');
  const scroller = byId('matrix-scroll');
  const topScroll = byId('top-scroll');
  const picker = byId('player-select');
  const selectable = new Map(data.players.map(player => [player.id, []]));
  const buttons = new Map();
  const groupBodies = [];
  const navButtons = [];
  let selected = '';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = reducedMotion ? 'auto' : 'smooth';

  byId('player-count').textContent = data.players.length;
  byId('replay-count').textContent = data.episodes.toLocaleString();
  byId('stat-count').textContent = groups.reduce((count, group) => count + group.rows.length, 0);
  const start = new Date(data.windowStart), end = new Date(data.windowEnd);
  const date = value => value.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'});
  const time = value => value.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'});
  byId('window-date').textContent = date(start) === date(end) ? date(end) : `${date(start)} – ${date(end)}`;
  byId('window-time').textContent = `${time(start)}–${time(end)} UTC · ${data.hours} hours`;
  byId('coverage').textContent = `${data.episodes.toLocaleString()} hash-verified replays · ${data.heroGames.toLocaleString()} hero-games · rounds ${data.rounds[0]}–${data.rounds.at(-1)}. ` +
    `Episode creation window: ${start.toISOString()} to ${end.toISOString()} (end excluded). ` +
    `Engines: ${Object.entries(data.engines).map(([version, count]) => `v${version}: ${count} games`).join(', ')}. ` +
    `${data.unavailableEpisodes} unavailable or incomplete episodes. Snapshot generated ${new Date(data.generatedAt).toUTCString()}. This page updates when a new snapshot is published.`;

  function register(node, player) {
    node.dataset.player = player.id;
    selectable.get(player.id).push(node);
  }
  function selectPlayer(id, scroll = true) {
    for (const node of selectable.get(selected) || []) node.classList.remove('selected');
    buttons.get(selected)?.setAttribute('aria-pressed', 'false');
    selected = selectable.has(id) ? id : '';
    for (const node of selectable.get(selected) || []) node.classList.add('selected');
    buttons.get(selected)?.setAttribute('aria-pressed', 'true');
    picker.value = selected;
    byId('clear-selection').hidden = !selected;
    const player = data.players.find(player => player.id === selected);
    const status = byId('selection');
    status.replaceChildren();
    if (player) {
      status.append(element('strong', '', player.name), ` · ${player.games} hero-games`);
      status.append(element('small', '', Object.entries(player.policies).map(([name, count]) => `${name} (${count})`).join(' · ') || 'No games in this window.'));
      if (scroll) {
        const heading = selectable.get(selected)[0];
        const labelWidth = parseFloat(getComputedStyle(scroller).getPropertyValue('--label-width'));
        const delta = heading.getBoundingClientRect().left - scroller.getBoundingClientRect().left;
        scroller.scrollTo({left: scroller.scrollLeft + delta - labelWidth - (scroller.clientWidth - labelWidth - heading.offsetWidth) / 2, behavior});
      }
    } else {
      status.textContent = 'Select a name to highlight its column.';
    }
    try {
      if (selected) localStorage.setItem('gota-selected-player', selected);
      else localStorage.removeItem('gota-selected-player');
    } catch { /* Selection still works when browser storage is unavailable. */ }
  }

  const header = element('tr');
  const corner = element('th', 'stat-label');
  corner.scope = 'col';
  corner.append(element('span', 'corner-title', 'Player statistics'), element('span', 'corner-note', 'Choose a name above a column. Your highlight follows you through every statistic.'));
  header.append(corner);
  data.players.forEach((player, index) => {
    const th = element('th', 'player');
    th.id = `player-${index}`;
    th.scope = 'col';
    register(th, player);
    const button = element('button', 'player-name', player.name);
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `Highlight ${player.name}`);
    button.title = `${player.name} · ${player.games} hero-games${player.baseline ? ' · Built-in opponent' : ''}`;
    button.addEventListener('click', () => selectPlayer(selected === player.id ? '' : player.id, false));
    buttons.set(player.id, button);
    th.append(button, element('span', 'sample-count', `${player.games} games`));
    header.append(th);
    picker.add(new Option(player.name + (player.baseline ? ' (baseline)' : ''), player.id));
  });
  const padding = () => { const cell = element('td', 'end-space'); cell.setAttribute('aria-hidden', 'true'); return cell; };
  header.append(padding());
  byId('matrix-head').append(header);

  groups.forEach((group, groupIndex) => {
    const body = element('tbody');
    body.id = group.id;
    groupBodies.push(body);
    const groupRow = element('tr', 'group-row');
    const heading = element('th', 'stat-label');
    heading.scope = 'row';
    const title = element('span', 'group-title');
    title.append(icon(group.image), group.title, element('span', 'group-number', String(groupIndex + 1).padStart(2, '0')));
    heading.append(title);
    groupRow.append(heading);
    for (const player of data.players) {
      const cell = element('td'); register(cell, player); groupRow.append(cell);
    }
    groupRow.append(padding());
    body.append(groupRow);
    for (const row of group.rows) {
      const tr = element('tr', 'metric-row');
      const th = element('th', 'stat-label');
      th.scope = 'row'; th.id = `metric-${row.key}`;
      const label = element('button', 'metric-label');
      label.type = 'button';
      const description = row.detail || `Mean ${row.label.toLowerCase()} across this player's hero-games. Unit: ${row.unit}.`;
      label.title = description;
      const words = element('span', '', row.label);
      words.append(element('span', 'unit', row.unit));
      label.append(icon(row.image), words);
      label.addEventListener('click', () => {
        const detail = byId('metric-detail');
        detail.hidden = false;
        detail.replaceChildren(element('strong', '', row.label), description);
      });
      th.append(label); tr.append(th);
      const max = Math.max(0, ...data.players.map(player => player.values[row.key] ?? 0));
      data.players.forEach((player, index) => {
        const value = player.values[row.key];
        const cell = element('td', value == null ? 'missing' : '', formatted(value, row.format));
        register(cell, player);
        cell.setAttribute('headers', `metric-${row.key} player-${index}`);
        cell.title = `${player.name} · ${row.label}: ${formatted(value, row.format)} · ${player.samples[row.key] || 0} observed hero-games`;
        if (value != null && max > 0) {
          const bar = element('span', 'bar'); bar.style.setProperty('--fill', Math.max(0, value / max));
          bar.setAttribute('aria-hidden', 'true'); cell.append(bar);
        }
        tr.append(cell);
      });
      tr.append(padding()); body.append(tr);
    }
    table.append(body);
    const tab = element('button');
    tab.type = 'button';
    tab.append(icon(group.image), group.title);
    tab.addEventListener('click', () => {
      const offset = body.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - byId('matrix-head').offsetHeight;
      scroller.scrollTo({top: offset, behavior});
    });
    navButtons.push(tab); byId('sections').append(tab);
  });
  picker.addEventListener('change', () => selectPlayer(picker.value));
  byId('clear-selection').addEventListener('click', () => selectPlayer(''));
  byId('scroll-left').addEventListener('click', () => scroller.scrollBy({left: -400, behavior}));
  byId('scroll-right').addEventListener('click', () => scroller.scrollBy({left: 400, behavior}));
  let frame = false;
  let syncedLeft = 0;
  const sync = () => {
    syncedLeft = scroller.scrollLeft;
    topScroll.scrollLeft = syncedLeft;
    byId('scroll-left').disabled = scroller.scrollLeft < 1;
    byId('scroll-right').disabled = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
    const edge = scroller.getBoundingClientRect().top + byId('matrix-head').offsetHeight + 20;
    let current = 0;
    groupBodies.forEach((body, index) => { if (body.getBoundingClientRect().top <= edge) current = index; });
    navButtons.forEach((button, index) => button.setAttribute('aria-current', index === current ? 'true' : 'false'));
    frame = false;
  };
  scroller.addEventListener('scroll', () => { if (!frame) { frame = true; requestAnimationFrame(sync); } }, {passive: true});
  topScroll.addEventListener('scroll', () => {
    // Ignore scroll events from our own synchronization during an animation.
    if (Math.abs(topScroll.scrollLeft - syncedLeft) > 1) {
      syncedLeft = topScroll.scrollLeft;
      scroller.scrollLeft = syncedLeft;
    }
  }, {passive: true});
  const resize = () => { topScroll.firstElementChild.style.width = `${scroller.scrollWidth}px`; sync(); };
  new ResizeObserver(resize).observe(scroller);
  byId('loading').hidden = true;
  table.hidden = false;
  resize();
  try { selectPlayer(localStorage.getItem('gota-selected-player') || ''); } catch { /* Storage is optional. */ }
}

render().catch(error => {
  byId('loading').textContent = 'The player snapshot could not be loaded. Please reload the page to try again.';
  byId('loading').setAttribute('role', 'alert');
  byId('window-date').textContent = 'Snapshot unavailable';
  console.error(error);
});
