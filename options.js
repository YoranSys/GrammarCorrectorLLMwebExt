document.getElementById('saveButton').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    browser.storage.local.set({ apiKey });
});

// Load the API key when the page is loaded
browser.storage.local.get('apiKey').then(({ apiKey }) => {
    document.getElementById('apiKey').value = apiKey;
});