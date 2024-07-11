document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const correctButton = document.getElementById('correctButton');
    const result = document.getElementById('result');

    correctButton.addEventListener('click', function() {
        const text = inputText.value;
        if (text) {
            browser.runtime.sendMessage({ action: "correctText", text })
                .then(response => {
                    if (response.correctedText) {
                        result.textContent = "Corrected text: " + response.correctedText;
                        inputText.value = response.correctedText;
                    } else if (response.error) {
                        result.textContent = "Error: " + response.error;
                    }
                });
        } else {
            result.textContent = "Please enter some text to correct.";
        }
    });
});