#!/usr/bin/env python3
"""Build the inline icon sprite in index.html from Font Awesome Pro SVG files.

1. In your Font Awesome account (or kit) download the SVGs for the icons below, style
   "Duotone Thin" (for 'arrow-right': Solid), and save them as icons/<fa-name>.svg.
2. Run:  python3 scripts/build-icons.py
Icons without a file keep their current symbol, so you can swap them one by one.
Self-hosting your own downloaded Pro SVGs is covered by the Pro licence; keep the repo private.
"""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
# sprite id -> Font Awesome icon name (file icons/<name>.svg)
MAP = {
    'pin': 'map-pin', 'hourglass-half': 'hourglass-half', 'arrow-right': 'arrow-right',
    'sparkles': 'sparkles', 'pen-nib': 'pen-nib', 'circle-small': 'circle-small',
    'envelope-open-text': 'envelope-open-text', 'envelope': 'envelope', 'notebook': 'notebook',
    'bag-shopping': 'bag-shopping', 'gift': 'gift', 'arrow-up-right-from-square': 'arrow-up-right-from-square',
    'clock': 'clock', 'xmark': 'xmark', 'address-card': 'address-card', 'phone': 'phone',
    'globe': 'globe', 'code': 'code', 'expand': 'up-right-and-down-left-from-center',
}

def symbol(icon_id, svg):
    vb = re.search(r'viewBox="([^"]+)"', svg).group(1)
    paths = []
    for m in re.finditer(r'<path\b([^>]*)/?>', svg):
        attrs = m.group(1)
        d = re.search(r'\bd="([^"]+)"', attrs).group(1)
        cls = re.search(r'class="([^"]*)"', attrs)
        op = re.search(r'opacity="([^"]+)"', attrs)
        secondary = bool(cls and 'secondary' in cls.group(1))
        o = op.group(1) if op else ('.4' if secondary else None)
        extra = f' fill-opacity="{o}"' if o else ''
        paths.append(f'<path d="{d}" fill="currentColor" stroke="none"{extra}/>')
    return f'<symbol id="i-{icon_id}" viewBox="{vb}">{"".join(paths)}</symbol>'

html = (ROOT / 'index.html').read_text()
start = html.index('<!-- icons:start -->'); end = html.index('<!-- icons:end -->')
block = html[start:end]
symbols = dict(re.findall(r'<symbol id="i-([a-z-]+)"[^>]*>.*?</symbol>', block, flags=re.S) and
               [(m.group(1), m.group(0)) for m in re.finditer(r'<symbol id="i-([a-z-]+)"[^>]*>.*?</symbol>', block, flags=re.S)])
done = []
for icon_id, name in MAP.items():
    f = ROOT / 'icons' / f'{name}.svg'
    if icon_id in symbols and f.exists():
        symbols[icon_id] = symbol(icon_id, f.read_text()); done.append(name)
sprite = ('<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>'
          + ''.join(symbols[k] for k in sorted(symbols)) + '</defs></svg>\n')
html = html[:start] + '<!-- icons:start -->\n' + sprite + html[end:]
(ROOT / 'index.html').write_text(html)
print(f'{len(done)} of {len(MAP)} icons from Font Awesome files:', ', '.join(done) or '-')
