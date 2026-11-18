# Graph Report - vibe-coding  (2026-11-18)

## Corpus Check
- 1 files · ~954 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 1 file(s) not represented in the graph (top: .css 1)

## Summary
- 7 nodes · 12 edges · 2 communities
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- studio.js
- draw

## God Nodes (most connected - your core abstractions)
1. `draw()` - 5 edges
2. `setPaused()` - 4 edges
3. `loop()` - 3 edges
4. `updateMotion()` - 2 edges
5. `resize()` - 2 edges
6. `point()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `setPaused()` --calls--> `draw()`  [EXTRACTED]
  studio.js → studio.js  _Bridges community 0 → community 1_

## Import Cycles
- None detected.

## Communities (2 total, 0 thin omitted)

### Community 0 - "studio.js"
Cohesion: 0.83
Nodes (3): loop(), setPaused(), updateMotion()

### Community 1 - "draw"
Cohesion: 0.67
Nodes (3): draw(), point(), resize()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `draw()` connect `draw` to `studio.js`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `loop()` (e.g. with `studio.js` and `setPaused()`) actually correct?**
  _`loop()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Why does `setPaused()` connect `studio.js` to `draw`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._