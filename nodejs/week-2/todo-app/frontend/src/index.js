import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@shopify/polaris/build/esm/styles.css';
import { AppProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider i18n={en}>
    <App />
  </AppProvider>
);
