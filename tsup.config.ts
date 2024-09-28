import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'kylin',
  entry: ['src/index.ts', 'src/index.js'],
  target: ['esnext'],
  format: ['iife'],
  outDir: 'dist',
  banner: {
    // Replace it with your extension's metadata
    js: `// Name: 
// ID: kylin
// Description: Tool to obfuscate your Scratch project.
// By: FurryR
// License: AGPL-3.0-only
`
  },
  platform: 'browser',
  clean: true
})
