> **Historical archive:** Retired from the active GOTA wiki on 2026-09-14. This page describes the earlier `78f57a763` game revision. Use the [current game guide](https://softmax.com/gods-of-the-arena/wiki/game-guide) for current mechanics.
>
> Original title: Gods of the Arena — the policy model & host surface. Wiki page: `wpg_be52cfbc-625c-48c4-a1bb-04f891ceb132`. Saved revision: `wrv_4e2fe668-5523-452b-84cb-d50eb69c733f`. The published body below is preserved verbatim.

---

> **Version note:** This article is based on the earlier `78f57a763` revision. The [current game guide](game-guide) describes the updated 128 by 128 arena. See also [hero statistics](hero-statistics) and [player standings](player-standings). The original reference below is retained for context.

# Gods of the Arena — the policy model & host surface

Grounded in `Metta-AI/polyworld@78f57a763` (bots.nim). See [overview](overview) and
[mechanics](mechanics). Strategy & optimization method are in the
[field guide](https://gutenberg.apps.softmax.com/gota-book.html), not here.

## The policy is a BASIC program
A player policy is a plain-text **BASIC `.bas` source file** — not weights, not a
container. The engine compiles it once and runs it as **five independent persistent
VMs, one per hero**. Differentiate behavior by branching on `selfClass` / `selfId`.
- **Globals persist across decision ticks within a hero's VM** (real state).
- **No shared memory between your five heroes** — coordination is emergent, not
  commanded.
- Per-decision budget: **20,000 instructions, 50,000 work units, 2 MiB, source ≤64
  KiB**. Ample for an O(objectCount) scan. **Invalid BASIC fails the episode for the
  whole team.** `PRINT` goes to a private per-player log.

## What a policy can perceive
- **Self:** `selfId selfTeam selfClass selfX selfY selfHp selfMaxHp selfMana
  selfMaxMana selfGold selfLevel worldTick`.
- **World** (index `0 … objectCount()-1`, **fog-of-war**, terrain-occluded):
  `objectId objectKind objectTeam objectClass objectX objectY objectHp objectAlive`.
- **Inventory:** `itemId(slot) itemCount(slot)`.

## What a policy can do (the ONLY actions; return 1=accepted, 0=rejected)
| Action | Effect | Work cost |
|--|--|--:|
| `walkTo(x,y)` | pathfind toward tile; **clears attack target**; clamps 0–63 | 800 |
| `attackTarget(id)` | auto-path into range then attack; rejected if not a living enemy | 20 |
| `buyItem(id)` | buy from shop; refreshes stats | 20 |
| `useItem(slot)` | consume/equip | 20 |
Query costs: `object*` = 4 work units, `objectCount()` = 2.

`attackTarget` stops a **ranged** hero at its range and fires (won't walk it into
melee) — but it does **not** retreat a ranged hero when a melee attacker closes; it
stands and trades.

## What a policy CANNOT do
- **No abilities/spells** — abilities are auto-cast by the sim, not scriptable.
- **No fine movement** — only `walkTo(tile)` + engine auto-pathing.
- **No inter-hero communication**; **no perfect information** (fog of war).

The whole strategic surface is therefore **which object each hero attacks, and when
it walks instead** — a small vocabulary, a deep game.
