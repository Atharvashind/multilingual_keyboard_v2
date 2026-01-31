# 🌍 MultiLanguage Keyboard

A versatile, accessible, and easy-to-integrate virtual keyboard supporting 6 languages: **English**, **Hindi**, **Marathi**, **Telugu**, **Tamil**, and **Bengali**.

Perfect for web applications, mobile apps (via WebView), kiosks, and any system requiring multi-language input.

## ✨ Features

- 🌐 **6 Languages**: English, हिन्दी (Hindi), मराठी (Marathi), తెలుగు (Telugu), தமிழ் (Tamil), বাংলা (Bengali)
- ♿ **Accessible**: ARIA labels, keyboard navigation, screen reader support
- 📱 **Responsive**: Works on mobile, tablet, and desktop
- 🎨 **Customizable**: CSS variables and themes
- 🔊 **Text-to-Speech**: Built-in speech synthesis
- 📦 **Zero Dependencies**: Pure vanilla JavaScript
- ⚡ **Lightweight**: ~15KB minified

## 🚀 Quick Start

### Option 1: CDN (Easiest)

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600&family=Noto+Sans+Devanagari&family=Noto+Sans+Bengali&family=Noto+Sans+Telugu&family=Noto+Sans+Tamil&display=swap" rel="stylesheet">
</head>
<body>
  <textarea id="myInput" placeholder="Type here..."></textarea>
  <div id="keyboard"></div>

  <script src="https://cdn.jsdelivr.net/gh/yourusername/multilanguage-keyboard@latest/dist/keyboard.js"></script>
  <script>
    const kb = new MultiLanguageKeyboard('#keyboard', {
      targetInput: document.getElementById('myInput'),
      language: 'english'
    });
  </script>
</body>
</html>
```

### Option 2: NPM

```bash
npm install multilanguage-keyboard
```

```javascript
import MultiLanguageKeyboard from 'multilanguage-keyboard';

const kb = new MultiLanguageKeyboard('#keyboard', {
  targetInput: '#myInput',
  language: 'hindi'
});
```

### Option 3: Download

1. Download `dist/keyboard.js`
2. Include in your HTML:
```html
<script src="path/to/keyboard.js"></script>
```

## 📖 Usage Guide

### Basic Setup

```javascript
// Initialize with default options
const keyboard = new MultiLanguageKeyboard('#keyboard-container');

// With options
const keyboard = new MultiLanguageKeyboard('#keyboard-container', {
  language: 'hindi',        // Default language
  targetInput: '#input',    // Input field to type into
  showControls: true,       // Show Clear/Speak buttons
  onKeyPress: (key) => console.log('Pressed:', key),
  onLanguageChange: (lang) => console.log('Switched to:', lang)
});
```

### Methods

```javascript
// Switch language
keyboard.switchLanguage('bengali');

// Set target input dynamically
keyboard.setTarget('#anotherInput');

// Programmatic actions
keyboard.clear();      // Clear input
keyboard.speak();      // Text-to-speech

// Destroy
keyboard.destroy();    // Remove keyboard
```

### Events

```javascript
// Listen to events
container.addEventListener('mlk:input', (e) => console.log('Input:', e.detail));
container.addEventListener('mlk:backspace', () => console.log('Backspace pressed'));
container.addEventListener('mlk:clear', () => console.log('Cleared'));
container.addEventListener('mlk:languageChange', (e) => console.log('Language:', e.detail));
```

## 🔧 Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';
import MultiLanguageKeyboard from 'multilanguage-keyboard';

function App() {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const keyboardRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && inputRef.current) {
      keyboardRef.current = new MultiLanguageKeyboard(containerRef.current, {
        targetInput: inputRef.current,
        language: 'english'
      });
    }
    return () => keyboardRef.current?.destroy();
  }, []);

  return (
    <div>
      <textarea ref={inputRef} placeholder="Type here..." />
      <div ref={containerRef} />
    </div>
  );
}
```

### Vue 3

```vue
<template>
  <textarea ref="inputRef" v-model="text" placeholder="Type here..."></textarea>
  <div ref="keyboardRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MultiLanguageKeyboard from 'multilanguage-keyboard';

const text = ref('');
const inputRef = ref(null);
const keyboardRef = ref(null);
let keyboard = null;

onMounted(() => {
  keyboard = new MultiLanguageKeyboard(keyboardRef.value, {
    targetInput: inputRef.value,
    language: 'hindi'
  });
});

onUnmounted(() => {
  keyboard?.destroy();
});
</script>
```

