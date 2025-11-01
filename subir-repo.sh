#!/usr/bin/env bash
set -e

echo "🚀 Subiendo cambios de Autoservice Liam-Yahir..."
git add .
git commit -m "Actualización automática $(date '+%Y-%m-%d %H:%M:%S')"
git push origin v2.0
echo "✅ Cambios subidos con éxito."
