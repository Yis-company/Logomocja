import { run } from './logo';
import './styles.css';

// Testing hook: available as soon as the module runs, independent of the UI.
const api: LogomocjaApi = Object.freeze({
  version: __APP_VERSION__,
  run: (source: string, mode: string) => run(source, mode),
});
Object.defineProperty(window, 'logomocja', { value: api, writable: false, configurable: false, enumerable: true });

import('./ui/app')
  .then(({ App }) => {
    new App();
  })
  .catch((e: unknown) => {
    console.error(e);
    const msg = document.getElementById('message');
    if (msg) {
      msg.innerHTML = `<div class="msg msg-error"><strong>Nie udało się uruchomić pracowni.</strong> ${
        e instanceof Error ? e.message : String(e)
      }</div>`;
    }
  });
