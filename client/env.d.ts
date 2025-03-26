interface ImportMetaEnv {
    readonly VITE_API_URL: string; // Định nghĩa biến môi trường VITE_API_URL
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}