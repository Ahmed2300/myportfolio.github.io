const fs = require('fs');

let html = fs.readFileSync('pdf.html', 'utf-8');

// 1. Fix double-encoded ampersands from JSDOM serialization
html = html.replace(/&amp;amp;/g, '&');

// 2. Remove en-term spans INSIDE material-icons and material-icons-outlined elements
// Pattern: <span class="material-icons...">  <span dir="ltr" class="en-term">ICON_NAME</span>  </span>
// Should become: <span class="material-icons...">ICON_NAME</span>
html = html.replace(
    /(<span[^>]*class="material-icons[^"]*"[^>]*>)\s*<span[^>]*class="en-term"[^>]*>([^<]+)<\/span>\s*(<\/span>)/g,
    '$1$2$3'
);

// 3. Fix DOCTYPE and html tag if they got merged
html = html.replace(
    /<!DOCTYPE html><html/,
    '<!DOCTYPE html>\n<html'
);

// 4. Fix crossorigin="" (JSDOM adds empty string)
html = html.replace(/crossorigin=""/g, 'crossorigin');

fs.writeFileSync('pdf.html', html, 'utf-8');
console.log('Fixed: icon spans, double-encoded ampersands, DOCTYPE.');
