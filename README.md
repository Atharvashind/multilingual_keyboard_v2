# 🌍 MultiLanguage Keyboard

A zero-dependency virtual keyboard supporting **7 languages** — drop it into any web project in minutes.

**English • हिन्दी • मराठी • తెలుగు • தமிழ் • বাংলা • ગુજરાતી**

---

## ✨ Features

- 🌐 7 language layouts with native scripts
- ♿ Accessible — ARIA roles, `aria-pressed` states, screen-reader friendly
- 📱 Responsive — mobile, tablet, desktop
- 🔊 Text-to-Speech via Web Speech API
- 📦 Zero dependencies — pure Vanilla JavaScript
- ⚡ ~19 KB (UMD), ~16 KB (ESM)
- 🔌 Works as a `<script>` tag, npm module, or ES module

---

## 🚀 Quick Start

### Option 1 — Script tag (simplest)

Download `dist/keyboard.js` from the repo and include it directly:

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600&family=Noto+Sans+Devanagari&family=Noto+Sans+Bengali&family=Noto+Sans+Telugu&family=Noto+Sans+Tamil&family=Noto+Sans+Gujarati&display=swap" rel="stylesheet">

<textarea id="myInput" placeholder="Type here..."></textarea>
<div id="keyboard"></div>

<script src="dist/keyboard.js"></script>
<script>
  new MultiLanguageKeyboard('#keyboard', {
    targetInput: '#myInput',
    language: 'english'
  });
</script>
```

### Option 2 — npm

```bash
npm install multilanguage-keyboard
```

```js
// CommonJS
const MultiLanguageKeyboard = require('multilanguage-keyboard');

// ES Module / bundler (Vite, webpack, Rollup)
import MultiLanguageKeyboard from 'multilanguage-keyboard';

new MultiLanguageKeyboard('#keyboard', {
  targetInput: '#myInput',
  language: 'hindi'
});
```

### Option 3 — ES Module (no bundler)

```html
<script type="module">
  import MultiLanguageKeyboard from './dist/keyboard.esm.js';

  new MultiLanguageKeyboard('#keyboard', { targetInput: '#myInput' });
</script>
```

---

## ⚙️ Constructor

```js
new MultiLanguageKeyboard(container, options)
```

| Parameter   | Type                      | Required | Description                              |
|-------------|---------------------------|----------|------------------------------------------|
| `container` | `string \| HTMLElement`   | Yes      | CSS selector or DOM element for keyboard |
| `options`   | `KeyboardOptions`         | No       | Configuration object (see below)         |

### Options

| Option             | Type                      | Default     | Description                                          |
|--------------------|---------------------------|-------------|------------------------------------------------------|
| `language`         | `string`                  | `'english'` | Initial language layout                              |
| `targetInput`      | `string \| HTMLElement`   | `null`      | Input/textarea that receives typed text              |
| `showControls`     | `boolean`                 | `true`      | Show the built-in Clear and Speak buttons            |
| `theme`            | `string`                  | `'default'` | Theme name (reserved for future use)                 |
| `onKeyPress`       | `(key: string) => void`   | `null`      | Fires on every key press with the key value          |
| `onLanguageChange` | `(lang: string) => void`  | `null`      | Fires when the active language changes               |

```js
const kb = new MultiLanguageKeyboard('#keyboard', {
  language: 'hindi',
  targetInput: document.getElementById('myInput'),
  showControls: true,
  onKeyPress: (key) => console.log('Pressed:', key),
  onLanguageChange: (lang) => console.log('Language:', lang)
});
```

---

## 📖 Methods

### `switchLanguage(language)`

Switches the keyboard to a different language layout.

```js
kb.switchLanguage('gujarati');
kb.switchLanguage('tamil');
```

| Param      | Type     | Description                                      |
|------------|----------|--------------------------------------------------|
| `language` | `string` | Language code — see supported languages below    |

---

### `setTarget(input)`

Changes the target input element at runtime.

```js
kb.setTarget('#secondInput');
kb.setTarget(document.getElementById('anotherField'));
```

| Param   | Type                    | Description                  |
|---------|-------------------------|------------------------------|
| `input` | `string \| HTMLElement` | CSS selector or DOM element  |

---

### `clear()`

Clears the target input field and fires `input` / `change` events.

```js
kb.clear();
```

---

### `speak()`

Reads the target input text aloud using the browser's Web Speech API.
Uses the correct locale for the active language automatically.

```js
kb.speak();
```

> Requires a browser that supports `SpeechSynthesis`. Silently no-ops if unsupported.

---

### `handleKey(key)`

Programmatically triggers a key press — same effect as clicking a key on the keyboard.

```js
kb.handleKey('a');
kb.handleKey('Backspace');
kb.handleKey('Space');
kb.handleKey('Shift');
```

Useful for physical keyboard passthrough or automated testing.

---

### `destroy()`

Removes the keyboard from the DOM and cleans up all event listeners.
Call this when unmounting a component.

```js
kb.destroy();
```

---

### `MultiLanguageKeyboard.registerLayout(name, layout)` _(static)_

Registers a custom keyboard layout. Call this before creating an instance.

```js
MultiLanguageKeyboard.registerLayout('my-layout', {
  name: '🌐 My Language',
  normal: [
    ['a', 'b', 'c', 'Backspace'],
    ['Shift', 'd', 'e', 'Enter'],
    ['Ctrl', 'Alt', 'Space', 'Ctrl']
  ],
  shift: [
    ['A', 'B', 'C', 'Backspace'],
    ['Shift', 'D', 'E', 'Enter'],
    ['Ctrl', 'Alt', 'Space', 'Ctrl']
  ]
});

