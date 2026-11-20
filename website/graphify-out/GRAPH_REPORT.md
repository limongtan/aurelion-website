# Graph Report - website  (2026-11-20)

## Corpus Check
- 8 files · ~63,218 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .css 8)

## Summary
- 32 nodes · 68 edges · 8 communities (5 shown, 3 thin omitted)
- Extraction: 76% EXTRACTED · 24% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- future.js
- glow
- project
- tech.js
- draw

## God Nodes (most connected - your core abstractions)
1. `project()` - 10 edges
2. `glow()` - 8 edges
3. `path()` - 8 edges
4. `pane()` - 7 edges
5. `draw()` - 6 edges
6. `daylight()` - 6 edges
7. `dot()` - 5 edges
8. `sentinel()` - 5 edges
9. `terra()` - 5 edges
10. `flow()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `draw()` --calls--> `dot()`  [EXTRACTED]
  tech.js → tech.js  _Bridges community 1 → community 6_
- `terra()` --calls--> `dot()`  [EXTRACTED]
  tech.js → tech.js  _Bridges community 1 → community 5_
- `daylight()` --calls--> `glow()`  [EXTRACTED]
  tech.js → tech.js  _Bridges community 1 → community 4_
- `terra()` --calls--> `project()`  [EXTRACTED]
  tech.js → tech.js  _Bridges community 5 → community 4_

## Import Cycles
- None detected.

## Communities (8 total, 3 thin omitted)

### Community 0 - "future.js"
Cohesion: 0.43
Nodes (4): loop(), render(), resize(), setWorld()

### Community 1 - "glow"
Cohesion: 0.67
Nodes (4): dot(), glow(), orbit(), sentinel()

### Community 4 - "project"
Cohesion: 0.54
Nodes (8): daylight(), flow(), motive(), pane(), path(), project(), signal(), stack()

### Community 5 - "tech.js"
Cohesion: 0.83
Nodes (3): ellipse(), nova(), terra()

### Community 6 - "draw"
Cohesion: 0.67
Nodes (4): draw(), loop(), resize(), sync()

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `project()` connect `project` to `glow`, `tech.js`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `glow()` connect `glow` to `project`, `tech.js`, `draw`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `path()` connect `project` to `glow`, `tech.js`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._