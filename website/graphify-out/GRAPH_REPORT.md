# Graph Report - website  (2026-11-20)

## Corpus Check
- 5 files · ~49,683 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 5)

## Summary
- 30 nodes · 67 edges · 6 communities (3 shown, 3 thin omitted)
- Extraction: 78% EXTRACTED · 22% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- future.js
- tech.js
- project
- ellipse

## God Nodes (most connected - your core abstractions)
1. `project()` - 10 edges
2. `path()` - 8 edges
3. `glow()` - 8 edges
4. `pane()` - 7 edges
5. `daylight()` - 6 edges
6. `draw()` - 6 edges
7. `dot()` - 5 edges
8. `flow()` - 5 edges
9. `sentinel()` - 5 edges
10. `terra()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `orbit()` --calls--> `project()`  [EXTRACTED]
  tech.js → tech.js  _Bridges community 4 → community 1_
- `daylight()` --calls--> `ellipse()`  [EXTRACTED]
  tech.js → tech.js  _Bridges community 5 → community 4_
- `terra()` --calls--> `ellipse()`  [EXTRACTED]
  tech.js → tech.js  _Bridges community 5 → community 1_

## Import Cycles
- None detected.

## Communities (6 total, 3 thin omitted)

### Community 0 - "future.js"
Cohesion: 0.43
Nodes (4): loop(), render(), resize(), setWorld()

### Community 1 - "tech.js"
Cohesion: 0.47
Nodes (9): dot(), draw(), glow(), loop(), orbit(), resize(), sentinel(), sync() (+1 more)

### Community 4 - "project"
Cohesion: 0.54
Nodes (8): daylight(), flow(), motive(), pane(), path(), project(), signal(), stack()

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `project()` connect `project` to `tech.js`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `glow()` connect `tech.js` to `project`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `path()` connect `project` to `tech.js`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._