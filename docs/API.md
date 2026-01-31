# API Documentation

## Class: MultiLanguageKeyboard

The main class for creating and managing a multilingual virtual keyboard.

### Constructor

```javascript
new MultiLanguageKeyboard(container, options)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `container` | `string \| HTMLElement` | Yes | Selector string or DOM element where keyboard will be rendered |
| `options` | `Object` | No | Configuration options |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `language` | `string` | `'english'` | Default language code |
| `targetInput` | `HTMLElement \| null` | `null` | Input element to receive typed text |
| `showControls` | `boolean` | `true` | Show Clear/Speak buttons |
| `theme` | `string` | `'default'` | Theme name (future feature) |
| `onKeyPress` | `function` | `null` | Callback when key is pressed: `(key) => void` |
| `onLanguageChange` | `function` | `null` | Callback when language changes: `(language) => void` |

### Example

```javascript
const keyboard = new MultiLanguageKeyboard('#keyboard-container', {
  language: 'hindi',
  targetInput: document.getElementById('text-input'),
  showControls: true,
  onKeyPress: (key) => console.log('Pressed:', key),
  onLanguageChange: (lang) => console.log('Language:', lang)
});
```

---

## Methods

### `switchLanguage(language)`

Changes the keyboard layout to the specified language.

**Parameters:**
- `language` (string): Language code (e.g., 'english', 'hindi', 'bengali')

**Returns:** `void`

**Example:**
```javascript
keyboard.switchLanguage('tamil');
```

---

### `setTarget(input)`

Dynamically changes the target input element.

**Parameters:**
- `input` (string | HTMLElement): Selector or DOM element

**Returns:** `void`

**Example:**
```javascript
keyboard.setTarget('#new-input');
keyboard.setTarget(document.getElementById('input'));
```

---

### `clear()`

Clears the target input field.

**Returns:** `void`

**Example:**
```javascript
keyboard.clear();
```

---

### `speak()`

Uses Web Speech API to speak the content of the target input.

**Returns:** `void`

**Example:**
```javascript
keyboard.speak();
```

---

### `destroy()`

Removes the keyboard from the DOM and cleans up event listeners.

**Returns:** `void`

**Example:**
```javascript
keyboard.destroy();
```

---

## Static Methods

### `MultiLanguageKeyboard.registerLayout(name, layout)`

Registers a custom keyboard layout.

**Parameters:**
- `name` (string): Unique identifier for the layout
- `layout` (Object): Layout configuration

**Layout Object Structure:**
```javascript
{
  name: 'Display Name',
  normal: [
    ['row1-key1', 'row1-key2', '...'],
    ['row2-key1', 'row2-key2', '...'],
    // ... more rows
  ],
  shift: [
    // Same structure as normal (uppercase/special chars)
  ]
}
```

**Example:**
```javascript
MultiLanguageKeyboard.registerLayout('custom', {
  name: 'Custom Layout',
  normal: [
    ['a', 'b', 'c'],
    ['1', '2', '3'],
    ['Shift', 'Space', 'Backspace']
  ],
  shift: [
    ['A', 'B', 'C'],
    ['!', '@', '#'],
    ['Shift', 'Space', 'Backspace']
  ]
});

