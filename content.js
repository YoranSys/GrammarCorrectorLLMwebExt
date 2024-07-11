// content.js

// Function to send text for correction
window.sendTextForCorrection = function(text, inputElement) {
    browser.runtime.sendMessage({ action: "correctText", text })
        .then(response => {
            if (response.correctedText) {
                updateInputValue(inputElement, response.correctedText);
            } else if (response.error) {
                console.error('Error correcting text:', response.error);
            }
        });
}

// Function to update input value and trigger necessary events
function updateInputValue(inputElement, newValue) {
    if (inputElement.isContentEditable) {
        inputElement.innerText = newValue;
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
        inputElement.value = newValue;
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

const grammarButton = new GrammarButton();
grammarButton.insertIntoPage();

// Use IntersectionObserver to check for visible inputs
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.addEventListener('focus', handleFocus);
            entry.target.addEventListener('blur', handleBlur);
        } else {
            entry.target.removeEventListener('focus', handleFocus);
            entry.target.removeEventListener('blur', handleBlur);
        }
    });
}, { threshold: 0.1 });

// Observe existing inputs
document.querySelectorAll('input[type="text"], textarea').forEach(input => observer.observe(input));

// MutationObserver to watch for new inputs
const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                node.querySelectorAll('input[type="text"], textarea').forEach(input => observer.observe(input));
            }
        });
    });
});

mutationObserver.observe(document.body, { childList: true, subtree: true });

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getSelectedText") {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            sendTextForCorrection(selectedText);
        }
    }
});

// Handle focus event
function handleFocus(e) {
    grammarButton.examineNode(e.target);
}

// Handle blur event
function handleBlur(e) {
    // Delay hiding the button to allow for clicking it
    setTimeout(() => grammarButton.hide(), 200);
}

// Listen for mouse movements to update button position
document.addEventListener('mousemove', (e) => {
    const node = e.target;
    if (node.tagName === 'TEXTAREA' || (node.tagName === 'INPUT' && node.type === 'text') || node.isContentEditable) {
        grammarButton.examineNode(node);
    }
});