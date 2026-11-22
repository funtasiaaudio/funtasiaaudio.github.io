#!/usr/bin/env bash
# Validate live downloads of four Studio expansion release ZIPs (69 MB total).
# Do not download the 650.6 MB orchestral pack in routine PR CI; its official
# GitHub Release asset size + SHA-256 are checked through the REST API instead.
set -euo pipefail
tmp="$(mktemp --directory)"
trap 'rm -rf "$tmp"' EXIT

check_zip() {
  local name="$1" url="$2" expected_size="$3" expected_sha256="$4"
  local dest="$tmp/$name"
  curl --fail --location --retry 3 --retry-delay 2 \
       --connect-timeout 15 --max-time 180 --silent --show-error --output "$dest" "$url"
  local size
  size="$(stat -c%s "$dest")"
  if [[ "$size" != "$expected_size" ]]; then
    echo "::error::$name size $size expected $expected_size"
    exit 1
  fi
  local sha256
  sha256="$(sha256sum "$dest" | cut -d' ' -f1)"
  if [[ "$sha256" != "$expected_sha256" ]]; then
    echo "::error::$name SHA-256 mismatch $sha256"
    exit 1
  fi
  unzip -tqq "$dest"
  echo "$name: PASS $size bytes / SHA-256 / ZIP CRC"
}

check_zip 'Kawaii_Wavetable_Vol1.zip' \
  'https://github.com/funtasiaaudio/The-Wavelace-Kawaii-Wavetable-Vol1/releases/download/v1.0.0/Kawaii_Wavetable_Vol1.zip' \
  '61179905' 'b5d7cc2352d8b2f2b17b2f23b139051398edfbb972e6df3413f50900433a8290'
check_zip 'Nyan_8bit_Drum_Kit_Vol_1.zip' \
  'https://github.com/funtasiaaudio/nyan-8bit-drum-kit-vol-1/releases/download/v1.0.0/Nyan_8bit_Drum_Kit_Vol_1.zip' \
  '594270' 'a3b157ac89419044a6d0a481d8060a5d76a1c6817fc4cffc27c5fae9c61f858b'
check_zip 'FUN_Epic_Metal_Drums_Vol01_v1.0.0_Free.zip' \
  'https://github.com/funtasiaaudio/FUNtasia-Studio-Expansion-Packs/releases/download/FEM01-v1.0.0/FUN_Epic_Metal_Drums_Vol01_v1.0.0_Free.zip' \
  '3608882' '2b998057bb17a455f966f14e372aef3acb2038baef84fdd8ee6b7d33ff130c89'
check_zip 'FUN_Fantasy_Folk_Drums_MIDI_Pack_v1.0.0.zip' \
  'https://github.com/funtasiaaudio/fun-fantasy-folk-drums-midi-pack/releases/download/v1.0.0/FUN_Fantasy_Folk_Drums_MIDI_Pack_v1.0.0.zip' \
  '3507170' 'ac111054ea450145ed13931d4272b4c49de8aa4c1b4312fa8d7e100a0b6b8ff3'
echo 'Studio four ZIP real-download integrity: PASS (size + official SHA-256 + unzip CRC from GitHub Actions runner)'