// Use it
keyboard.switchLanguage('custom');
```

---

## Events

The keyboard emits custom events on the container element.

### Event: `mlk:input`

Fired when text is input (not for special keys like Shift, Backspace).

**Detail:** The character that was input

```javascript
document.getElementById('keyboard-container').addEventListener('mlk:input', (e) => {
  console.log('Input:', e.detail); // e.g., "अ"
});
```

### Event: `mlk:backspace`

Fired when backspace is pressed.

```javascript
document.getElementById('keyboard-container').addEventListener('mlk:backspace', () => {
  console.log('Backspace pressed');
});
```

### Event: `mlk:clear`

Fired when clear button is clicked.

```javascript
document.getElementById('keyboard-container').addEventListener('mlk:clear', () => {
  console.log('Cleared');
});
```

### Event: `mlk:languageChange`

Fired when language is changed.

**Detail:** New language code

```javascript
document.getElementById('keyboard-container').addEventListener('mlk:languageChange', (e) => {
  console.log('New language:', e.detail); // e.g., "hindi"
});
```

---

## Built-in Languages

| Code | Name | Script | Font Required |
|------|------|--------|---------------|
| `english` | English | Latin | Noto Sans |
| `hindi` | हिन्दी | Devanagari | Noto Sans Devanagari |
| `marathi` | मराठी | Devanagari | Noto Sans Devanagari |
| `telugu` | తెలుగు | Telugu | Noto Sans Telugu |
| `tamil` | தமிழ் | Tamil | Noto Sans Tamil |
| `bengali` | বাংলা | Bengali | Noto Sans Bengali |

---

## CSS Classes

The keyboard uses BEM-style naming with `mlk-` prefix.

### Container
- `.mlk-container` - Main keyboard wrapper

### Language Selector
- `.mlk-lang-selector` - Language buttons container
- `.mlk-lang-btn` - Individual language button
- `.mlk-lang-btn.active` - Active language button

### Keyboard
- `.mlk-keyboard` - Keys container
- `.mlk-row` - Row of keys
- `.mlk-key` - Individual key
- `.mlk-key.wide` - Wide keys (Shift, Caps, Backspace)
- `.mlk-key.extra-wide` - Extra wide (Enter)
- `.mlk-key.space` - Space bar
- `.mlk-key.shift` - Shift key
- `.mlk-key.caps` - Caps Lock key
- `.mlk-key.special` - Special keys (Ctrl, Alt, etc.)
- `.mlk-key.active` - Active modifier key (Shift/Caps on)

### Controls
- `.mlk-controls` - Control buttons container
- `.mlk-control-btn` - Control button (Clear, Speak)

---

## TypeScript Definitions

```typescript
declare class MultiLanguageKeyboard {
  constructor(container: string | HTMLElement, options?: KeyboardOptions);

  switchLanguage(language: string): void;
  setTarget(input: string | HTMLElement): void;
  clear(): void;
  speak(): void;
  destroy(): void;

  static registerLayout(name: string, layout: Layout): void;
}

interface KeyboardOptions {
  language?: string;
  targetInput?: HTMLElement | null;
  showControls?: boolean;
  theme?: string;
  onKeyPress?: (key: string) => void;
  onLanguageChange?: (language: string) => void;
}

interface Layout {
  name: string;
  normal: string[][];
  shift: string[][];
}
```

---

## Error Handling

### Common Errors

**"Container element not found"**
- Ensure the container exists in DOM before initializing
- Check your selector string

**"Layout 'xxx' not registered"**
- Check that layout code is correct
- Register custom layout before using it

**No speech output**
- Browser may not support Web Speech API
- User may need to interact with page first (click)

---

## Examples

### Basic Usage

```html
<div id="keyboard"></div>
<script src="keyboard.js"></script>
<script>
  new MultiLanguageKeyboard('#keyboard', {
    targetInput: document.getElementById('input'),
    language: 'english'
  });
</script>
```

### Multiple Keyboards

```javascript
const kb1 = new MultiLanguageKeyboard('#keyboard1', {
  targetInput: '#input1',
  language: 'hindi'
});

const kb2 = new MultiLanguageKeyboard('#keyboard2', {
  targetInput: '#input2',
  language: 'english'
});
```

### Dynamic Target Switching

```javascript
const keyboard = new MultiLanguageKeyboard('#keyboard');

// Switch focus between inputs
document.getElementById('input1').addEventListener('focus', () => {
  keyboard.setTarget('#input1');
});

document.getElementById('input2').addEventListener('focus', () => {
  keyboard.setTarget('#input2');
});
```
