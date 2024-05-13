import { defineConfig } from "vite";

export default defineConfig({
  root: "./src",
  
  server: {
    host: "0.0.0.0",
    port: 8086,
    cors: {
      origin: false,
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8085/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  }, 
})

