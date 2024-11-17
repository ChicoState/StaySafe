import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { GMAPS_API_KEY = '' } = loadEnv(mode, process.cwd(), '');

  // Return the configuration object
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000
    },
    preview: {
      host: true,
      port: 3000
    },
    define: {
      'process.env.GMAPS_API_KEY': JSON.stringify(GMAPS_API_KEY)
      
    }
  };
});
