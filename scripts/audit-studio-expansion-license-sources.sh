#!/usr/bin/env bash
# Read exact release license text without executing pack contents.
# All official release assets are pinned to their published byte lengths / SHA-256.
# 650 MB orchestral audio ZIP excluded: the separate official license asset is audited.
set -euo pipefail
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
mkdir -p artifacts/studio-expansion-license

fetch() {
  local key="$1" url="$2" bytes="$3" sha256="$4" filename="$5"
  local output="$tmp/$filename"
  curl --fail --location --retry 3 --retry-delay 2 \
       --connect-timeout 15 --max-time 150 --silent --show-error \
       --output "$output" "$url"
  test "$(stat -c%s "$output")" = "$bytes" || {
    echo "::error::$key release asset size mismatch";exit 1;
  }
  echo "$sha256  $output" | sha256sum -c --status || {
    echo "::error::$key release asset SHA-256 mismatch";exit 1;
  }
  echo "$key: official asset length and SHA-256 PASS"
}
fetch 'wavelace-license' \
 'https://github.com/funtasiaaudio/The-Wavelace-Kawaii-Wavetable-Vol1/releases/download/v1.0.0/LICENSE.txt' \
 11860 73f00d161c1b6ee7a2fe934dc67011e99306c21a4e9d12130271e3eebdd3f4e5 wavelace-license.txt
fetch 'orchestral-license' \
 'https://github.com/funtasiaaudio/fun-orchestral-percussion-vol-1/releases/download/v1.0.0/FUN_Orchestral_Percussion_Vol1_LICENSE.txt' \
 7051 615efd1c80cb36b6699fe49dd0bd68b6904c9dca5249e4b6e48de171654d24ec orchestral-license.txt
fetch 'nyan8bit-license' \
 'https://github.com/funtasiaaudio/nyan-8bit-drum-kit-vol-1/releases/download/v1.0.0/LICENSE.txt' \
 6510 06c2e8073641dc455451619825b6d1256a31cf18d0ef7adeb5ae96fb6deb80d2 nyan8bit-license.txt
fetch 'epicmetal-zip' \
 'https://github.com/funtasiaaudio/FUNtasia-Studio-Expansion-Packs/releases/download/FEM01-v1.0.0/FUN_Epic_Metal_Drums_Vol01_v1.0.0_Free.zip' \
 3608882 2b998057bb17a455f966f14e372aef3acb2038baef84fdd8ee6b7d33ff130c89 epicmetal.zip
fetch 'folk-zip' \
 'https://github.com/funtasiaaudio/fun-fantasy-folk-drums-midi-pack/releases/download/v1.0.0/FUN_Fantasy_Folk_Drums_MIDI_Pack_v1.0.0.zip' \
 3507170 ac111054ea450145ed13931d4272b4c49de8aa4c1b4312fa8d7e100a0b6b8ff3 folk.zip

python3 - "$tmp" <<'PY'
import hashlib,json,pathlib,re,sys,zipfile
root=pathlib.Path(sys.argv[1])
out=pathlib.Path('artifacts/studio-expansion-license')
docs={}
for name in ['wavelace','orchestral','nyan8bit']:
    data=(root/(name+'-license.txt')).read_bytes()
    docs[name]=[{'path':'official standalone LICENSE.txt', 'text':data.decode('utf-8-sig','replace'),
                 'sha256':hashlib.sha256(data).hexdigest()}]
for key in ['epicmetal','folk']:
    with zipfile.ZipFile(root/(key+'.zip')) as z:
        allfiles=z.namelist()
        choices=[n for n in allfiles if not n.endswith('/') and
          re.search(r'(?:license|licence|利用条件|使用条款|terms|eula)',n,re.I) and
          re.search(r'\.(?:txt|md|markdown)$',n,re.I)]
        print(key,'license candidates:',choices)
        if not choices:
            print(key,'archive file sample:',allfiles[:45])
            raise SystemExit(key+': cannot find a text license file inside verified ZIP')
        expected={'epicmetal':'FUN_Epic_Metal_Drums_Vol01_v1.0.0/LICENSE.md',
                  'folk':'FUN_Fantasy_Folk_Drums_MIDI_Pack_v1.0.0/LICENSE.txt'}[key]
        if expected not in choices:
            raise SystemExit(key+': expected published '+expected+' missing from ZIP')
        docs[key]=[]
        for n in choices[:10]:
            data=z.read(n)
            docs[key].append({'path':n,'text':data.decode('utf-8-sig','replace'),
                              'sha256':hashlib.sha256(data).hexdigest()})
result={'scope':'source-document collection, not legal interpretation',
        'source':'exact published asset bytes and pinned SHA-256',
        'packs':{}}
for key, entries in docs.items():
    result['packs'][key]=[]
    for i,entry in enumerate(entries):
        body=entry['text']
        (out/(key+'-'+str(i)+'.txt')).write_text(body,encoding='utf-8')
        lines=[line.strip() for line in body.splitlines()]
        keylines=[line for line in lines if re.search(
          r'commercial|royalt|attribution|credit|redistribut|resell|sublicens|share|modif|derivative|作品|商用|再配布|改変|表記|禁止|許可',line,re.I)]
        item={'path':entry['path'],'sha256':entry['sha256'],
              'length_chars':len(body),'keyword_excerpts':keylines[:22]}
        result['packs'][key].append(item)
        print('\n'+key+' / '+entry['path']+' / '+str(len(body))+' characters')
        for line in keylines[:22]:print('  '+line[:300])
(out/'license-evidence.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print('\nOfficial Studio license evidence collection: PASS ('+
      str(sum(map(len,docs.values())))+' original license files across 5 packs)')
PY
