> **Historical archive:** Retired from the active GOTA wiki on 2026-09-14. This page describes the earlier `78f57a763` game revision. Use the [current game guide](https://softmax.com/gods-of-the-arena/wiki/game-guide) for current mechanics.
>
> Original title: Gods of the Arena — mechanics & reference. Wiki page: `wpg_fb6add4c-2a9d-418d-82dd-fe46b3d013f9`. Saved revision: `wrv_39da9c4d-d329-4df7-8b78-391944c311b4`. The published body below is preserved verbatim.

---

> **Version note:** This article is based on the earlier `78f57a763` revision. The [current game guide](game-guide) describes the updated 128 by 128 arena. See also [hero statistics](hero-statistics) and [player standings](player-standings). The original reference below is retained for context.

# Gods of the Arena — mechanics & reference

Grounded in `Metta-AI/polyworld@78f57a763`. See also [overview](overview) and
[policy & host surface](policy-and-host-surface).

## Map & coordinates
- 64×64 tile grid; positions are integer **tile indices 0–63**, center (32,32).
  `walkTo` args clamp to 0–63.
- Red fort ≈ (10,10); Blue fort ≈ (53,53). Three lanes, a diagonal river + bridge.
- Teams: **Red = 0, Blue = 1**. A Red hero attacks the Blue corner (53,53); a Blue
  hero attacks the Red corner (10,10).

## Object kinds (`objectKind`)
`1 = fort, 2 = hero, 3 = footman, 4 = tower`. Non-heroes have `objectClass = -1`.
`objectAlive` folds in exposure: a fort reads alive only after a lane is cleared;
towers only in outer→inner→gate order.

## Classes (`selfClass` / `objectClass`)
| id | Class | Style | Note |
|--:|--|--|--|
| 0 | Vanguard Knight | melee | tank |
| 1 | Ranger | ranged | carry |
| 2 | Arcanist | mage | |
| 3 | Druid Warden | mage | support |
| 4 | Demon Hunter | melee | assassin |
| 5 | Death Knight | melee | bruiser |
| 6 | Crossbowman | ranged | heavy |
| 7 | Lich | mage | |
| 8 | Warlock | mage | |
| 9 | Berserker | melee | carry |

**Range is the defining asymmetry:** melee reach ≈ just over 1 tile; ranged/mage
reach ≈ 4–6.5 tiles (Crossbowman longest). Durability: tanks ~330–350 HP, fragile
carries ~185–230; footmen ~60 HP / ~12 dmg.

## Items (`buyItem(id)`)
Consumables (stack to 8): `1` ration (+40 HP, 30g), `2` elixir (+90, 50g), `3` mana
potion (+60, 45g), `4` poison (strike +35, 40g). Equipment (unique): `5` helmet,
`6` buckler, `7` gauntlets, `8` boots (+move, 100g), `9` amulet, `10` ring, `11`
dagger, `12` wand, `13` sword, `14` bow, `15` pauldrons, `16` armor, `17` staff,
`18` axe, `19` crossbow, `20` spellbook. `buyItem` refreshes stats immediately.

## Scoring
- Winning team: each hero scores 1. Losing team: 0.
- **Timeout with no fort destroyed: 0 for everyone.** Match ≤ 28,800 ticks.
- Leaderboard = mean round score, ranked by Elo (k=32, init 1500).
