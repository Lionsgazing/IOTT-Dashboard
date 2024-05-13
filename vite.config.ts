import { defineConfig } from "vite";

export default defineConfig({
  root: "./src",
  
  server: {
    port: 8080,
    cors: {
      origin: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  }, 
})
