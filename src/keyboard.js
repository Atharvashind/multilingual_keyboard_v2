/**
 * MultiLanguageKeyboard - A versatile virtual keyboard supporting 6 languages
 * @version 1.0.0
 * @author Your Name
 * @license MIT
 */

class MultiLanguageKeyboard {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) {
            throw new Error('Container element not found');
        }

        // Default options
        this.options = {
            language: 'english',
            targetInput: null, // Input element to type into
            showControls: true,
            theme: 'default',
            onKeyPress: null,
            onLanguageChange: null,
            ...options
        };

        this.currentLanguage = this.options.language;
        this.isShift = false;
        this.isCapsLock = false;
        this.targetInput = this.options.targetInput;

        // Language layouts
        this.layouts = {};

        // Initialize
        this.init();
    }

    // Register a language layout
    static registerLayout(name, layout) {
        if (!MultiLanguageKeyboard.prototype.layouts) {
            MultiLanguageKeyboard.prototype.layouts = {};
        }
        MultiLanguageKeyboard.prototype.layouts[name] = layout;
    }

    init() {
        this.injectStyles();
        this.render();
        this.attachEvents();

        if (this.options.onLanguageChange) {
            this.options.onLanguageChange(this.currentLanguage);
        }
    }

    injectStyles() {
        if (document.getElementById('mlk-styles')) return;

        const styles = `
            .mlk-container {
                font-family: 'Noto Sans', sans-serif;
                background: linear-gradient(145deg, #2c3e50, #34495e);
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                max-width: 1000px;
                margin: 0 auto;
            }
            .mlk-lang-selector {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 20px;
            }
            .mlk-lang-btn {
                padding: 10px 20px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 25px;
                background: rgba(255,255,255,0.1);
                color: white;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s;
                font-family: inherit;
            }
            .mlk-lang-btn:hover, .mlk-lang-btn:focus {
                background: rgba(255,255,255,0.3);
                outline: 2px solid white;
            }
            .mlk-lang-btn.active {
                background: white;
                color: #2a5298;
            }
            .mlk-keyboard {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .mlk-row {
                display: flex;
                gap: 6px;
                justify-content: center;
            }
            .mlk-key {
                background: linear-gradient(145deg, #4a5568, #2d3748);
                border: none;
                border-radius: 8px;
                color: white;
                font-size: 16px;
                height: 45px;
                min-width: 45px;
                padding: 0 12px;
                cursor: pointer;
                box-shadow: 0 4px 0 #1a202c, 0 5px 10px rgba(0,0,0,0.3);
                transition: all 0.1s;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Bengali', 'Noto Sans Telugu', 'Noto Sans Tamil', sans-serif;
                user-select: none;
            }
            .mlk-key:hover {
                background: linear-gradient(145deg, #5a6578, #3d4758);
            }
            .mlk-key:active {
                transform: translateY(4px);
                box-shadow: 0 0 0 #1a202c, inset 0 2px 5px rgba(0,0,0,0.5);
            }
            .mlk-key.active {
                background: linear-gradient(145deg, #e74c3c, #c0392b);
            }
            .mlk-key.wide { min-width: 70px; flex: 1; max-width: 90px; }
            .mlk-key.extra-wide { min-width: 100px; flex: 2; max-width: 130px; }
            .mlk-key.space { min-width: 250px; flex: 5; }
            .mlk-key.shift, .mlk-key.caps { background: linear-gradient(145deg, #f39c12, #d68910); }
            .mlk-key.special { background: linear-gradient(145deg, #e74c3c, #c0392b); font-size: 12px; font-weight: 600; }
            .mlk-controls {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-top: 20px;
            }
            .mlk-control-btn {
                padding: 10px 20px;
                background: rgba(255,255,255,0.2);
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
            }
            .mlk-control-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            @media (max-width: 768px) {
                .mlk-key { height: 35px; min-width: 30px; font-size: 12px; padding: 0 8px; }
                .mlk-key.space { min-width: 150px; }
                .mlk-container { padding: 15px; }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'mlk-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    render() {
        this.container.innerHTML = '';
        this.container.className = 'mlk-container';

        // Language selector
        const langSelector = document.createElement('div');
        langSelector.className = 'mlk-lang-selector';

        Object.keys(this.layouts).forEach(lang => {
            const btn = document.createElement('button');
            btn.className = `mlk-lang-btn ${lang === this.currentLanguage ? 'active' : ''}`;
            btn.textContent = this.layouts[lang].name;
            btn.onclick = () => this.switchLanguage(lang);
            langSelector.appendChild(btn);
        });

        this.container.appendChild(langSelector);

        // Keyboard
        this.keyboardDiv = document.createElement('div');
        this.keyboardDiv.className = 'mlk-keyboard';
        this.container.appendChild(this.keyboardDiv);

        // Controls
        if (this.options.showControls) {
            const controls = document.createElement('div');
            controls.className = 'mlk-controls';
            controls.innerHTML = `
                <button class="mlk-control-btn" onclick="this.closest('.mlk-container').dispatchEvent(new CustomEvent('mlk:clear'))">Clear</button>
                <button class="mlk-control-btn" onclick="this.closest('.mlk-container').dispatchEvent(new CustomEvent('mlk:speak'))">Speak</button>
            `;
            this.container.appendChild(controls);
        }

        this.renderKeys();
    }

    renderKeys() {
        const layout = this.isShift ? 
            this.layouts[this.currentLanguage].shift : 
            this.layouts[this.currentLanguage].normal;

        this.keyboardDiv.innerHTML = '';

        layout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'mlk-row';

            row.forEach(key => {
                const keyBtn = document.createElement('button');
                keyBtn.className = 'mlk-key';
                keyBtn.textContent = key === 'Space' ? '' : key;

                // Special key classes
                if (['Backspace', 'Tab', 'Enter', 'Shift', 'Caps', 'Ctrl', 'Win', 'Alt', 'Menu'].includes(key)) {
                    keyBtn.classList.add('special');
                    if (key === 'Enter') keyBtn.classList.add('extra-wide');
                    else if (key === 'Shift' || key === 'Caps') {
                        keyBtn.classList.add('wide', key.toLowerCase());
                        if ((this.isShift && key === 'Shift') || (this.isCapsLock && key === 'Caps')) {
                            keyBtn.classList.add('active');
                        }
                    }
                    else if (key === 'Backspace') keyBtn.classList.add('wide');
                } else if (key === 'Space') {
                    keyBtn.classList.add('space');
                }

                keyBtn.onclick = () => this.handleKey(key);
                rowDiv.appendChild(keyBtn);
            });

            this.keyboardDiv.appendChild(rowDiv);
        });
    }

    handleKey(key) {
        if (this.options.onKeyPress) {
            this.options.onKeyPress(key);
        }

        const input = this.targetInput;

        switch(key) {
            case 'Backspace':
                if (input) {
                    const start = input.selectionStart;
                    const end = input.selectionEnd;
                    if (start === end && start > 0) {
                        input.value = input.value.slice(0, start - 1) + input.value.slice(end);
                        input.setSelectionRange(start - 1, start - 1);
                    } else if (start !== end) {
                        input.value = input.value.slice(0, start) + input.value.slice(end);
                        input.setSelectionRange(start, start);
                    }
                }
                this.emit('backspace');
                break;

            case 'Space':
                this.insertText(' ');
                break;

            case 'Enter':
                this.insertText('\n');
                break;

            case 'Tab':
                this.insertText('\t');
                break;

            case 'Shift':
                this.isShift = !this.isShift;
                this.renderKeys();
                return;

            case 'Caps':
                this.isCapsLock = !this.isCapsLock;
                this.isShift = this.isCapsLock;
                this.renderKeys();
                return;

            case 'Ctrl':
            case 'Win':
            case 'Alt':
            case 'Menu':
                break;

            default:
                this.insertText(key);
                if (this.isShift && !this.isCapsLock) {
                    this.isShift = false;
                    this.renderKeys();
                }
        }

        if (input) {
            input.focus();
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    insertText(text) {
        const input = this.targetInput;
        if (input) {
            const start = input.selectionStart;
            const end = input.selectionEnd;
            input.value = input.value.slice(0, start) + text + input.value.slice(end);
            input.setSelectionRange(start + text.length, start + text.length);
        }
        this.emit('input', text);
    }

    switchLanguage(lang) {
        if (!this.layouts[lang]) {
            console.error(`Layout '${lang}' not registered`);
            return;
        }
        this.currentLanguage = lang;
        this.render();

        if (this.options.onLanguageChange) {
            this.options.onLanguageChange(lang);
        }
        this.emit('languageChange', lang);
    }

    setTarget(input) {
        this.targetInput = typeof input === 'string' ? document.querySelector(input) : input;
    }

    clear() {
        if (this.targetInput) {
            this.targetInput.value = '';
        }
        this.emit('clear');
    }

    speak() {
        if (!this.targetInput || !this.targetInput.value) return;

        const utterance = new SpeechSynthesisUtterance(this.targetInput.value);
        const langMap = {
            'english': 'en-US',
            'hindi': 'hi-IN',
            'marathi': 'mr-IN',
            'telugu': 'te-IN',
            'tamil': 'ta-IN',
            'bengali': 'bn-IN'
        };
        utterance.lang = langMap[this.currentLanguage] || 'en-US';
        speechSynthesis.speak(utterance);
    }

    attachEvents() {
        this.container.addEventListener('mlk:clear', () => this.clear());
        this.container.addEventListener('mlk:speak', () => this.speak());
    }

    emit(eventName, detail) {
        this.container.dispatchEvent(new CustomEvent(`mlk:${eventName}`, { detail }));
    }

    destroy() {
        this.container.innerHTML = '';
        this.container.className = '';
    }
}

// Auto-initialize if data attribute present
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-mlk-keyboard]').forEach(el => {
        const options = el.dataset.mlkOptions ? JSON.parse(el.dataset.mlkOptions) : {};
        if (el.dataset.mlkTarget) {
            options.targetInput = document.querySelector(el.dataset.mlkTarget);
        }
        new MultiLanguageKeyboard(el, options);
    });
});

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiLanguageKeyboard;
}
if (typeof window !== 'undefined') {
    window.MultiLanguageKeyboard = MultiLanguageKeyboard;
}
