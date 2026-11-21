"""Write v/visitors.json: page views per country from GoatCounter (read-only API token in env GC_TOKEN).
Only country code, name and count are kept. Usage: python3 visitors.py <site-code> [fixture.json]"""
import datetime, json, os, re, sys, urllib.request

code_site = sys.argv[1]
world = json.load(open('v/world.json'))['c']
by_name = {v['n'].lower(): k for k, v in world.items()}
by_name.update({'united states': 'US', 'united kingdom': 'GB', 'russia': 'RU', 'south korea': 'KR', 'czechia': 'CZ', 'czech republic': 'CZ', 'hong kong': 'HK', 'taiwan': 'TW', 'vietnam': 'VN', 'turkey': 'TR', 'türkiye': 'TR'})

def fetch(offset):
    if len(sys.argv) > 2:
        return json.load(open(sys.argv[2]))
    url = 'https://%s.goatcounter.com/api/v0/stats/locations?limit=100&offset=%d&start=2020-01-01T00:00:00Z' % (code_site, offset)
    req = urllib.request.Request(url, headers={'Authorization': 'Bearer ' + os.environ['GC_TOKEN'], 'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

rows, offset = {}, 0
while True:
    j = fetch(offset)
    for s in j.get('stats', []):
        i, n = str(s.get('id', '')), str(s.get('name', ''))
        c = i if re.fullmatch(r'[A-Z]{2}', i) else by_name.get(n.lower())
        if c in world:
            rows[c] = rows.get(c, 0) + int(s.get('count', 0))
    if not j.get('more') or len(sys.argv) > 2:
        break
    offset += 100

out = {'updated': datetime.date.today().isoformat(),
       'countries': [{'c': c, 'n': world[c]['n'], 'v': v} for c, v in sorted(rows.items(), key=lambda kv: -kv[1]) if v > 0]}
json.dump(out, open('v/visitors.json', 'w'), separators=(',', ':'), ensure_ascii=False)
print(len(out['countries']), 'countries')
