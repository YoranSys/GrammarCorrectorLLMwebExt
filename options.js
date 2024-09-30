document.addEventListener('DOMContentLoaded', () => {
    const apiChoiceRadios = document.querySelectorAll('input[name="apiChoice"]');
    const mistralaiSettings = document.getElementById('mistralaiSettings');
    const ollamaSettings = document.getElementById('ollamaSettings');
    const mistralApiKeyInput = document.getElementById('mistralApiKey');
    const ollamaEndpointInput = document.getElementById('ollamaEndpoint');

    function toggleSettings() {
        const selectedApi = document.querySelector('input[name="apiChoice"]:checked').value;
        mistralaiSettings.style.display = selectedApi === 'mistralai' ? 'block' : 'none';
        ollamaSettings.style.display = selectedApi === 'ollama' ? 'block' : 'none';
    }

    function saveSettings() {
        const apiChoice = document.querySelector('input[name="apiChoice"]:checked').value;
        const mistralApiKey = mistralApiKeyInput.value;
        const ollamaEndpoint = ollamaEndpointInput.value;

        browser.storage.local.set({ 
            apiChoice, 
            mistralApiKey, 
            ollamaEndpoint 
        });
    }

    apiChoiceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            toggleSettings();
            saveSettings();
        });
    });

    mistralApiKeyInput.addEventListener('input', saveSettings);
    ollamaEndpointInput.addEventListener('input', saveSettings);

    // Load the saved settings when the page is loaded
    browser.storage.local.get(['apiChoice', 'mistralApiKey', 'ollamaEndpoint']).then((result) => {
        if (result.apiChoice) {
            document.querySelector(`input[name="apiChoice"][value="${result.apiChoice}"]`).checked = true;
        }
        if (result.mistralApiKey) {
            mistralApiKeyInput.value = result.mistralApiKey;
        }
        if (result.ollamaEndpoint) {
            ollamaEndpointInput.value = result.ollamaEndpoint;
        }
        toggleSettings();
    });
});