### Angular

```typescript
import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import MultiLanguageKeyboard from 'multilanguage-keyboard';

@Component({
  selector: 'app-keyboard',
  template: `
    <textarea #inputEl></textarea>
    <div #keyboardEl></div>
  `
})
export class KeyboardComponent implements OnInit, OnDestroy {
  @ViewChild('inputEl') inputEl!: ElementRef;
  @ViewChild('keyboardEl') keyboardEl!: ElementRef;
  private keyboard: any;

  ngOnInit() {
    this.keyboard = new MultiLanguageKeyboard(this.keyboardEl.nativeElement, {
      targetInput: this.inputEl.nativeElement,
      language: 'tamil'
    });
  }

  ngOnDestroy() {
    this.keyboard?.destroy();
  }
}
```

### Iframe Embed (For Legacy Systems)

```html
<iframe 
  src="https://yourdomain.com/keyboard-embed.html?target=parentInput&language=hindi" 
  width="100%" 
  height="400" 
  frameborder="0">
</iframe>
```

## 🎨 Customization

### CSS Variables

```cssn.mlk-container {
  --mlk-bg: #2c3e50;
  --mlk-key-bg: #4a5568;
  --mlk-key-color: white;
  --mlk-border-radius: 8px;
  --mlk-padding: 20px;
}
```

### Custom Layout

```javascript
// Register custom layout
MultiLanguageKeyboard.registerLayout('custom', {
  name: 'Custom',
  normal: [
    ['a', 'b', 'c'],
    ['1', '2', '3']
  ],
  shift: [
    ['A', 'B', 'C'],
    ['!', '@', '#']
  ]
});

// Use it
keyboard.switchLanguage('custom');
```

## 📱 Mobile App Integration

### React Native (WebView)

```jsx
import { WebView } from 'react-native-webview';

const html = `...`; // Load keyboard.html content

<WebView
  source={{ html }}
  onMessage={(event) => {
    const { text } = JSON.parse(event.nativeEvent.data);
    // Handle typed text
  }}
/>
```

### Flutter (WebView)

```dart
WebView(
  initialUrl: 'keyboard.html',
  javascriptMode: JavascriptMode.unrestricted,
  onMessageReceived: (JavascriptMessage message) {
    // Handle input
  },
)
```

### Android (WebView)

```java
WebView webView = findViewById(R.id.webview);
webView.getSettings().setJavaScriptEnabled(true);
webView.addJavascriptInterface(new KeyboardInterface(), "Android");
webView.loadUrl("file:///android_asset/keyboard.html");
```

## 🔤 Supported Languages

| Language | Code | Script | Font Family |
|----------|------|--------|-------------|
| English | `english` | Latin | Noto Sans |
| Hindi | `hindi` | Devanagari | Noto Sans Devanagari |
| Marathi | `marathi` | Devanagari | Noto Sans Devanagari |
| Telugu | `telugu` | Telugu | Noto Sans Telugu |
| Tamil | `tamil` | Tamil | Noto Sans Tamil |
| Bengali | `bengali` | Bengali | Noto Sans Bengali |

## ♿ Accessibility

- **Keyboard Navigation**: Tab through keys, Enter/Space to press
- **ARIA Labels**: All buttons properly labeled for screen readers
- **Visual Feedback**: Clear focus indicators
- **Speech Synthesis**: Built-in TTS for entered text
- **High Contrast**: Works in high contrast mode

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Chrome Android 60+

## 📦 Repository Structure

```
multilanguage-keyboard/
├── dist/
│   └── keyboard.js          # Bundled version (use this)
├── src/
│   ├── keyboard.js          # Source
│   └── layouts/             # Individual language files
├── examples/
│   ├── vanilla/             # Plain HTML example
│   ├── react/               # React example
│   ├── vue/                 # Vue example
│   └── iframe/              # Embed example
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use in commercial and personal projects.

## 🙏 Credits

- Fonts: Google Noto Sans family
- Inspired by InScript keyboard layouts

---

Made with ❤️ for multilingual web accessibility
<<<<<<< HEAD
>>>>>>> 142b144 (Initial release: v1.0.0 - 6 language support)
=======
#   m u l t i l i n g u a l _ k e y b o a d r 
 
 
>>>>>>> 81b9848 (first commit)
