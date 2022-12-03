import { ModelProvider } from 'kyoka';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import Model from './model';
import './style.css';

import App from './app';

const model = new Model();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ModelProvider model={model}>
    <App />
  </ModelProvider>
);