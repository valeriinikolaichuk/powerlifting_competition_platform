import { defineConfig } from 'vitest/config';
import { join } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      // Примусово змушуємо абсолютно весь проєкт (включаючи папку shared) 
      // використовувати лише один фізичний екземпляр Angular та RxJS з папки frontend
      '@angular/core': join(__dirname, 'node_modules/@angular/core'),
      '@angular/common': join(__dirname, 'node_modules/@angular/common'),
      'rxjs': join(__dirname, 'node_modules/rxjs'),
      'tslib': join(__dirname, 'node_modules/tslib')
    }
  }
});