import { useState } from "react";
import { ExampleArt } from "../components/ExampleArt";
import { Icon } from "../components/Icon";
import { Frame, FramePanel } from "../components/reui/frame";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { examples, type Example } from "../examples";
export function Examples({
  onChoose,
}: {
  onChoose: (example: Example) => void;
}) {
  const [filter, setFilter] = useState("all");
  return (
    <>
      <div className="workspace-heading">
        <div>
          <h1 tabIndex={-1}>Przykłady</h1>
          <p>Wybierz pomysł i otwórz go w pracowni.</p>
        </div>
      </div>
      <Tabs value={filter} onValueChange={(value) => setFilter(String(value))}>
        <TabsList aria-label="Filtr przykładów" activateOnFocus={false}>
          <TabsTrigger value="all">Wszystkie</TabsTrigger>
          <TabsTrigger value="2d">2D</TabsTrigger>
          <TabsTrigger value="3d">3D</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="library-grid">
        {examples
          .filter((e) => filter === "all" || e.mode === filter)
          .map((example) => (
            <Frame key={example.id} spacing="sm">
              <FramePanel>
                <div className={`library-art art-${example.id}`}>
                  <ExampleArt example={example} />
                </div>
                <div className="library-body">
                  <span className="task-meta">
                    {example.mode.toUpperCase()} · {example.level}
                  </span>
                  <h2>{example.name}</h2>
                  <p>{example.description}</p>
                  <details>
                    <summary>Zobacz kod</summary>
                    <pre>{example.source}</pre>
                  </details>
                  <button
                    type="button"
                    className="library-open"
                    onClick={() => onChoose(example)}
                  >
                    Otwórz w pracowni <Icon name="arrow" size={16} />
                  </button>
                </div>
              </FramePanel>
            </Frame>
          ))}
      </div>
    </>
  );
}
