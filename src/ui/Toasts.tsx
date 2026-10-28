import { announcement, dismissToast, toasts } from '../state/ui';
import { Icon } from './icons';

export function Toasts() {
  return (
    <>
      <div class="toasts" role="region" aria-label="Powiadomienia">
        {toasts.value.map((t) => (
          <div key={t.id} class={`toast toast-${t.tone}`} role={t.tone === 'error' ? 'alert' : 'status'}>
            <span class="toast-text">{t.text}</span>
            {t.action && (
              <button
                type="button"
                class="btn btn-small"
                onClick={() => {
                  t.action!.run();
                  dismissToast(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
            <button type="button" class="tool tool-small" onClick={() => dismissToast(t.id)} aria-label="Zamknij powiadomienie">
              <Icon name="close" size={16} />
            </button>
          </div>
        ))}
      </div>
      <div class="sr-only" aria-live="polite" aria-atomic="true">
        {announcement.value}
      </div>
    </>
  );
}
