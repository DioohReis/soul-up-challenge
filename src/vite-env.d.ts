/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API Java (ex.: https://soulup-sprint4-java.onrender.com). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
