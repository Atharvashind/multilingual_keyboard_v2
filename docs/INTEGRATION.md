# Integration Guide

## Overview

The MultiLanguage Keyboard can be integrated into your application in multiple ways, depending on your tech stack and requirements.

## Integration Methods

### 1. **Script Tag (CDN or Local)** ⭐ Simplest

Best for: Static websites, WordPress, CMS, legacy systems

```html
<!-- From CDN (after you publish to GitHub/GitLab) -->
<script src="https://cdn.jsdelivr.net/gh/yourusername/multilanguage-keyboard@latest/dist/keyboard.js"></script>

<!-- Or local file -->
<script src="./path/to/keyboard.js"></script>

<script>
  const keyboard = new MultiLanguageKeyboard('#keyboard-container', {
    targetInput: document.getElementById('myInput'),
    language: 'english'
  });
</script>
```

**Pros:**
- Zero build step
- Works anywhere HTML works
- Cacheable

**Cons:**
- Global namespace
- No tree-shaking

---

### 2. **NPM Module** ⭐ Recommended

Best for: React, Vue, Angular, Node.js projects

```bash
npm install multilanguage-keyboard
```

```javascript
import MultiLanguageKeyboard from 'multilanguage-keyboard';

const keyboard = new MultiLanguageKeyboard('#container', {
  language: 'hindi'
});
```

**Pros:**
- Version management
- Tree-shaking support
- Works with bundlers (Webpack, Vite, Rollup)

**Cons:**
- Requires build step

---

### 3. **ES Modules (Direct Import)**

Best for: Modern browsers without build step

```html
<script type="module">
  import MultiLanguageKeyboard from './src/keyboard.js';

  const kb = new MultiLanguageKeyboard('#container');
</script>
```

**Pros:**
- Native browser support
- No bundler needed

**Cons:**
- Requires careful path handling
- CORS issues if not on same domain

---

### 4. **Iframe Embed**

Best for: Sandboxed environments, third-party widgets, CMSs

```html
<iframe 
  src="https://yourdomain.com/keyboard-iframe.html" 
  width="100%" 
  height="400"
  id="keyboardFrame">
</iframe>

<script>
  // Receive messages from iframe
  window.addEventListener('message', (e) => {
    if (e.data.type === 'keyboard-input') {
      document.getElementById('input').value += e.data.char;
    }
  });
</script>
```

**Pros:**
- Complete isolation
- No CSS/JS conflicts
- Works in any CMS

**Cons:**
- Requires postMessage API
- Harder to style from parent

---

### 5. **Web Component (Future)**

Coming soon:

```html
<multi-lang-keyboard target="#input" language="bengali"></multi-lang-keyboard>
```

---

## Mobile Integration

### React Native

```jsx
import { WebView } from 'react-native-webview';

const KEYBOARD_HTML = require('./keyboard.html');

function App() {
  const webViewRef = useRef();

  return (
    <WebView
      ref={webViewRef}
      source={KEYBOARD_HTML}
      onMessage={(event) => {
        const text = event.nativeEvent.data;
        // Handle received text
      }}
    />
  );
}
```

### Flutter

```dart
WebView(
  initialUrl: 'file:///android_asset/flutter_assets/keyboard.html',
  javascriptMode: JavascriptMode.unrestricted,
  javascriptChannels: {
    JavascriptChannel(
      name: 'Keyboard',
      onMessageReceived: (JavascriptMessage message) {
        setState(() {
          text = message.message;
        });
      },
    ),
  },
)
```

### Android (Kotlin)

```kotlin
val webView: WebView = findViewById(R.id.webview)
webView.settings.javaScriptEnabled = true
webView.addJavascriptInterface(WebAppInterface(this), "Android")
webView.loadUrl("file:///android_asset/keyboard.html")

class WebAppInterface(private val mContext: Context) {
    @JavascriptInterface
    fun onTextInput(text: String) {
        // Handle input
    }
}
```

### iOS (Swift)

```swift
import WebKit

class ViewController: UIViewController, WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "keyboard", let text = message.body as? String {
            // Handle input
        }
    }
}
```

---

## Server-Side Rendering (SSR)

### Next.js

```jsx
import dynamic from 'next/dynamic';

const MultiLanguageKeyboard = dynamic(
  () => import('multilanguage-keyboard'),
  { ssr: false } // Keyboard needs window object
);

function Page() {
  return <MultiLanguageKeyboard />;
}
```

### Nuxt.js

```vue
<template>
  <client-only>
    <MultiLanguageKeyboard />
  </client-only>
</template>

<script>
export default {
  components: {
    MultiLanguageKeyboard: () => import('multilanguage-keyboard')
  }
}
</script>
```

---

## Styling Integration

### CSS Custom Properties

Override default styles:

```cssn.mlk-container {
  --mlk-bg: #your-color;
  --mlk-key-bg: #your-key-color;
  --mlk-border-radius: 12px;
}
```

### Tailwind CSS

If using Tailwind, disable built-in styles:

```javascript
const keyboard = new MultiLanguageKeyboard('#container', {
  theme: 'none' // Prevents injecting default CSS
});
```

Then style with Tailwind classes on the container.

---

## Troubleshooting

### CORS Issues

If loading from CDN:

```html
<!-- Use crossorigin attribute -->
<script crossorigin src="https://cdn.../keyboard.js"></script>
```

### Font Loading

Fonts load from Google CDN. For offline use:

1. Download Noto Sans fonts
2. Host locally
3. Update CSS

### z-index Issues

If keyboard appears behind other elements:

```cssn.mlk-container {
  position: relative;
  z-index: 9999;
}
```

---

## Performance Tips

1. **Lazy Loading**: Load keyboard only when input is focused
2. **Debouncing**: If saving to server on input, debounce the saves
3. **Virtualization**: For very long texts, consider virtual scrolling
4. **Font Loading**: Preload fonts if above-the-fold content

```html
<link rel="preload" href="font-file.woff2" as="font" type="font/woff2" crossorigin>
```

---

## Security Considerations

If using user-generated content:

```javascript
// Sanitize input if displaying elsewhere
import DOMPurify from 'dompurify';

keyboard = new MultiLanguageKeyboard('#container', {
  onKeyPress: (key) => {
    const clean = DOMPurify.sanitize(key);
    // Process clean input
  }
});
```

---

## Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 60+ | Full support |
| Firefox | 55+ | Full support |
| Safari | 12+ | Full support |
| Edge | 79+ | Full support |
| IE | 11 | Requires polyfills |
| iOS Safari | 12+ | Touch optimized |
| Chrome Android | 60+ | Full support |

For IE11 support, include:

```html
<script src="https://cdn.jsdelivr.net/npm/core-js-bundle@3/minified.js"></script>
```

---

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/Atharvashind/multilanguage-keyboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Atharvashind/multilanguage-keyboard/discussions)
- **Email**: satharva912@gmail.com

---

## Contributing

See [README.md](../README.md) for contribution guidelines.
