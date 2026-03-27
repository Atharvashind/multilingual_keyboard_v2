
# 🌍 MultiLanguage Keyboard

A versatile, accessible, and easy-to-integrate virtual keyboard supporting **6 languages**:
**English, Hindi, Marathi, Telugu, Tamil, and Bengali**.

Ideal for **web apps, kiosks, government portals, accessibility tools**, and multilingual systems.

---

## ✨ Features

- 🌐 **6 Languages**: English, हिन्दी (Hindi), मराठी (Marathi), తెలుగు (Telugu), தமிழ் (Tamil), বাংলা (Bengali)
- ♿ **Accessible**: ARIA labels, keyboard navigation, screen reader support
- 📱 **Responsive**: Mobile, tablet, desktop friendly
- 🎨 **Customizable**: CSS variables & themes
- 🔊 **Text-to-Speech**: Built-in speech synthesis
- 📦 **Zero Dependencies**: Pure Vanilla JavaScript
- ⚡ **Lightweight**: ~15KB minified

---

## 🚀 Quick Start

### Option 1: CDN (Easiest)

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&family=Noto+Sans-Devanagari&family=Noto+Sans-Bengali&family=Noto+Sans-Telugu&family=Noto+Sans-Tamil&display=swap" rel="stylesheet">
</head>
<body>
  <textarea id="myInput" placeholder="Type here..."></textarea>
  <div id="keyboard"></div>

  <script src="https://cdn.jsdelivr.net/gh/yourusername/multilanguage-keyboard/dist/keyboard.js"></script>
  <script>
    new MultiLanguageKeyboard('#keyboard', {
      targetInput: document.getElementById('myInput'),
      language: 'english'
    });
  </script>
</body>
</html>
````

---

### Option 2: NPM

```bash
npm install multilanguage-keyboard
```

```js
import MultiLanguageKeyboard from 'multilanguage-keyboard';

new MultiLanguageKeyboard('#keyboard', {
  targetInput: '#myInput',
  language: 'hindi'
});
```

---

## 📖 Usage

```js
const keyboard = new MultiLanguageKeyboard('#keyboard', {
  language: 'hindi',
  targetInput: '#input',
  showControls: true,
  onKeyPress: key => console.log(key),
  onLanguageChange: lang => console.log(lang)
});
```

### Methods

```js
keyboard.switchLanguage('bengali');
keyboard.setTarget('#anotherInput');
keyboard.clear();
keyboard.speak();
keyboard.destroy();
```

---

## 🔧 Framework Support

### React, Vue, Angular

✔ Works via **direct DOM integration**
✔ Examples included in `/examples`

---

## 🎨 Customization

### CSS Variables

```css
.mlk-container {
  --mlk-bg: #2c3e50;
  --mlk-key-bg: #4a5568;
  --mlk-key-color: #ffffff;
  --mlk-border-radius: 8px;
}
```

---

## 🔤 Supported Languages

| Language | Code    | Script     |
| -------- | ------- | ---------- |
| English  | english | Latin      |
| Hindi    | hindi   | Devanagari |
| Marathi  | marathi | Devanagari |
| Telugu   | telugu  | Telugu     |
| Tamil    | tamil   | Tamil      |
| Bengali  | bengali | Bengali    |

---

## ♿ Accessibility

* Keyboard navigation (Tab / Enter)
* Screen-reader friendly (ARIA)
* High-contrast compatible
* Built-in text-to-speech

---

## 🌐 Browser Support

Chrome • Firefox • Safari • Edge
Desktop & Mobile supported

---

## 📦 Project Structure

```
multilanguage-keyboard/
├── dist/
│   └── keyboard.js
├── src/
├── examples/
├── package.json
└── README.md
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feature/new-feature`)
3. Commit (`git commit -m "Add feature"`)
4. Push (`git push origin feature/new-feature`)
5. Open a Pull Request

---
## 📸 Screenshots

### Desktop
<img width="509" height="294" alt="key_leng" src="https://github.com/user-attachments/assets/45384179-7f7e-49f6-8d94-5bb4b580d5e1" />



### Mobile
![Mobile](screenshots/mobile.png)

### Language Switching
![Languages](screenshots/language-switch.png)


## 📄 License

MIT License — free for personal & commercial use.

---

Made  for multilingual accessibility

