const fs = require('fs');
const path = require('path');

const cleanupFixes = {
    "Technology Solutionsnology Solutions": "Technology Solutions",
    "Marketing &amp; Brand & Creative Solutions": "Marketing &amp; Brand",
    "Finance Solutions Solutions": "Finance Solutions",
    "Technology Solutions Solutions": "Technology Solutions",
    "Strategy & Research & Research": "Strategy & Research",
    "HR Management Management": "HR Management",
    "Marketing & Brand & Creative Solutions": "Marketing & Brand"
};

const replacements = {
    "Strategy & Research": "Business Labs - Strategy & Research",
    "Strategy &amp; Research": "Business Labs - Strategy &amp; Research",
    "Technology Solutions": "Evolve - Technology Solutions",
    "Marketing & Brand": "Xplore - Marketing & Brand",
    "Marketing &amp; Brand": "Xplore - Marketing &amp; Brand",
    "HR Management": "Elevate - HR Management",
    "Finance Solutions": "Ensure - Finance Solutions"
};

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
console.log(`Found ${files.length} HTML files to process.`);

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // First apply cleanup fixes to ensure cleanly formatted text
    for (const [bad, good] of Object.entries(cleanupFixes)) {
        if (content.includes(bad)) {
            console.log(`Cleaning up '${bad}' in ${file}`);
            content = content.split(bad).join(good);
        }
    }

    // Revert if already applied to prevent double application
    for (const [oldStr, newStr] of Object.entries(replacements)) {
        content = content.split(newStr).join(oldStr);
    }

    // Apply new brands
    for (const [oldStr, newStr] of Object.entries(replacements)) {
        if (content.includes(oldStr)) {
            content = content.split(oldStr).join(newStr);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log(`Applied brand prefixes to ${files.length} files.`);
