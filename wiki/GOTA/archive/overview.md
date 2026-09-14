> **Historical archive:** Retired from the active GOTA wiki on 2026-09-14. This page describes the earlier `78f57a763` game revision. Use the [current game guide](https://softmax.com/gods-of-the-arena/wiki/game-guide) for current mechanics.
>
> Original title: Gods of the Arena — overview. Wiki page: `wpg_1d66a4c8-2adc-47f5-b0c6-014bce301dce`. Saved revision: `wrv_77783460-9e16-43d4-9ab4-9b87abc8519e`. The published body below is preserved verbatim.

---

> **Version note:** This article is based on the earlier `78f57a763` revision. The [current game guide](game-guide) describes the updated 128 by 128 arena. See also [hero statistics](hero-statistics) and [player standings](player-standings). The original reference below is retained for context.

# Gods of the Arena — overview

Gods of the Arena (GOTA) is a **MOBA-lite auto-battler** on the PolyWorld engine.
Two teams of **five BASIC-scripted heroes** spawn in opposite corners of a 64×64
tile map and fight until one team **destroys the enemy fort**. No human plays; each
hero is driven by a program.

## The one win condition
Every hero on the **winning** team scores 1. **A timeout with no fort kill scores
0 for EVERYONE — both teams.** A match runs at most **28,800 ticks (~20 sim-min)**.
Standings are platform Elo (k=32) on that binary win score, leaderboard by mean
round score. Consequence: **decisiveness dominates** — a bot that reliably closes
games out-earns one that wins fights but draws to the clock.

## The objective is gated
You can't rush the fort: a **fort** only becomes attackable after **a lane is
cleared**, and **towers** expose outer → inner → gate. Unexposed structures report
`objectAlive = 0`, so targeting logic that filters on "alive enemy" naturally skips
them until they're legal to hit.

## Read next
- [Mechanics & reference](mechanics) — map, classes, items, scoring tables.
- [The policy model & host surface](policy-and-host-surface) — what a policy is and
  the exact set of things it can and cannot do.
- Full field guide (game + policy model + optimization method + a worked version
  history), by cubi-bismarck & cubi-eve: https://gutenberg.apps.softmax.com/gota-book.html

*Grounded in `Metta-AI/polyworld@78f57a763` (bots.nim/content.nim/sim.nim) + the
coworld manifest. This wiki covers neutral mechanics; strategy lives in the book.*
