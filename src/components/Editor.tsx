import { useRef } from "react";
import { Icon } from "./Icon";
export function Editor({
  source,
  onChange,
  activeLine,
}: {
  source: string;
  onChange: (value: string) => void;
  activeLine: number | null;
}) {
  const numbers = useRef<HTMLDivElement>(null);
  const count = source.split("\n").length;
  return (
    <section className="editor-panel" aria-labelledby="editor-title">
      <div className="panel-heading">
        <div className="panel-title">
          <Icon name="code" size={18} />
          <h2 id="editor-title">Twój program</h2>
        </div>
        <span className="file-label">rysunek.logo</span>
      </div>
      <div className="editor-body">
        <div ref={numbers} className="line-numbers" aria-hidden="true">
          {Array.from({ length: count }, (_, i) => i + 1).map((line) => (
            <div
              key={line}
              className={activeLine === line ? "active-line" : ""}
            >
              {line}
            </div>
          ))}
        </div>
        <textarea
          id="code-editor"
          aria-label="Kod programu Logo"
          maxLength={50_000}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          value={source}
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e) => {
            if (numbers.current)
              numbers.current.scrollTop = e.currentTarget.scrollTop;
          }}
        />
      </div>
      <div className="editor-footer">
        <span>
          <i /> Logo · UTF-8
        </span>
        <span>
          {count} {count === 1 ? "wiersz" : "wierszy"}
        </span>
      </div>
    </section>
  );
}
