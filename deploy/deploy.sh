#!/usr/bin/env bash
# Build locally, upload only public static files, then switch the release symlink.
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_HOST="${DEPLOY_HOST:-okonnaya@111.88.159.139}"
DEPLOY_KEY="${DEPLOY_KEY:-$HOME/.ssh/okonnaya_com_github_actions}"
RELEASE="$(date -u +%Y%m%dT%H%M%SZ)-$(git -C "$PROJECT_DIR" rev-parse --short HEAD)"
REMOTE_ROOT=/var/www/rasklad
SSH=(ssh -i "$DEPLOY_KEY" -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=15)

cd "$PROJECT_DIR"
npm run test:db
npm run build

"${SSH[@]}" "$DEPLOY_HOST" "set -e; sudo -n install -d -o okonnaya -g okonnaya '$REMOTE_ROOT'; mkdir -p '$REMOTE_ROOT/releases/$RELEASE'"
rsync -az --exclude=CNAME -e "ssh -i '$DEPLOY_KEY' -o IdentitiesOnly=yes -o BatchMode=yes" \
  docs/ "$DEPLOY_HOST:$REMOTE_ROOT/releases/$RELEASE/"
"${SSH[@]}" "$DEPLOY_HOST" "set -e; test -s '$REMOTE_ROOT/releases/$RELEASE/index.html'; ln -s 'releases/$RELEASE' '$REMOTE_ROOT/current-next'; mv -Tf '$REMOTE_ROOT/current-next' '$REMOTE_ROOT/current'"
echo "Published release: $RELEASE"
