<template>
  <div class="keyboard-demo">
    <h1>MultiLanguage Keyboard - Vue 3 Demo</h1>

    <div class="info">
      <p>Current Language: <strong>{{ currentLang }}</strong></p>
      <div class="controls">
        <button @click="changeLanguage('english')">English</button>
        <button @click="changeLanguage('hindi')">Hindi</button>
        <button @click="changeLanguage('tamil')">Tamil</button>
        <button @click="changeLanguage('bengali')">Bengali</button>
        <button @click="speakText">🔊 Speak</button>
        <button @click="clearText">Clear</button>
      </div>
    </div>

    <div class="input-area">
      <label>Your Text:</label>
      <textarea
        ref="inputRef"
        v-model="text"
        placeholder="Type here..."
        rows="5"
      ></textarea>
    </div>

    <!-- Keyboard Container -->
    <div ref="keyboardRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MultiLanguageKeyboard from 'multilanguage-keyboard';

// In a real app: npm install multilanguage-keyboard

const text = ref('');
const currentLang = ref('english');
const inputRef = ref(null);
const keyboardRef = ref(null);
let keyboard = null;

onMounted(() => {
  // Initialize keyboard
  keyboard = new MultiLanguageKeyboard(keyboardRef.value, {
    targetInput: inputRef.value,
    language: currentLang.value,
    showControls: true,
    onLanguageChange: (lang) => {
      currentLang.value = lang;
      console.log('Switched to:', lang);
    }
  });
});

onUnmounted(() => {
  // Cleanup
  keyboard?.destroy();
});

const changeLanguage = (lang) => {
  currentLang.value = lang;
  keyboard?.switchLanguage(lang);
};

const speakText = () => {
  keyboard?.speak();
};

const clearText = () => {
  keyboard?.clear();
  text.value = '';
};
</script>

<style scoped>
.keyboard-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Noto Sans', sans-serif;
}

.info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: #764ba2;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #653a91;
}

.input-area {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
}

textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #764ba2;
}
</style>
