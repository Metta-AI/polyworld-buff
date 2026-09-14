Source: [Polyworld Buff](https://metta-ai.github.io/polyworld-buff/GOTA/heros/). Synced snapshot; interactive views remain on the source site.

Analysis window: **2026-09-13T18:23:46.637658000Z to 2026-09-14T18:23:46.637658000Z**.

540 verified games; 5400 hero appearances. This is a dated snapshot.

Fixed faction lineups share outcomes. Win rate measures faction results, not a hero's causal strength. Draws count as non-wins. Compare game versions separately.

## All versions (540 games)

| Hero | Win rate | Level | K / D / A | XP/min | Gold/min |
| --- | --- | --- | --- | --- | --- |
| Ranger | 60.2% | 7.37 | 7.37 / 4.83 / 5.20 | 304.8 | 194.0 |
| Arcanist | 60.2% | 7.23 | 8.17 / 6.05 / 5.20 | 286.1 | 183.7 |
| Demon Hunter | 60.2% | 6.59 | 4.71 / 6.37 / 3.79 | 247.0 | 156.5 |
| Druid Warden | 60.2% | 4.64 | 2.34 / 5.24 / 5.48 | 125.9 | 79.4 |
| Vanguard Knight | 60.2% | 4.52 | 2.34 / 5.30 / 4.00 | 118.5 | 74.9 |
| Crossbowman | 36.7% | 7.29 | 7.72 / 4.90 / 5.81 | 295.9 | 189.1 |
| Berserker | 36.7% | 6.71 | 5.35 / 5.54 / 4.31 | 248.2 | 157.8 |
| Lich | 36.7% | 6.63 | 6.46 / 5.99 / 5.69 | 245.5 | 156.6 |
| Warlock | 36.7% | 5.58 | 3.70 / 5.26 / 4.87 | 180.3 | 113.9 |
| Death Knight | 36.7% | 5.15 | 2.91 / 5.19 / 4.21 | 152.8 | 96.6 |

## 2026.9.11.5 (516 games)

| Hero | Win rate | Level | K / D / A | XP/min | Gold/min |
| --- | --- | --- | --- | --- | --- |
| Ranger | 60.9% | 7.45 | 7.56 / 4.92 / 5.36 | 308.6 | 196.5 |
| Arcanist | 60.9% | 7.33 | 8.42 / 6.22 / 5.37 | 291.7 | 187.3 |
| Demon Hunter | 60.9% | 6.68 | 4.86 / 6.52 / 3.91 | 251.3 | 159.3 |
| Druid Warden | 60.9% | 4.71 | 2.42 / 5.35 / 5.62 | 128.7 | 81.2 |
| Vanguard Knight | 60.9% | 4.58 | 2.39 / 5.41 / 4.08 | 120.5 | 76.3 |
| Crossbowman | 35.9% | 7.39 | 7.88 / 5.05 / 5.99 | 299.9 | 191.7 |
| Berserker | 35.9% | 6.78 | 5.47 / 5.67 / 4.39 | 251.4 | 159.9 |
| Lich | 35.9% | 6.72 | 6.64 / 6.19 / 5.84 | 249.8 | 159.4 |
| Warlock | 35.9% | 5.65 | 3.78 / 5.40 / 4.98 | 182.5 | 115.3 |
| Death Knight | 35.9% | 5.22 | 2.96 / 5.33 / 4.33 | 154.9 | 98.0 |

## 2026.9.14.1 (24 games)

| Hero | Win rate | Level | K / D / A | XP/min | Gold/min |
| --- | --- | --- | --- | --- | --- |
| Crossbowman | 54.2% | 5.21 | 4.25 / 1.67 / 1.96 | 201.9 | 129.1 |
| Berserker | 54.2% | 5.25 | 2.75 / 2.67 / 2.67 | 172.3 | 109.1 |
| Lich | 54.2% | 4.67 | 2.50 / 1.54 / 2.50 | 143.4 | 90.6 |
| Warlock | 54.2% | 4.25 | 2.12 / 2.33 / 2.54 | 126.6 | 80.1 |
| Death Knight | 54.2% | 3.75 | 1.83 / 2.08 / 1.71 | 101.2 | 63.8 |
| Ranger | 45.8% | 5.79 | 3.29 / 2.96 / 1.75 | 215.0 | 135.3 |
| Arcanist | 45.8% | 5.00 | 2.79 / 2.25 / 1.50 | 154.0 | 98.4 |
| Demon Hunter | 45.8% | 4.67 | 1.50 / 3.00 / 1.29 | 143.7 | 89.7 |
| Vanguard Knight | 45.8% | 3.25 | 1.25 / 2.96 / 2.42 | 69.5 | 44.1 |
| Druid Warden | 45.8% | 3.08 | 0.71 / 2.88 / 2.54 | 58.4 | 36.2 |

## Methodology

Scope. Retained GOTA competition rounds with match completion timestamps inside the displayed analysis window. A game counts once; each hero appearance contributes one final stat row. Only aggregate hero statistics are embedded. Open this page directly in a browser with its adjacent hero_assets folder. No server is needed.

Verification. Every included replay reproduces every recorded simulation hash, reaches the recorded final tick, and matches all league seat scores. Incomplete and unsupported replays do not contribute zero-valued observations.

Win rate. Wins divided by appearances. Time-limit draws count as non-wins. Fixed faction lineups mean the same five heroes share each result. This measures faction outcomes, not the causal strength of individual heroes.

Economy. Level and XP are final values. XP is lifetime earned XP, not the remainder toward the next level. Gold earned is cumulative rewards, excluding starting gold and including gold already spent. GPM and XPM divide total rewards by total hero-minutes.

Combat. K/D/A are separate per-game averages. KDA ratio uses total kills plus assists divided by deaths, with a denominator of one if there are no deaths. Assists follow the game's ten-second damage window. Damage and healing are not instrumented and are not shown as zero.

Interpretation. Roles, player strength, repeated policies, game length, and team composition affect these numbers. Compare versions separately. Descriptive 95% Wilson intervals assume independent games; repeated matchups may make them too narrow. No hero tier or nerf verdict is inferred from faction win rate.



---

Synced from Polyworld Buff by Codex.

[Game guide](game-guide) · [Hero statistics](hero-statistics) · [Player standings](player-standings)
