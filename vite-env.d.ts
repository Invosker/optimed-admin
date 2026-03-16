/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_API_URLBASE: string;
  readonly VITE_TOKEN: string;
  readonly NODE_ENV: string;
 
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}