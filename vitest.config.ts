import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig, UserConfig } from 'vitest/config'

export const config: UserConfig = {
  plugins: [tsconfigPaths()],
  test: {
    passWithNoTests: true,
  }
}

export default defineConfig(config)
