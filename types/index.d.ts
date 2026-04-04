export interface Layout {
    name: string;
    normal: string[][];
    shift: string[][];
}

export type LanguageCode =
    | 'english'
    | 'hindi'
    | 'marathi'
    | 'telugu'
    | 'tamil'
    | 'bengali'
    | 'gujarati'
    | (string & {}); // allow custom registered layouts

export interface KeyboardOptions {
    /** Default language to display. Defaults to 'english'. */
    language?: LanguageCode;

    /** Input/textarea element (or CSS selector) that receives typed text. */
    targetInput?: HTMLElement | HTMLInputElement | HTMLTextAreaElement | string | null;

    /** Show the built-in Clear and Speak buttons. Defaults to true. */
    showControls?: boolean;

    /** Theme name — reserved for future use. */
    theme?: string;

    /** Called every time a key is pressed, with the key value as argument. */
    onKeyPress?: (key: string) => void;

    /** Called when the active language changes. */
    onLanguageChange?: (language: LanguageCode) => void;
}

export declare class MultiLanguageKeyboard {
    /**
     * Creates and renders a virtual keyboard inside the given container.
     * @param container CSS selector string or DOM element
     * @param options   Optional configuration
     */
    constructor(container: string | HTMLElement, options?: KeyboardOptions);

    currentLanguage: LanguageCode;
    isShift: boolean;
    isCapsLock: boolean;
    targetInput: HTMLElement | null;

    /**
     * Switch the keyboard to a different language layout.
     * @param language Language code, e.g. 'hindi', 'gujarati'
     */
    switchLanguage(language: LanguageCode): void;

    /**
     * Change the target input element at runtime.
     * @param input CSS selector or DOM element
     */
    setTarget(input: string | HTMLElement): void;

    /** Clear the target input field. */
    clear(): void;

    /** Read the target input aloud using the Web Speech API. */
    speak(): void;

    /** Remove the keyboard from the DOM and clean up all event listeners. */
    destroy(): void;

    /**
     * Handle a key press programmatically (same as clicking a key).
     * @param key Key value, e.g. 'a', 'Backspace', 'Space'
     */
    handleKey(key: string): void;

    /**
     * Register a custom keyboard layout.
     * @param name   Unique identifier for the layout
     * @param layout Layout definition with normal and shift key arrays
     */
    static registerLayout(name: string, layout: Layout): void;

    /** All currently registered layouts. */
    static readonly LAYOUTS: Record<string, Layout>;
}

export default MultiLanguageKeyboard;
