/**
 * multilanguage-keyboard v1.0.1
 * A zero-dependency virtual keyboard supporting English, Hindi, Marathi, Telugu, Tamil, Bengali and Gujarati
 * License: MIT
 * Built: 2026-04-04T15:35:27.978Z
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory()
        : typeof define === 'function' && define.amd
            ? define(factory)
            : (global.MultiLanguageKeyboard = factory());
}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
    'use strict';
    /**
     * MultiLanguageKeyboard - A versatile virtual keyboard supporting 6 languages
     * @version 1.0.1
     * @license MIT
     */
    
    // Shared layout registry (static, not on prototype)
    const _layouts = {};
    
    class MultiLanguageKeyboard {
        constructor(container, options = {}) {
            this.container = typeof container === 'string'
                ? document.querySelector(container)
                : container;
    
            if (!this.container) {
                throw new Error('MultiLanguageKeyboard: container element not found');
            }
    
            this.options = {
                language: 'english',
                targetInput: null,
                showControls: true,
                theme: 'default',
                onKeyPress: null,
                onLanguageChange: null,
                ...options
            };
    
            this.currentLanguage = this.options.language;
            this.isShift = false;
            this.isCapsLock = false;
    
            // Resolve targetInput — accept selector string or element
            this.targetInput = this._resolveInput(this.options.targetInput);
    
            // Bound event handlers (kept for cleanup)
            this._onClear = () => this.clear();
            this._onSpeak = () => this.speak();
    
            this._init();
        }
    
        // ─── Static API ──────────────────────────────────────────────────────────
    
        static registerLayout(name, layout) {
            _layouts[name] = layout;
        }
    
        static get LAYOUTS() {
            return _layouts;
        }
    
        // ─── Private helpers ─────────────────────────────────────────────────────
    
        _resolveInput(input) {
            if (!input) return null;
            if (typeof input === 'string') return document.querySelector(input);
            return input;
        }
    
        _init() {
            this._injectStyles();
            this._render();
            this._attachEvents();
    
            if (this.options.onLanguageChange) {
                this.options.onLanguageChange(this.currentLanguage);
            }
        }
    
        _injectStyles() {
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
                    font-family: 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Bengali',
                                 'Noto Sans Telugu', 'Noto Sans Tamil', 'Noto Sans Gujarati', sans-serif;
                    user-select: none;
                }
                .mlk-key:hover { background: linear-gradient(145deg, #5a6578, #3d4758); }
                .mlk-key:active {
                    transform: translateY(4px);
                    box-shadow: 0 0 0 #1a202c, inset 0 2px 5px rgba(0,0,0,0.5);
                }
                .mlk-key.active { background: linear-gradient(145deg, #e74c3c, #c0392b); }
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
                .mlk-control-btn:hover { background: rgba(255,255,255,0.3); }
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
    
        _render() {
            this.container.innerHTML = '';
            this.container.className = 'mlk-container';
            this.container.setAttribute('role', 'group');
            this.container.setAttribute('aria-label', 'Virtual keyboard');
    
            // Language selector
            const langSelector = document.createElement('div');
            langSelector.className = 'mlk-lang-selector';
            langSelector.setAttribute('role', 'toolbar');
            langSelector.setAttribute('aria-label', 'Language selection');
    
            Object.keys(_layouts).forEach(lang => {
                const btn = document.createElement('button');
                btn.className = `mlk-lang-btn ${lang === this.currentLanguage ? 'active' : ''}`;
                btn.textContent = _layouts[lang].name;
                btn.setAttribute('aria-pressed', lang === this.currentLanguage ? 'true' : 'false');
                btn.setAttribute('aria-label', `Switch to ${_layouts[lang].name}`);
                btn.type = 'button';
                btn.onclick = () => this.switchLanguage(lang);
                langSelector.appendChild(btn);
            });
    
            this.container.appendChild(langSelector);
    
            // Keyboard area
            this.keyboardDiv = document.createElement('div');
            this.keyboardDiv.className = 'mlk-keyboard';
            this.keyboardDiv.setAttribute('role', 'group');
            this.keyboardDiv.setAttribute('aria-label', 'Keyboard keys');
            this.container.appendChild(this.keyboardDiv);
    
            // Controls
            if (this.options.showControls) {
                const controls = document.createElement('div');
                controls.className = 'mlk-controls';
    
                const clearBtn = document.createElement('button');
                clearBtn.className = 'mlk-control-btn';
                clearBtn.type = 'button';
                clearBtn.textContent = 'Clear';
                clearBtn.setAttribute('aria-label', 'Clear input');
                clearBtn.addEventListener('click', this._onClear);
    
                const speakBtn = document.createElement('button');
                speakBtn.className = 'mlk-control-btn';
                speakBtn.type = 'button';
                speakBtn.textContent = 'Speak';
                speakBtn.setAttribute('aria-label', 'Speak input text');
                speakBtn.addEventListener('click', this._onSpeak);
    
                controls.appendChild(clearBtn);
                controls.appendChild(speakBtn);
                this.container.appendChild(controls);
            }
    
            this._renderKeys();
        }
    
        _renderKeys() {
            const layout = this.isShift
                ? _layouts[this.currentLanguage].shift
                : _layouts[this.currentLanguage].normal;
    
            this.keyboardDiv.innerHTML = '';
    
            layout.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'mlk-row';
                rowDiv.setAttribute('role', 'row');
    
                row.forEach(key => {
                    const keyBtn = document.createElement('button');
                    keyBtn.className = 'mlk-key';
                    keyBtn.type = 'button';
                    keyBtn.setAttribute('aria-label', key === 'Space' ? 'Space' : key);
    
                    const SPECIAL_KEYS = ['Backspace', 'Tab', 'Enter', 'Shift', 'Caps',
                                          'Ctrl', 'Win', 'Alt', 'Menu'];
    
                    if (SPECIAL_KEYS.includes(key)) {
                        keyBtn.classList.add('special');
                        keyBtn.textContent = key;
                        if (key === 'Enter') {
                            keyBtn.classList.add('extra-wide');
                        } else if (key === 'Shift' || key === 'Caps') {
                            keyBtn.classList.add('wide', key.toLowerCase());
                            const isActive = (key === 'Shift' && this.isShift) ||
                                             (key === 'Caps' && this.isCapsLock);
                            if (isActive) keyBtn.classList.add('active');
                            keyBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                        } else if (key === 'Backspace') {
                            keyBtn.classList.add('wide');
                        }
                    } else if (key === 'Space') {
                        keyBtn.classList.add('space');
                        keyBtn.textContent = '';
                    } else {
                        keyBtn.textContent = key;
                    }
    
                    keyBtn.addEventListener('click', () => this.handleKey(key));
                    rowDiv.appendChild(keyBtn);
                });
    
                this.keyboardDiv.appendChild(rowDiv);
            });
        }
    
        // ─── Public API ──────────────────────────────────────────────────────────
    
        handleKey(key) {
            if (this.options.onKeyPress) {
                this.options.onKeyPress(key);
            }
    
            const input = this.targetInput;
    
            switch (key) {
                case 'Backspace':
                    if (input) {
                        const start = input.selectionStart;
                        const end = input.selectionEnd;
                        if (start !== end) {
                            input.value = input.value.slice(0, start) + input.value.slice(end);
                            input.setSelectionRange(start, start);
                        } else if (start > 0) {
                            input.value = input.value.slice(0, start - 1) + input.value.slice(start);
                            input.setSelectionRange(start - 1, start - 1);
                        }
                        this._triggerInputEvent(input);
                    }
                    this._emit('backspace');
                    break;
    
                case 'Space':  this._insertText(' '); break;
                case 'Enter':  this._insertText('\n'); break;
                case 'Tab':    this._insertText('\t'); break;
    
                case 'Shift':
                    this.isShift = !this.isShift;
                    this._renderKeys();
                    return;
    
                case 'Caps':
                    this.isCapsLock = !this.isCapsLock;
                    this.isShift = this.isCapsLock;
                    this._renderKeys();
                    return;
    
                case 'Ctrl':
                case 'Win':
                case 'Alt':
                case 'Menu':
                    break;
    
                default:
                    this._insertText(key);
                    if (this.isShift && !this.isCapsLock) {
                        this.isShift = false;
                        this._renderKeys();
                    }
            }
    
            if (input) input.focus();
        }
    
        _insertText(text) {
            const input = this.targetInput;
            if (input) {
                const start = input.selectionStart;
                const end = input.selectionEnd;
                input.value = input.value.slice(0, start) + text + input.value.slice(end);
                input.setSelectionRange(start + text.length, start + text.length);
                this._triggerInputEvent(input);
            }
            this._emit('input', text);
        }
    
        _triggerInputEvent(input) {
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    
        switchLanguage(lang) {
            if (!_layouts[lang]) {
                console.warn(`MultiLanguageKeyboard: layout '${lang}' is not registered`);
                return;
            }
            this.currentLanguage = lang;
            this._render();
    
            if (this.options.onLanguageChange) {
                this.options.onLanguageChange(lang);
            }
            this._emit('languageChange', lang);
        }
    
        setTarget(input) {
            this.targetInput = this._resolveInput(input);
        }
    
        clear() {
            if (this.targetInput) {
                this.targetInput.value = '';
                this._triggerInputEvent(this.targetInput);
            }
            this._emit('clear');
        }
    
        speak() {
            if (!this.targetInput || !this.targetInput.value) return;
            if (!window.speechSynthesis) {
                console.warn('MultiLanguageKeyboard: SpeechSynthesis not supported in this browser');
                return;
            }
    
            const langMap = {
                english: 'en-US',
                hindi:   'hi-IN',
                marathi: 'mr-IN',
                telugu:  'te-IN',
                tamil:   'ta-IN',
                bengali: 'bn-IN',
                gujarati: 'gu-IN'
            };
    
            const utterance = new SpeechSynthesisUtterance(this.targetInput.value);
            utterance.lang = langMap[this.currentLanguage] || 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    
        destroy() {
            this.container.removeEventListener('mlk:clear', this._onClear);
            this.container.removeEventListener('mlk:speak', this._onSpeak);
            this.container.innerHTML = '';
            this.container.className = '';
            this.container.removeAttribute('role');
            this.container.removeAttribute('aria-label');
        }
    
        _attachEvents() {
            this.container.addEventListener('mlk:clear', this._onClear);
            this.container.addEventListener('mlk:speak', this._onSpeak);
        }
    
        _emit(eventName, detail) {
            this.container.dispatchEvent(new CustomEvent(`mlk:${eventName}`, { detail, bubbles: true }));
        }
    }
    
    // ─── Built-in layouts ────────────────────────────────────────────────────────
    
    MultiLanguageKeyboard.registerLayout('english', {
        name: '🇺🇸 English',
        normal: [
            ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
            ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
            ['Caps','a','s','d','f','g','h','j','k','l',';',"'",'Enter'],
            ['Shift','z','x','c','v','b','n','m',',','.','/', 'Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ],
        shift: [
            ['~','!','@','#','$','%','^','&','*','(',')', '_','+','Backspace'],
            ['Tab','Q','W','E','R','T','Y','U','I','O','P','{','}','|'],
            ['Caps','A','S','D','F','G','H','J','K','L',':','"','Enter'],
            ['Shift','Z','X','C','V','B','N','M','<','>','?','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ]
    });
    
    MultiLanguageKeyboard.registerLayout('hindi', {
        name: '🇮🇳 हिन्दी',
        normal: [
            ['ॊ','१','२','३','४','५','६','७','८','९','०','-','ृ','Backspace'],
            ['Tab','ौ','ै','ा','ी','ू','ब','ह','ग','द','ज','ड','़','ॉ'],
            ['Caps','ो','े','्','ि','ु','प','र','क','त','च','ट','Enter'],
            ['Shift','ॆ','ं','म','न','व','ल','स',',','.','य','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ],
        shift: [
            ['ऒ','ऍ','ॅ','्र','र्द','ट्ठ','ण','घ','ङ','झ','़','ः','़','Backspace'],
            ['Tab','औ','ऐ','आ','ई','ऊ','भ','ः','ग','ध','झ','ढ','ञ','ऑ'],
            ['Caps','ओ','ए','अ','इ','उ','फ','ऱ','ख','थ','छ','ठ','Enter'],
            ['Shift','ऎ','ँ','म','न','व','ल','श','ष','।','य','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ]
    });
    
    MultiLanguageKeyboard.registerLayout('marathi', {
        name: '🇮🇳 मराठी',
        normal: [
            ['ॊ','१','२','३','४','५','६','७','८','९','०','-','ृ','Backspace'],
            ['Tab','ौ','ै','ा','ी','ू','ब','ह','ग','द','ज','ड','़','ॉ'],
            ['Caps','ो','े','्','ि','ु','प','र','क','त','च','ट','Enter'],
            ['Shift','ळ','ं','म','न','व','ल','स',',','.','य','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ],
        shift: [
            ['ऒ','ऍ','ॅ','्र','र्द','ट्ठ','ण','घ','ङ','झ','़','ः','़','Backspace'],
            ['Tab','औ','ऐ','आ','ई','ऊ','भ','ः','ग','ध','झ','ढ','ञ','ऑ'],
            ['Caps','ओ','ए','अ','इ','उ','फ','ऱ','ख','थ','छ','ठ','Enter'],
            ['Shift','ऴ','ँ','म','न','व','ल','श','ष','।','य','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ]
    });
    
    MultiLanguageKeyboard.registerLayout('telugu', {
        name: '🇮🇳 తెలుగు',
        normal: [
            ['ొ','౧','౨','౩','౪','౫','౬','౭','౮','౯','౦','-','ృ','Backspace'],
            ['Tab','ౌ','ై','ా','ీ','ూ','బ','హ','గ','ద','జ','డ','ఞ','Backspace'],
            ['Caps','ో','ే','్','ి','ు','ప','ర','క','త','చ','ట','Enter'],
            ['Shift','ె','ం','మ','న','వ','ల','స',',','.','య','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ],
        shift: [
            ['ఒ','ఎ','ఏ','ర్','జ్ఞ','త్ర','క్ష','శ్ర','(',')', 'ః','ఋ','Backspace'],
            ['Tab','ఔ','ఐ','ఆ','ఈ','ఊ','భ','ఙ','ఘ','ధ','ఝ','ఢ','ఞ','Backspace'],
            ['Caps','ఓ','ఏ','అ','ఇ','ఉ','ఫ','ఱ','ఖ','థ','ఛ','ఠ','Enter'],
            ['Shift','ఎ','ఁ','మ','న','వ','ళ','శ','ష','।','య','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ]
    });
    
    MultiLanguageKeyboard.registerLayout('tamil', {
        name: '🇮🇳 தமிழ்',
        normal: [
            ['ொ','௧','௨','௩','௪','௫','௬','௭','௮','௯','௦','-','்','Backspace'],
            ['Tab','ௌ','ை','ா','ீ','ூ','ப','ஹ','க','த','ஜ','ட','ஞ','Backspace'],
            ['Caps','ோ','ே','்','ி','ு','ப','ர','க','த','ச','ட','Enter'],
            ['Shift','ெ','ஂ','ம','ந','வ','ல','ச',',','.','ய','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ],
        shift: [
            ['ஒ','எ','ஏ','ற்','க்ஷ','ஸ்','ஷ்','ஸ்ரீ','(',')',':','ஃ','Backspace'],
            ['Tab','ஔ','ஐ','ஆ','ஈ','ஊ','ப','ஹ','க','த','ஜ','ட','ஞ','Backspace'],
            ['Caps','ஓ','ஏ','அ','இ','உ','ப','ற','க','த','ச','ட','Enter'],
            ['Shift','எ','ஂ','ம','ன','வ','ள','ஸ','ஷ','।','ய','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ]
    });
    
    MultiLanguageKeyboard.registerLayout('bengali', {
        name: '🇧🇩 বাংলা',
        normal: [
            ['ৎ','১','২','৩','৪','৫','৬','৭','৮','৯','০','-','ৃ','Backspace'],
            ['Tab','ৌ','ৈ','া','ী','ূ','ব','হ','গ','দ','জ','ড','়','ৗ'],
            ['Caps','ো','ে','্','ি','ু','প','র','ক','ত','চ','ট','Enter'],
            ['Shift','এ','ং','ম','ন','ব','ল','স',',','.','য','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ],
        shift: [
            ['অ','ৠ','ৡ','র্','জ্ঞ','ত্র','ক্ষ','শ্র','(',')', 'ঃ','ঋ','Backspace'],
            ['Tab','ঔ','ঐ','আ','ঈ','ঊ','ভ','ঙ','ঘ','ধ','ঝ','ঢ','ঞ','ৗ'],
            ['Caps','ও','এ','অ','ই','উ','ফ','ড়','খ','থ','ছ','ঠ','Enter'],
            ['Shift','এ','ঁ','ম','ণ','ব','ল','শ','ষ','।','য','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ]
    });
    
    MultiLanguageKeyboard.registerLayout('gujarati', {
        name: '🇮🇳 ગુજરાતી',
        normal: [
            ['ૈ','૧','૨','૩','૪','૫','૬','૭','૮','૯','૦','-','ૃ','Backspace'],
            ['Tab','ૌ','ૈ','ા','ી','ૂ','બ','હ','ગ','દ','જ','ડ','઼','ૉ'],
            ['Caps','ો','ે','્','િ','ુ','પ','ર','ક','ત','ચ','ટ','Enter'],
            ['Shift','ૅ','ં','મ','ન','વ','લ','સ',',','.','ય','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ],
        shift: [
            ['ઑ','ઍ','ૅ','્ર','ર્દ','ટ્ઠ','ણ','ઘ','ઙ','ઝ','઼','ઃ','઼','Backspace'],
            ['Tab','ઔ','ઐ','આ','ઈ','ઊ','ભ','ઃ','ગ','ધ','ઝ','ઢ','ઞ','ઑ'],
            ['Caps','ઓ','એ','અ','ઇ','ઉ','ફ','઱','ખ','થ','છ','ઠ','Enter'],
            ['Shift','ઍ','ઁ','મ','ન','વ','લ','શ','ષ','।','ય','Shift'],
            ['Ctrl','Win','Alt','Space','Alt','Win','Menu','Ctrl']
        ]
    });
    
    // ─── Auto-init via data attributes ───────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-mlk-keyboard]').forEach(el => {
            const options = el.dataset.mlkOptions ? JSON.parse(el.dataset.mlkOptions) : {};
            if (el.dataset.mlkTarget) {
                options.targetInput = document.querySelector(el.dataset.mlkTarget);
            }
            new MultiLanguageKeyboard(el, options);
        });
    });
    return MultiLanguageKeyboard;
}));
