import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {

    // Load env file from parent directory
    const env = loadEnv(mode, path.join(process.cwd(), '..'), '')
  
    return {
      plugins: [react()],
      envDir: '..',
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    }
})
