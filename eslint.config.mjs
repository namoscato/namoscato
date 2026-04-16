import {defineConfig} from 'eslint/config';
import gts from 'gts';
import jest from 'eslint-plugin-jest';

export default defineConfig([
  {ignores: ['build']},
  gts,
  {
    files: ['test/**/*.ts'],
    ...jest.configs['flat/recommended'],
  },
]);
