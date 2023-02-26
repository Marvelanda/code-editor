/// <reference types="react-scripts" />

import MonacoEditor from '@monaco-editor/react';

declare global {
  interface Window {
    monaco: typeof MonacoEditor;
  }
}
