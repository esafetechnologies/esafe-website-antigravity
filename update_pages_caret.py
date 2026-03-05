import os

files = ["index.html", "blabs.html", "elevate.html", "ensure.html", "evolve.html", "xplore.html"]
base_dir = r"h:\My Drive\ESafe Files\Internal Company\Web Development\git-esafe website anti gravity\esafe-website-antigravity"

old_html = '<a href="index.html#services" class="nav-link dropdown-toggle">Services</a>'
new_html = '<a href="index.html#services" class="nav-link dropdown-toggle">Services <svg class="dropdown-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></a>'
old_html2 = '<a href="#services" class="nav-link dropdown-toggle">Services</a>'
new_html2 = '<a href="#services" class="nav-link dropdown-toggle">Services <svg class="dropdown-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></a>'

for f in files:
    path = os.path.join(base_dir, f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace(old_html, new_html).replace(old_html2, new_html2)
    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)
