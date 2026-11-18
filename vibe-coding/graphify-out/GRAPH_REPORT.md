# Graph Report - vibe-coding  (2026-11-19)

## Corpus Check
- 2 files · ~25,643 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .css 3)

## Summary
- 13 nodes · 18 edges · 2 communities (1 shown, 1 thin omitted)
- Extraction: 78% EXTRACTED · 22% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- studio.js
- guide.js

## God Nodes (most connected - your core abstractions)
1. `draw()` - 5 edges
2. `setPaused()` - 4 edges
3. `loop()` - 3 edges
4. `updateMotion()` - 2 edges
5. `resize()` - 2 edges
6. `point()` - 2 edges
7. `el()` - 2 edges
8. `link()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (2 total, 1 thin omitted)

### Community 0 - "studio.js"
Cohesion: 0.57
Nodes (6): draw(), loop(), point(), resize(), setPaused(), updateMotion()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `loop()` (e.g. with `studio.js` and `setPaused()`) actually correct?**
  _`loop()` has 2 INFERRED edges - model-reasoned connections that need verification._