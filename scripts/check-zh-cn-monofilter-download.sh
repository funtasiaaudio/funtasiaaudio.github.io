#!/usr/bin/env bash
# End-to-end download integrity check from GitHub Actions' Ubuntu runner.
# Does NOT test network reachability or download performance from mainland China.
set -euo pipefail

url="https://github.com/funtasiaaudio/FUN-MonoFilter/releases/download/v1.1.0/FUN.MonoFilter.1.1.0.zip"
expected_bytes="6070159"
expected_sha256="9dc913b61d15f75be86ca9e1f34b9b432a61c642eec968a5747e8fbcdf3d32f6"

zipfile="$(mktemp --suffix=.zip)"
trap 'rm -f "$zipfile"' EXIT

curl --fail --location --retry 3 --retry-delay 2 \
  --connect-timeout 15 --max-time 120 --silent --show-error \
  --output "$zipfile" "$url"

actual_bytes="$(stat -c%s "$zipfile")"
if [[ "$actual_bytes" != "$expected_bytes" ]]; then
  echo "::error::Release ZIP size mismatch: $actual_bytes (expected $expected_bytes)"
  exit 1
fi
actual_sha256="$(sha256sum "$zipfile" | cut -d' ' -f1)"
if [[ "$actual_sha256" != "$expected_sha256" ]]; then
  echo "::error::Release ZIP SHA-256 mismatch: $actual_sha256"
  exit 1
fi
unzip -tqq "$zipfile"
echo "Official FUN MonoFilter v1.1.0 ZIP download integrity: PASS"
echo "Bytes: $actual_bytes"
echo "SHA-256: $actual_sha256"
echo "ZIP internal CRC: PASS"
echo "Network vantage: GitHub-hosted Ubuntu runner; mainland-China access not tested."
