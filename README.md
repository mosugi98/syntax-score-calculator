# SYNTAX Score Calculator

A single-file, offline web app for calculating the SYNTAX Score, built for use on a cath lab PC or tablet. Open `index.html` in any browser. No install, no server, and nothing is stored or transmitted.

## Disclaimer
Educational tool. This is an independent re-implementation, not the official calculator (syntaxscore.org), and it has not been clinically validated. It is not a substitute for clinical judgment. Verify results against the official calculator before relying on them.

## Known differences from the original
- Segments not visualised beyond a total occlusion is a simple count, not the original's dominance-specific lookup.
- Non-occlusive lesions score segment weight x2 (published SYNTAX method).
- Risk tiers (low <=22, intermediate 23-32, high >=33) are from the published SYNTAX trial.
- SYNTAX Score II is not implemented.

## Tests
`node test.js` checks the scoring logic embedded in `index.html`.
