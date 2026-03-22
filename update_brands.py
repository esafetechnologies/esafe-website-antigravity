import glob
import re

exact_replacements = [
    # URLs
    ('blabs.html', 'strategy.html'),
    ('evolve.html', 'technology.html'),
    ('xplore.html', 'marketing.html'),
    ('elevate.html', 'hr.html'),
    ('ensure.html', 'finance.html'),
    
    # Nav dropdown
    ('BLABS - Strategy', 'Strategy &amp; Research'),
    ('EVOLVE - Tech', 'Technology Solutions'),
    ('XPLORE - Marketing', 'Marketing &amp; Brand'),
    ('ELEVATE - HR', 'HR Management'),
    ('ENSURE - Finance', 'Finance Solutions'),
    
    # Contact Form options
    ('<option value="BLABS">BLABS - Strategy &amp; Research</option>', '<option value="Strategy">Strategy &amp; Research</option>'),
    ('<option value="EVOLVE">EVOLVE - Tech Solutions</option>', '<option value="Technology">Technology Solutions</option>'),
    ('<option value="XPLORE">XPLORE - Marketing</option>', '<option value="Marketing">Marketing &amp; Brand</option>'),
    ('<option value="ELEVATE">ELEVATE - HR Management</option>', '<option value="HR Management">HR Management</option>'),
    ('<option value="ENSURE">ENSURE - Finance Solutions</option>', '<option value="Finance">Finance Solutions</option>'),
    
    # Footer and Section headers
    ('>DIVISIONS<', '>SERVICES<'),
    ('>Divisions<', '>Services<'),
    ('Five Divisions', 'Five Core Services'),
    ('five specialized divisions', 'five specialized services'),
    ('contact-divisions', 'contact-divisions'), # keep class
    
    # JSON-LD Schema
    ('"name": "BLABS - Business Research & Development"', '"name": "Strategy & Research"'),
    ('"name": "EVOLVE - Technology Solutions"', '"name": "Technology Solutions"'),
    ('"name": "XPLORE - Marketing & Creative Solutions"', '"name": "Marketing & Brand"'),
    ('"name": "ELEVATE - Human Resource Management Solutions"', '"name": "HR Management"'),
    ('"name": "ENSURE - Finance Solutions"', '"name": "Finance Solutions"'),
]

# General brand name sweep
brand_to_service = {
    'BLABS': 'Strategy & Research',
    'EVOLVE': 'Technology Solutions',
    'XPLORE': 'Marketing & Brand',
    'ELEVATE': 'HR Management',
    'ENSURE': 'Finance Solutions',
    'blabs': 'strategy',
    'evolve': 'technology',
    'xplore': 'marketing',
    'elevate': 'hr',
    'ensure': 'finance'
}

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove service-division h4 entirely
    content = re.sub(r'<h4 class="service-division">.*?</h4>\s*', '', content)
    
    # Remove " - Business Research & Development" etc from titles to clean them up after renaming
    content = content.replace('Strategy & Research - Business Research & Development |', 'Strategy & Research |')
    content = content.replace('Technology Solutions - Technology Solutions |', 'Technology Solutions |')
    
    for old, new in exact_replacements:
        content = content.replace(old, new)
        
    for brand, service in brand_to_service.items():
        # Avoid replacing inside CSS class names like "card-blabs"
        # Only replace exact words
        content = re.sub(r'\b' + brand + r'\b', service, content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Replacement complete.")
