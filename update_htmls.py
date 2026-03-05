import os

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old_nav = '''        <li><a href="index.html#services" class="nav-link">Services</a></li>'''
    new_nav = '''        <li class="dropdown">
          <a href="index.html#services" class="nav-link dropdown-toggle">Services</a>
          <ul class="dropdown-menu">
            <li><a href="blabs.html" class="dropdown-item">BLABS - Strategy</a></li>
            <li><a href="evolve.html" class="dropdown-item">EVOLVE - Tech</a></li>
            <li><a href="xplore.html" class="dropdown-item">XPLORE - Marketing</a></li>
            <li><a href="elevate.html" class="dropdown-item">ELEVATE - HR</a></li>
            <li><a href="ensure.html" class="dropdown-item">ENSURE - Finance</a></li>
          </ul>
        </li>'''
    
    old_nav2 = '''        <li><a href="#services" class="nav-link">Services</a></li>'''
    new_nav2 = '''        <li class="dropdown">
          <a href="#services" class="nav-link dropdown-toggle">Services</a>
          <ul class="dropdown-menu">
            <li><a href="blabs.html" class="dropdown-item">BLABS - Strategy</a></li>
            <li><a href="evolve.html" class="dropdown-item">EVOLVE - Tech</a></li>
            <li><a href="xplore.html" class="dropdown-item">XPLORE - Marketing</a></li>
            <li><a href="elevate.html" class="dropdown-item">ELEVATE - HR</a></li>
            <li><a href="ensure.html" class="dropdown-item">ENSURE - Finance</a></li>
          </ul>
        </li>'''

    # Update CSS variables in subpages
    content = content.replace('var(--color-navy)', 'var(--navy)')
    content = content.replace('var(--color-white)', 'var(--white)')
    content = content.replace('var(--color-teal)', 'var(--teal)')
    content = content.replace('var(--color-light-teal)', 'var(--teal-pale)')

    content = content.replace(old_nav, new_nav)
    content = content.replace(old_nav2, new_nav2)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = r"h:\My Drive\ESafe Files\Internal Company\Web Development\git-esafe website anti gravity\esafe-website-antigravity"
files = ["index.html", "blabs.html", "elevate.html", "ensure.html", "evolve.html", "xplore.html"]

for file in files:
    update_file(os.path.join(base_dir, file))
