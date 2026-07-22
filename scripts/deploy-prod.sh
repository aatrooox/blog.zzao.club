#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

CONFIG_FILE="${DEPLOY_CONFIG_FILE:-${PROJECT_ROOT}/.deploy.prod.env}"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
ARCHIVE_FILE=""
STAGE_DIR=""

log() {
  printf '[deploy] %s\n' "$*"
}

die() {
  printf '[deploy] ERROR: %s\n' "$*" >&2
  exit 1
}

is_enabled() {
  case "${1:-}" in
    1 | true | TRUE | yes | YES | on | ON) return 0 ;;
    *) return 1 ;;
  esac
}

quote() {
  printf '%q' "$1"
}

cleanup() {
  if [[ -n "${ARCHIVE_FILE}" && -f "${ARCHIVE_FILE}" ]]; then
    rm -f "${ARCHIVE_FILE}"
  fi
  if [[ -n "${STAGE_DIR}" && -d "${STAGE_DIR}" ]]; then
    rm -rf "${STAGE_DIR}"
  fi
}
trap cleanup EXIT

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

tar_supports() {
  tar "$1" -cf /dev/null --files-from /dev/null >/dev/null 2>&1
}

remember_override() {
  local name="$1"
  eval "if [[ \${${name}+x} ]]; then __DEPLOY_HAS_${name}=1; __DEPLOY_OVERRIDE_${name}=\${${name}}; fi"
}

restore_override() {
  local name="$1"
  eval "if [[ \${__DEPLOY_HAS_${name}:-} == 1 ]]; then ${name}=\${__DEPLOY_OVERRIDE_${name}}; fi"
}

if [[ ! -f "${CONFIG_FILE}" ]]; then
  die "Missing deploy config: ${CONFIG_FILE}. Copy .deploy.prod.env.example to .deploy.prod.env and fill it first."
fi

DEPLOY_VARS=(
  APP_NAME
  REMOTE_HOST
  REMOTE_USER
  REMOTE_PORT
  REMOTE_WWW_DIR
  RUN_INSTALL
  RUN_LINT
  RUN_GENERATE
  LOCAL_INSTALL_CMD
  LOCAL_LINT_CMD
  LOCAL_GENERATE_CMD
)

for name in "${DEPLOY_VARS[@]}"; do
  remember_override "${name}"
done

set -a
# shellcheck disable=SC1090
. "${CONFIG_FILE}"
set +a

for name in "${DEPLOY_VARS[@]}"; do
  restore_override "${name}"
done

: "${REMOTE_HOST:?REMOTE_HOST is required in ${CONFIG_FILE}}"
: "${REMOTE_USER:?REMOTE_USER is required in ${CONFIG_FILE}}"

APP_NAME="${APP_NAME:-blog}"
REMOTE_PORT="${REMOTE_PORT:-22}"
REMOTE_WWW_DIR="${REMOTE_WWW_DIR:-/var/www/blog.nezus.cn}"

RUN_INSTALL="${RUN_INSTALL:-true}"
RUN_LINT="${RUN_LINT:-true}"
RUN_GENERATE="${RUN_GENERATE:-true}"

LOCAL_INSTALL_CMD="${LOCAL_INSTALL_CMD:-pnpm install --frozen-lockfile}"
LOCAL_LINT_CMD="${LOCAL_LINT_CMD:-pnpm lint}"
# pregenerate 会自动跑 extract:tags；此处显式再跑一次，保证部署日志可见
LOCAL_EXTRACT_TAGS_CMD="${LOCAL_EXTRACT_TAGS_CMD:-pnpm extract:tags}"
LOCAL_GENERATE_CMD="${LOCAL_GENERATE_CMD:-env NODE_OPTIONS=--max-old-space-size=4096 pnpm generate}"

REMOTE_ARCHIVE="/tmp/${APP_NAME}-${TIMESTAMP}.tar.gz"
SSH_TARGET="${REMOTE_USER}@${REMOTE_HOST}"
SSH_ARGS=(-p "${REMOTE_PORT}" -o BatchMode=yes -o ConnectTimeout=15)
SCP_ARGS=(-P "${REMOTE_PORT}" -o BatchMode=yes -o ConnectTimeout=15)

require_command bash
require_command ssh
require_command scp
require_command tar
require_command node
require_command pnpm

cd "${PROJECT_ROOT}"

log "Deploying ${APP_NAME} to ${REMOTE_WWW_DIR}"

if is_enabled "${RUN_INSTALL}"; then
  log "Running local install"
  bash -lc "${LOCAL_INSTALL_CMD}"
fi

if is_enabled "${RUN_LINT}"; then
  log "Running local lint"
  bash -lc "${LOCAL_LINT_CMD}"
fi

log "Extracting content tags"
bash -lc "${LOCAL_EXTRACT_TAGS_CMD}"

if is_enabled "${RUN_GENERATE}"; then
  log "Running static generation"
  bash -lc "${LOCAL_GENERATE_CMD}"
fi

[[ -d .output/public ]] || die "Missing .output/public. Run nuxi generate before deploying."

log "Packing static files"
ARCHIVE_FILE="$(mktemp -t "${APP_NAME}-deploy.XXXXXX.tar.gz")"

TAR_EXTRA_ARGS=()
if tar_supports --no-xattrs; then
  TAR_EXTRA_ARGS+=(--no-xattrs)
fi
if tar_supports --no-mac-metadata; then
  TAR_EXTRA_ARGS+=(--no-mac-metadata)
fi

COPYFILE_DISABLE=1 COPY_EXTENDED_ATTRIBUTES_DISABLE=1 tar \
  "${TAR_EXTRA_ARGS[@]}" \
  --exclude='._*' \
  --exclude='.DS_Store' \
  -czf "${ARCHIVE_FILE}" \
  -C "${PROJECT_ROOT}/.output/public" \
  .

log "Uploading artifact"
scp "${SCP_ARGS[@]}" "${ARCHIVE_FILE}" "${SSH_TARGET}:${REMOTE_ARCHIVE}"

log "Installing artifact on remote host"
ssh "${SSH_ARGS[@]}" "${SSH_TARGET}" \
  "REMOTE_WWW_DIR=$(quote "${REMOTE_WWW_DIR}") \
  REMOTE_ARCHIVE=$(quote "${REMOTE_ARCHIVE}") \
  bash -s" <<'REMOTE_SCRIPT'
set -euo pipefail

log() {
  printf '[deploy:remote] %s\n' "$*"
}

die() {
  printf '[deploy:remote] ERROR: %s\n' "$*" >&2
  exit 1
}

command -v tar >/dev/null 2>&1 || die "Missing required command: tar"
[[ -f "${REMOTE_ARCHIVE}" ]] || die "Uploaded archive not found: ${REMOTE_ARCHIVE}"

log "Replacing site files"
mkdir -p "${REMOTE_WWW_DIR}"
find "${REMOTE_WWW_DIR}" -mindepth 1 -maxdepth 1 ! -name '.' -exec rm -rf {} +
tar -xzf "${REMOTE_ARCHIVE}" -C "${REMOTE_WWW_DIR}"
find "${REMOTE_WWW_DIR}" -name '._*' -delete
rm -f "${REMOTE_ARCHIVE}"

log "Deployment finished"
REMOTE_SCRIPT

log "Deployment finished"
