#!/usr/bin/env bash
# Build the static site and publish it to the Oracle VM (nginx serves /var/www/sauravsharma.info).
set -euo pipefail
cd "$(dirname "$0")"

HOST="${DEPLOY_HOST:-vm_oracle}"
DEST="/var/www/sauravsharma.info/"

pnpm lint
pnpm test
pnpm build
rsync -az --delete --human-readable --stats out/ "$HOST:$DEST" | grep -E "Number of (created|deleted|regular files transferred)|Total transferred"
code=$(curl -s -o /dev/null -w "%{http_code}" https://sauravsharma.info/)
echo "Live: https://sauravsharma.info → HTTP $code"
[ "$code" = "200" ]
