const fs = require('fs');
const path = require('path');

const exactReplacements = [
    ['blabs.html', 'strategy.html'],
    ['evolve.html', 'technology.html'],
    ['xplore.html', 'marketing.html'],
    ['elevate.html', 'hr.html'],
    ['ensure.html', 'finance.html'],
    ['BLABS - Strategy', 'Strategy &amp; Research'],
    ['EVOLVE - Tech', 'Technology Solutions'],
    ['XPLORE - Marketing', 'Marketing &amp; Brand'],
    ['ELEVATE - HR', 'HR Management'],
    ['ENSURE - Finance', 'Finance Solutions'],
    ['<option value="BLABS">BLABS - Strategy &amp; Research</option>', '<option value="Strategy">Strategy &amp; Research</option>'],
    ['<option value="EVOLVE">EVOLVE - Tech Solutions</option>', '<option value="Technology">Technology Solutions</option>'],
    ['<option value="XPLORE">XPLORE - Marketing</option>', '<option value="Marketing">Marketing &amp; Brand</option>'],
    ['<option value="ELEVATE">ELEVATE - HR Management</option>', '<option value="HR Management">HR Management</option>'],
    ['<option value="ENSURE">ENSURE - Finance Solutions</option>', '<option value="Finance">Finance Solutions</option>'],
    ['>DIVISIONS<', '>SERVICES<'],
    ['>Divisions<', '>Services<'],
    ['Five Divisions', 'Five Core Services'],
    ['five specialized divisions', 'five specialized services'],
    ['"name": "BLABS - Business Research & Development"', '"name": "Strategy & Research"'],
    ['"name": "EVOLVE - Technology Solutions"', '"name": "Technology Solutions"'],
    ['"name": "XPLORE - Marketing & Creative Solutions"', '"name": "Marketing & Brand"'],
    ['"name": "ELEVATE - Human Resource Management Solutions"', '"name": "HR Management"'],
    ['"name": "ENSURE - Finance Solutions"', '"name": "Finance Solutions"']
];

const brandToService = {
    'BLABS': 'Strategy & Research',
    'EVOLVE': 'Technology Solutions',
    'XPLORE': 'Marketing & Brand',
    'ELEVATE': 'HR Management',
    'ENSURE': 'Finance Solutions'
};

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove service-division h4
    content = content.replace(/<h4 class="service-division">.*?<\/h4>\s*/g, '');
    
    // Clean up title text if needed
    content = content.replace('Strategy & Research - Business Research & Development |', 'Strategy & Research |');
    content = content.replace('Technology Solutions - Technology Solutions |', 'Technology Solutions |');

    exactReplacements.forEach(([oldStr, newStr]) => {
        content = content.split(oldStr).join(newStr);
    });

    Object.entries(brandToService).forEach(([brand, service]) => {
        const regex = new RegExp(`\\b${brand}\\b`, 'g');
        content = content.replace(regex, service);
    });

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Update complete.');
