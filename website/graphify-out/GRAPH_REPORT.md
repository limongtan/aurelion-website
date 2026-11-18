# Graph Report - website  (2026-11-18)

## Corpus Check
- 1 files · ~1,100 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 1 file(s) not represented in the graph (top: .css 1)

## Summary
- 7 nodes · 9 edges · 2 communities (1 shown, 1 thin omitted)
- Extraction: 78% EXTRACTED · 22% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- future.js
- render

## God Nodes (most connected - your core abstractions)
1. `render()` - 4 edges
2. `setWorld()` - 2 edges
3. `resize()` - 2 edges
4. `loop()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `resize()` --calls--> `render()`  [EXTRACTED]
  future.js → future.js  _Bridges community 0 → community 1_

## Import Cycles
- None detected.

## Communities (2 total, 1 thin omitted)

### Community 1 - "render"
Cohesion: 0.67
Nodes (3): loop(), render(), setWorld()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `render()` connect `render` to `future.js`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._