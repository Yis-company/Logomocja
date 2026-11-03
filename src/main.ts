import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/atkinson-hyperlegible-mono/latin-400.css';
import '@fontsource/atkinson-hyperlegible-mono/latin-ext-400.css';
import '@fontsource/atkinson-hyperlegible-mono/latin-700.css';
import '@fontsource/atkinson-hyperlegible-mono/latin-ext-700.css';
import './styles/main.css';
import { App } from './app/app';

const mount = document.getElementById('app')!;
const app = new App(mount);
window.logomocja = app.api(__APP_VERSION__);
void app.route();
