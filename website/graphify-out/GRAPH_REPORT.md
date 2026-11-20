# Graph Report - website  (2026-11-20)

## Corpus Check
- 4 files · ~10,225 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .css 3)

## Summary
- 10 nodes · 10 edges · 4 communities (1 shown, 3 thin omitted)
- Extraction: 70% EXTRACTED · 30% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
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

## Communities (4 total, 3 thin omitted)

### Community 1 - "render"
Cohesion: 0.67
Nodes (3): loop(), render(), setWorld()

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `render()` connect `render` to `future.js`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._