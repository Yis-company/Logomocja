import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { permalinkFor } from '../state/permalink';
import { mode, source } from '../state/studio';
import { dialog, shareOpen, shortcutsOpen, toast } from '../state/ui';
import { Icon } from './icons';
import { EXTRA_SHORTCUTS, SHORTCUTS } from './shortcuts';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ComponentChildren;
  wide?: boolean;
}

/** A native modal <dialog>: traps focus, closes on Escape, restores focus afterwards. */
export function Modal({ title, onClose, children, wide }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    const opener = document.activeElement as HTMLElement | null;
    if (!d.open) d.showModal();
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    d.addEventListener('cancel', onCancel);
    return () => {
      d.removeEventListener('cancel', onCancel);
      if (d.open) d.close();
      opener?.focus?.();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      class={`modal${wide ? ' modal-wide' : ''}`}
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div class="modal-body">
        <header class="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button type="button" class="tool" onClick={onClose} aria-label="Zamknij">
            <Icon name="close" />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

function AskDialog() {
  const spec = dialog.value!;
  const [text, setText] = useState(spec.input?.value ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    // Focus the text field, or else the main action (not the close button).
    const id = window.setTimeout(() => {
      if (inputRef.current) inputRef.current.select();
      else primaryRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  const primary = spec.buttons.find((b) => b.primary) ?? spec.buttons[0];
  return (
    <Modal title={spec.title} onClose={() => spec.resolve(null)}>
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          spec.resolve(primary.value, text);
        }}
      >
        <p>{spec.body}</p>
        {spec.input && (
          <label class="field">
            <span>{spec.input.label}</span>
            <input ref={inputRef} type="text" value={text} maxLength={80} onInput={(e) => setText((e.currentTarget as HTMLInputElement).value)} />
          </label>
        )}
        <div class="modal-actions">
          {spec.buttons.map((b) => (
            <button
              key={b.value}
              type={b === primary ? 'submit' : 'button'}
              class={`btn${b.primary ? ' btn-primary' : ''}`}
              ref={b === primary ? primaryRef : undefined}
              onClick={b === primary ? undefined : () => spec.resolve(b.value, text)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </form>
    </Modal>
  );
}

export function ShortcutList() {
  return (
    <table class="keys">
      <caption class="sr-only">Skróty klawiszowe</caption>
      <thead>
        <tr>
          <th scope="col">Klawisze</th>
          <th scope="col">Działanie</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(SHORTCUTS).map((s) => (
          <tr key={s.label}>
            <td>
              <kbd>{s.label}</kbd>
            </td>
            <td>{s.description}</td>
          </tr>
        ))}
        {EXTRA_SHORTCUTS.map((s) => (
          <tr key={s.keys}>
            <td>
              <kbd>{s.keys}</kbd>
            </td>
            <td>{s.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ShareDialog() {
  const [link, setLink] = useState<string>('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    permalinkFor(source.peek(), mode.peek())
      .then((l) => {
        setLink(l);
        requestAnimationFrame(() => inputRef.current?.select());
      })
      .catch(() => setError('Nie udało się utworzyć linku.'));
  }, []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast('Skopiowano link do schowka.', { tone: 'success' });
      shareOpen.value = false;
    } catch {
      inputRef.current?.select();
      toast('Nie udało się skopiować — zaznacz link i skopiuj go ręcznie.', { tone: 'error' });
    }
  };
  return (
    <Modal title="Udostępnij program" onClose={() => (shareOpen.value = false)}>
      <p>
        Link zawiera cały program i tryb {mode.peek() === '2d' ? '2D' : '3D'}. Kto go otworzy, zobaczy ten program w edytorze i od razu jego rysunek.
      </p>
      {error ? (
        <p class="form-error">{error}</p>
      ) : (
        <label class="field">
          <span>Link do programu ({link.length.toLocaleString('pl-PL')} znaków)</span>
          <input ref={inputRef} type="text" readOnly value={link} onFocus={(e) => (e.currentTarget as HTMLInputElement).select()} />
        </label>
      )}
      {link.length > 8000 && <p class="form-note">Ten link jest bardzo długi — niektóre komunikatory mogą go uciąć.</p>}
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" onClick={copy} disabled={!link}>
          <Icon name="copy" /> <span>Kopiuj link</span>
        </button>
        <button type="button" class="btn" onClick={() => (shareOpen.value = false)}>
          Zamknij
        </button>
      </div>
    </Modal>
  );
}

export function DialogHost() {
  return (
    <>
      {dialog.value && <AskDialog key={dialog.value.title} />}
      {shortcutsOpen.value && (
        <Modal title="Skróty klawiszowe" onClose={() => (shortcutsOpen.value = false)} wide>
          <ShortcutList />
        </Modal>
      )}
      {shareOpen.value && <ShareDialog />}
    </>
  );
}
