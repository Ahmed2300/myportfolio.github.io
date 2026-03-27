const fs = require('fs');

let html = fs.readFileSync('pdf.html', 'utf-8');

// The replacement function for wrapping English terms. We avoid messing inside HTML tags by matching carefully.
// Instead of complex parsing in Regex, let's just replace specific known structural things.
// Or we can just use a DOM parser. Let's use regex to find texts outside of <...> tags.
html = html.replace(/(>)([^<]*)(<)/g, (match, prefix, content, suffix) => {
    // Inside `content`, find English words or abbreviations and wrap them in <span dir="ltr" class="en-term">...</span>
    // Match English words possibly containing numbers, hyphens, slashes, or parentheses
    const enRegex = /([a-zA-Z0-9]+(?:[\s/\-_()]*[a-zA-Z0-9]+)*)/g;
    
    // BUT we shouldn't touch pure numbers or whitespace. Ensure at least one english letter.
    const newContent = content.replace(enRegex, (enMatch) => {
        if (/[a-zA-Z]/.test(enMatch)) {
            // Trim if needed, but the regex should already be bounded by alphanumeric text.
            return `<span dir="ltr" class="en-term">${enMatch}</span>`;
        }
        return enMatch;
    });
    
    return prefix + newContent + suffix;
});

// We need to add the CSS rules. Let's insert them before </style>
const cssRules = `
        /* PDF Fixes */
        .en-term {
            display: inline-block;
            direction: ltr;
            unicode-bidi: isolate;
            font-family: 'Product Sans', 'Arial', sans-serif;
            margin: 0 4px; /* Slight margin to prevent Arabic letters from sticking */
        }
        .avoid-page-break {
            page-break-inside: avoid;
        }
        h2 {
            page-break-after: avoid; /* Prevent headings from detaching from content */
        }
        table, tr, td, th, ul, ol, li, .meta-info, .signature {
            page-break-inside: avoid;
        }
        .pdf-export-mode * {
            max-width: none !important; /* Prevent html2pdf flex squishing */
        }
        #pdf-wrapper.pdf-export-mode {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
        }
        .pdf-export-mode .document-page {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important; /* Managed by html2pdf margin */
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            height: auto !important;
        }
`;

html = html.replace('</style>', cssRules + '\n    </style>');

// Modify export script to add pagebreak options
html = html.replace("jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }", 
"jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },\n                pagebreak:    { mode: ['css', 'legacy'], avoid: ['tr', 'table', 'h2', 'ul', 'ol', '.meta-info', '.signature'] }");

// Save back
fs.writeFileSync('pdf.html', html, 'utf-8');
console.log('Fixed PDF generation issues.');
