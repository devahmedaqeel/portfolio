const fs = require('fs');
let html = fs.readFileSync('portfolio-pro/index.html', 'utf8');

// Remove classes that alter colors from devicons to keep them "original and clear"
let lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('devicons/devicon') || lines[i].includes('simple-icons')) {
        // Remove tech-icon-light which inverts colors
        lines[i] = lines[i].replace(/ tech-icon-light/g, '')
                           .replace(/tech-icon-light /g, '')
                           .replace(/tech-icon-light/g, '');
        // Remove active class from skill icons which might apply other filters incorrectly
        lines[i] = lines[i].replace(/ class="active"/g, '')
                           .replace(/ class="active "/g, ' class="')
                           .replace(/ active"/g, '"');
    }
}
html = lines.join('\n');
fs.writeFileSync('portfolio-pro/index.html', html);
console.log("Original icons restored.");