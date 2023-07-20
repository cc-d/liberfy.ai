#/bin/sh
echo "Requesting http://localhost:8888/openapi.json"
npx openapi-typescript-codegen generate --input http://localhost:8888/openapi.json --output ./frontend/src/api
echo "generated ./frontend/src/api"
ls -aAhF ./frontend/src/api