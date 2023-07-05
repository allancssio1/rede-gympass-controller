import {defineConfig} from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 * instalar vitest para testar e vite-tsconig-paths para
 * reconhecer os paths colocados no arquivo tsconfig.json
 */
export default defineConfig({
  plugins: [tsconfigPaths()]
})