import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // ❗️주의: Spring Boot가 실행되는 포트(기본 8080)와 일치해야 합니다.
      '/api': 'http://localhost:8080' 
    }
  }
})
