import json, sys
sys.path.insert(0, '/work/tools')
from logo import run

def close(a, b):
    return abs(a-b) <= 1e-4

def seg_eq(a, b):
    return all(close(x, y) for x, y in zip(a['from'], b['from'])) and all(close(x, y) for x, y in zip(a['to'], b['to'])) and a['color'] == b['color'] and close(a['width'], b['width'])

def check(case):
    res = run(case['source'], case['mode'])
    exp = case['expect']
    msgs = []
    if 'error' in exp and exp['error'] is not None:
        if res['error'] is None:
            msgs.append(f"expected error {exp['error']} but ran ok with {len(res['segments'])} segs")
        else:
            if exp['error'].get('line') != res['error']['line']:
                msgs.append(f"error line exp {exp['error'].get('line')} got {res['error']}")
            elif 'column' in exp['error'] and exp['error']['column'] != res['error']['column']:
                msgs.append(f"error col exp {exp['error']} got {res['error']}")
        if 'segments' in exp:
            if len(exp['segments']) != len(res['segments']) or not all(seg_eq(a, b) for a, b in zip(exp['segments'], res['segments'])):
                msgs.append(f"segments differ: exp {len(exp['segments'])} got {len(res['segments'])}")
    else:
        if res['error'] is not None:
            msgs.append(f"unexpected error {res['error']}")
        else:
            es = exp.get('segments', [])
            if len(es) != len(res['segments']):
                msgs.append(f"segment count exp {len(es)} got {len(res['segments'])}")
            else:
                for i, (a, b) in enumerate(zip(es, res['segments'])):
                    if not seg_eq(a, b):
                        msgs.append(f"segment {i} differs: exp {a} got {b}"); break
    return msgs

if __name__ == '__main__':
    for f in sys.argv[1:]:
        d = json.load(open(f))
        bad = 0
        for i, c in enumerate(d['cases']):
            m = check(c)
            if m:
                bad += 1
                print(f"[{f} #{i}] {c['name']}: " + '; '.join(m))
        print(f"{f}: {len(d['cases'])} cases, {bad} mismatches")
