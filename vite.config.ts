import { defineConfig } from "vite";

export default defineConfig(() => ({
    base: "/dokisnake",
    server: {
        port: 5173,
        open: false,
    },
    build: {
        emptyOutDir: true,
        manifest: false,
    },
}));
