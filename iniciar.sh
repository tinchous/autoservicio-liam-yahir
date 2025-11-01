#!/bin/bash
cd "$(dirname "$0")"
PORT=5500
python3 -m http.server $PORT >/dev/null 2>&1 &
sleep 1
xdg-open "http://localhost:$PORT" >/dev/null 2>&1
echo "🔥 Servidor iniciado en http://localhost:$PORT"
