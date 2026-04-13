import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Compass 0.0.94 throws on unsupported className in dev mode.
// This plugin downgrades those throws to console.warn so the app doesn't crash.
function compassClassNamePatch() {
  return {
    name: 'compass-classname-patch',
    enforce: 'post',
    transform(code, id) {
      if (code.includes('received unsupported className') || code.includes('[Compass] <')) {
        return code
          .replaceAll('throw console.error(t),Error(t)', 'console.warn(t)')
          .replaceAll('throw Error(', 'void console.warn(');
      }
    },
  };
}

export default defineConfig({
  plugins: [compassClassNamePatch(), react()],
  resolve: {
    alias: {
      '@circleco/compass': path.resolve(
        __dirname,
        'node_modules/@circleco/compass'
      ),
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
