/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_GEMINI_API_KEY: string
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// ✨ View Transition API type declarations
interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
}

interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
}
