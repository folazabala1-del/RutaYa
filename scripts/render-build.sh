#!/usr/bin/env bash
set -e

echo "== 1. Instalando y compilando el FRONTEND =="
npm install
npm run build

echo "== 2. Copiando el build del frontend a backend/public =="
rm -rf backend/public
cp -r dist backend/public

echo "== 3. Instalando dependencias del BACKEND =="
cd backend
npm install

echo "== Build completo. Listo para 'npm run db:migrate && npm start' dentro de backend/ =="
