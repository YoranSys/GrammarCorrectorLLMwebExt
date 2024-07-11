class GrammarButton {
    constructor() {
        this.button = document.createElement('div');
        this.button.className = 'grammar-correction-main-button';
        this.button.textContent = '✓';
        this.button.onclick = this.handleClick.bind(this);

        this.textNode = null;
        this.shadowHost = null;
        this.shadowRoot = null;
    }

    handleClick() {
        if (this.textNode) {
            let text;
            if (this.textNode.isContentEditable) {
                text = this.textNode.innerText;
            } else {
                text = this.textNode.value;
            }
            
            // Use the sendTextForCorrection function
            sendTextForCorrection(text, this.textNode);
            
            // Hide the button after clicking
            this.hide();
        }
    }

    examineNode(node) {
        if (!node || !(node instanceof HTMLElement)) {
            this.hide();
            return;
        }

        if (node === this.button || node === this.shadowHost) {
            // Don't hide the button when hovering over it
            return;
        }

        if (node === this.textNode) {
            this.move();
            return;
        }

        if ((node.tagName === 'TEXTAREA' || (node.tagName === 'INPUT' && node.type === 'text')) &&
            !node.dataset.grammarButton) {
            this.show(node);
        } else if (node.isContentEditable) {
            const editableNode = this.findOriginEditableNode(node);
            if ((editableNode.tagName === 'P' || editableNode.tagName === 'DIV') && !editableNode.dataset.grammarButton) {
                this.show(editableNode);
            } else {
                this.hide();
            }
        } else {
            this.hide();
        }
    }

    show(node) {
        this.textNode = node;
        this.button.style.display = 'block';
        this.move();
    }

    hide() {
        this.textNode = null;
        this.button.style.display = 'none';
    }

    move() {
        if (this.textNode) {
            const rect = this.textNode.getBoundingClientRect();
            this.button.style.top = `${window.scrollY + rect.bottom}px`;
            this.button.style.left = `${window.scrollX + rect.left}px`;
        }
    }

    findOriginEditableNode(node) {
        while (node && node.parentNode) {
            if (node.parentNode.isContentEditable) {
                node = node.parentNode;
            } else {
                break;
            }
        }
        return node;
    }

    insertIntoPage() {
        const style = document.createElement('style');
        style.textContent = `
            .grammar-correction-main-button {
                all: initial;
                position: fixed;
                box-sizing: border-box;
                display: none;
                margin: -10px 0 0 -18px;
                width: 24px;
                height: 24px;
                background-color: hsla(210, 80%, 95%, .9);
                border: 3px solid hsla(210, 80%, 50%, .9);
                border-top: 3px solid hsla(210, 80%, 90%, .9);
                border-left: 3px solid hsla(210, 80%, 90%, .9);
                border-radius: 50%;
                font-family: "Trebuchet MS", "Fira Sans", "Ubuntu Condensed", "Liberation Sans", sans-serif;
                font-size: 14px;
                line-height: 18px;
                text-align: center;
                cursor: pointer;
                box-shadow: 0 0 0 0 hsla(210, 80%, 50%, .7);
                z-index: 2147483640;
                animation: grammar-spin 2s ease 1;
            }
            .grammar-correction-main-button:hover {
                background-color: hsla(210, 80%, 50%, .05);
                animation: grammar-spin .5s linear infinite;
            }
            @keyframes grammar-spin {
                0% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(.9); box-shadow: 0 0 0 10px hsla(210, 50%, 50%, 0); }
                100% { transform: rotate(360deg) scale(1); box-shadow: 0 0 0 0 hsla(210, 50%, 50%, 0); }
            }
        `;

        if (document.body.attachShadow) {
            this.shadowHost = document.createElement('div');
            this.shadowHost.style.width = '0';
            this.shadowHost.style.height = '0';
            this.shadowRoot = this.shadowHost.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(style);
            this.shadowRoot.appendChild(this.button);
            document.body.appendChild(this.shadowHost);
        } else {
            document.head.appendChild(style);
            document.body.appendChild(this.button);
        }
    }
}

// Make GrammarButton available globally
window.GrammarButton = GrammarButton;