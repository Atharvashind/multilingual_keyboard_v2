export interface Layout {
  name: string;
  normal: string[][];
  shift: string[][];
}

export interface KeyboardOptions {
  /** Default language code */
  language?: string;

  /** Input element to receive typed text */
  targetInput?: HTMLElement | null;

  /** Show Clear and Speak buttons */
  showControls?: boolean;

  /** Theme name (reserved for future use) */
  theme?: string;

  /** Callback when a key is pressed */
  onKeyPress?: (key: string) => void;

  /** Callback when language is changed */
  onLanguageChange?: (language: string) => void;
}

export declare class MultiLanguageKeyboard {
  /**
   * Creates a new MultiLanguageKeyboard instance
   * @param container - Selector string or HTMLElement where keyboard will be rendered
   * @param options - Configuration options
   */
  constructor(container: string | HTMLElement, options?: KeyboardOptions);

  /** Current active language */
  currentLanguage: string;

  /** Whether shift is currently active */
  isShift: boolean;

  /** Whether caps lock is currently active */
  isCapsLock: boolean;

  /** Current target input element */
  targetInput: HTMLElement | null;

  /**
   * Switch to a different language layout
   * @param language - Language code (e.g., 'english', 'hindi')
   */
  switchLanguage(language: string): void;

  /**
   * Set the target input element dynamically
   * @param input - Selector string or HTMLElement
   */
  setTarget(input: string | HTMLElement): void;

  /** Clear the target input field */
  clear(): void;

  /** Speak the content of target input using Web Speech API */
  speak(): void;

  /** Remove the keyboard from DOM and cleanup */
  destroy(): void;

  /**
   * Register a custom keyboard layout
   * @param name - Unique identifier for the layout
   * @param layout - Layout configuration object
   */
  static registerLayout(name: string, layout: Layout): void;

  /** Built-in language layouts */
  static LAYOUTS: Record<string, Layout>;
}

export default MultiLanguageKeyboard;