new MultiLanguageKeyboard('#keyboard', { language: 'my-layout' });
```

| Param    | Type     | Description                                  |
|----------|----------|----------------------------------------------|
| `name`   | `string` | Unique identifier used in `switchLanguage()`  |
| `layout` | `Layout` | Object with `name`, `normal`, and `shift` arrays |

---

### `MultiLanguageKeyboard.LAYOUTS` _(static getter)_

Returns all currently registered layouts.

```js
console.log(Object.keys(MultiLanguageKeyboard.LAYOUTS));
// ['english', 'hindi', 'marathi', 'telugu', 'tamil', 'bengali', 'gujarati']
```

---

## 🔤 Supported Languages

| Language  | Code        | Script     | TTS Locale |
|-----------|-------------|------------|------------|
| English   | `english`   | Latin      | `en-US`    |
| Hindi     | `hindi`     | Devanagari | `hi-IN`    |
| Marathi   | `marathi`   | Devanagari | `mr-IN`    |
| Telugu    | `telugu`    | Telugu     | `te-IN`    |
| Tamil     | `tamil`     | Tamil      | `ta-IN`    |
| Bengali   | `bengali`   | Bengali    | `bn-IN`    |
| Gujarati  | `gujarati`  | Gujarati   | `gu-IN`    |

---

## 🔧 Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';
import MultiLanguageKeyboard from 'multilanguage-keyboard';

function KeyboardInput() {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const kbRef = useRef(null);

  useEffect(() => {
    kbRef.current = new MultiLanguageKeyboard(containerRef.current, {
      targetInput: inputRef.current,
      language: 'english',
      onLanguageChange: (lang) => console.log('Lang:', lang)
    });
    return () => kbRef.current?.destroy();
  }, []);

  return (
    <>
      <textarea ref={inputRef} />
      <div ref={containerRef} />
    </>
  );
}
```

### Vue 3

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MultiLanguageKeyboard from 'multilanguage-keyboard';

const inputRef = ref(null);
const containerRef = ref(null);
let kb = null;

onMounted(() => {
  kb = new MultiLanguageKeyboard(containerRef.value, {
    targetInput: inputRef.value,
    language: 'hindi'
  });
});

onUnmounted(() => kb?.destroy());
</script>

<template>
  <textarea ref="inputRef" />
  <div ref="containerRef" />
</template>
```

---

## 🎨 Customization

Override these CSS classes to restyle the keyboard:

```css
/* Container background */
.mlk-container { background: #1a1a2e; }

/* Individual keys */
.mlk-key { background: #16213e; border-radius: 4px; }

/* Active Shift / Caps key */
.mlk-key.active { background: #e94560; }

/* Language selector buttons */
.mlk-lang-btn.active { background: white; color: #16213e; }
```

---

## 📦 Dist Files

| File                    | Format | Use case                              |
|-------------------------|--------|---------------------------------------|
| `dist/keyboard.js`      | UMD    | `<script>` tag (backwards compat)     |
| `dist/keyboard.umd.js`  | UMD    | `<script>` tag / `require()`          |
| `dist/keyboard.esm.js`  | ESM    | `import` / Vite / webpack / Rollup    |

Build from source:

```bash
node build.js
```

---

## ♿ Accessibility

- `role="group"` on the keyboard container
- `role="toolbar"` on the language selector
- `aria-pressed` on Shift, Caps Lock, and language buttons
- `aria-label` on every key
- Full keyboard navigation support

---

## 🌐 Browser Support

Chrome • Firefox • Safari • Edge — desktop and mobile.

---

## 🧪 Tests

A browser-based test suite is included at `test.html`. Open it via the local server to verify everything works:

```bash
# start a local server (Node.js built-in)
node -e "const h=require('http'),fs=require('fs'),p=require('path');h.createServer((q,r)=>{const f=p.join(process.cwd(),q.url==='/'?'index.html':q.url);fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end()}else{r.writeHead(200);r.end(d)}})}).listen(3000,()=>console.log('http://localhost:3000'))"
```

Then visit **http://localhost:3000/test.html**

**Latest result — 36 passed, 0 failed**

| Category | Tests | Result |
|---|---|---|
| Instantiation | 6 | ✅ all pass |
| Rendering | 7 | ✅ all pass |
| Key input | 11 | ✅ all pass |
| Methods (`switchLanguage`, `setTarget`, `clear`, `destroy`) | 9 | ✅ all pass |
| Static API (`LAYOUTS`, `registerLayout`) | 3 | ✅ all pass |

Covered cases include: CSS selector and DOM element constructors, missing container error, `targetInput` string resolution, ARIA attributes on all keys, cursor-aware character insertion, Backspace on selection, Shift auto-reset, `onKeyPress` / `onLanguageChange` callbacks, `input` event firing for React/Vue compatibility, and custom layout registration.

---

## � Screenshots

### Desktop
<img width="900" height="443" alt="guaj_desktop" src="https://github.com/user-attachments/assets/5bd5f856-2b20-4365-9eb0-bfec43ed81ea" />


### Mobile
<img width="172" height="377" alt="guaj_add" src="https://github.com/user-attachments/assets/3206cbe9-8461-44c5-83c1-b577650c0bd4" />


### Language Switching
![Languages](screenshots/language-switch.png)

---

## �📄 License

MIT — free for personal and commercial use.
