import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [vue()],
        server: {
            port: parseInt(env.VITE_PORT) || 5173,
            host: true,
            proxy: {
                "/api": {
                    target: "http://localhost:1337",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
    };
});
