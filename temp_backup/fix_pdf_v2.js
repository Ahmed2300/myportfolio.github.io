const fs = require('fs');
const { JSDOM } = require('jsdom');

let html = fs.readFileSync('pdf.html', 'utf-8');

// 1. Remove the broken wrapper spans everywhere
html = html.replace(/<span dir="ltr" class="en-term">([\s\S]*?)<\/span>/g, '$1');

// 2. Parse into JSDOM
const dom = new JSDOM(html);
const document = dom.window.document;

function wrapEnglishText(node) {
    if (node.nodeType === dom.window.Node.TEXT_NODE) {
        const parentName = node.parentNode ? node.parentNode.nodeName.toLowerCase() : '';
        if (parentName !== 'script' && parentName !== 'style') {
            const regex = /([a-zA-Z0-9]+(?:[\s/\-_()]*[a-zA-Z0-9]+)*)/g;
            if (regex.test(node.textContent) && /[a-zA-Z]/.test(node.textContent)) {
                const fragment = dom.window.document.createDocumentFragment();
                let lastIndex = 0;
                let text = node.textContent;
                regex.lastIndex = 0;
                let match;
                while ((match = regex.exec(text)) !== null) {
                    if (/[a-zA-Z]/.test(match[0])) {
                        if (match.index > lastIndex) {
                            fragment.appendChild(dom.window.document.createTextNode(text.substring(lastIndex, match.index)));
                        }
                        const span = dom.window.document.createElement('span');
                        span.setAttribute('dir', 'ltr');
                        span.className = 'en-term';
                        span.textContent = match[0];
                        fragment.appendChild(span);
                        lastIndex = regex.lastIndex;
                    }
                }
                if (lastIndex < text.length) {
                    fragment.appendChild(dom.window.document.createTextNode(text.substring(lastIndex)));
                }

                if (fragment.childNodes.length > 0) {
                    node.parentNode.replaceChild(fragment, node);
                }
            }
        }
    } else if (node.nodeType === dom.window.Node.ELEMENT_NODE) {
        if (node.nodeName.toLowerCase() !== 'script' && node.nodeName.toLowerCase() !== 'style' && !node.classList.contains('en-term')) {
            const children = Array.from(node.childNodes);
            children.forEach(wrapEnglishText);
        }
    }
}

// Ensure the added CSS and logic are intact
wrapEnglishText(document.body);

fs.writeFileSync('pdf.html', dom.serialize(), 'utf-8');
console.log('Cleaned up HTML and re-applied wraps safely via DOM parsing.');
