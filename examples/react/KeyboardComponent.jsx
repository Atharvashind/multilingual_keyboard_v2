import React, { useEffect, useRef, useState } from 'react';
import MultiLanguageKeyboard from 'multilanguage-keyboard';
import 'multilanguage-keyboard/dist/keyboard.css'; // If you have separate CSS

// Note: In a real React app, you would install via npm:
// npm install multilanguage-keyboard

function MultiLangKeyboardExample() {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const keyboardRef = useRef(null);
  const [currentLang, setCurrentLang] = useState('english');
  const [text, setText] = useState('');

  useEffect(() => {
    // Initialize keyboard once
    if (containerRef.current && inputRef.current) {
      keyboardRef.current = new MultiLanguageKeyboard(containerRef.current, {
        targetInput: inputRef.current,
        language: currentLang,
        showControls: true,
        onLanguageChange: (lang) => {
          setCurrentLang(lang);
          console.log('Language changed to:', lang);
        },
        onKeyPress: (key) => {
          console.log('Pressed:', key);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (keyboardRef.current) {
        keyboardRef.current.destroy();
      }
    };
  }, []); // Empty dependency array = run once

  // Update keyboard when language state changes externally
  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.switchLanguage(currentLang);
    }
  }, [currentLang]);

  const handleSpeak = () => {
    keyboardRef.current?.speak();
  };

  const handleClear = () => {
    keyboardRef.current?.clear();
    setText('');
  };

  return (
    <div className="keyboard-app">
      <style>{`
        .keyboard-app {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Noto Sans', sans-serif;
        }
        .input-area {
          margin-bottom: 20px;
        }
        textarea {
          width: 100%;
          min-height: 150px;
          padding: 15px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 18px;
          font-family: inherit;
        }
        .controls {
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
        }
        button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background: #667eea;
          color: white;
          cursor: pointer;
        }
        button:hover {
          background: #5568d3;
        }
        .lang-indicator {
          padding: 10px;
          background: #f0f0f0;
          border-radius: 5px;
          margin-bottom: 10px;
        }
      `}</style>

      <h1>MultiLanguage Keyboard - React Demo</h1>

      <div className="lang-indicator">
        Current Language: <strong>{currentLang}</strong>
      </div>

      <div className="controls">
        <button onClick={() => setCurrentLang('english')}>English</button>
        <button onClick={() => setCurrentLang('hindi')}>Hindi</button>
        <button onClick={() => setCurrentLang('bengali')}>Bengali</button>
        <button onClick={handleSpeak}>🔊 Speak</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      <div className="input-area">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here using the keyboard below..."
        />
      </div>

      {/* Keyboard Container */}
      <div ref={containerRef} />
    </div>
  );
}

export default MultiLangKeyboardExample;
