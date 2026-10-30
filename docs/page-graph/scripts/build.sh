#!/usr/bin/env bash
# Regenerates docs/page-graph: extracts the form structure, builds diagrams and renders SVGs (and PNGs for the overview diagrams).
set -euo pipefail
cd "$(dirname "$0")"

node extract.js
node generate.js

config=$(mktemp)
trap 'rm -f "$config"' EXIT
echo '{"maxEdges":2000,"maxTextSize":500000,"flowchart":{"useMaxWidth":false}}' > "$config"

cd ..
rm -f form-flow-*.svg form-flow-*.png
for mmd in *.mmd; do
  name="${mmd%.mmd}"
  npx -y -p @mermaid-js/mermaid-cli mmdc -q -b white -c "$config" -i "$mmd" -o "$name.svg"
done
for name in site-navigation form-flow-all; do
  npx -y -p @mermaid-js/mermaid-cli mmdc -q -b white -c "$config" -i "$name.mmd" -o "$name.png"
done
