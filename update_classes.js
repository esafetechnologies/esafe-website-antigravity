const fs = require('fs');
const path = require('path');

const cssRenames = [
    ['card-blabs', 'card-strategy'],
    ['card-evolve', 'card-technology'],
    ['card-xplore', 'card-marketing'],
    ['card-elevate', 'card-hr'],
    ['card-ensure', 'card-finance']
];

const dir = __dirname;
const filesToUpdate = ['index.html', 'styles.css'];

filesToUpdate.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        cssRenames.forEach(([oldStr, newStr]) => {
            content = content.split(oldStr).join(newStr);
        });

        fs.writeFileSync(filePath, content, 'utf8');
    }
});

console.log('CSS class replace complete.');
