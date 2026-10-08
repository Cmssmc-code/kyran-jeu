#!/bin/bash
# Claude Code web : installe uv (uvx) pour le serveur MCP Bing Webmaster (scripts/mcp/bing.mjs).
set -euo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
command -v uvx >/dev/null || pip install -q uv || echo "installation de uv impossible" >&2
