"use client";

import { useState, useEffect, useRef } from "react";

type Status = "idle" | "active" | "paused" | "done";

type Livrable = {
  id: number;
  text: string;
  status: Status;
  elapsed: number; // secondes
};

function formatTime(seconds: number) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function Home() {
  const [livrables, setLivrables] = useState<Livrable[]>([]);
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAX = 3;

  // Timer : incrémente elapsed du livrable actif
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const hasActive = livrables.some((l) => l.status === "active");
    if (!hasActive) return;
    intervalRef.current = setInterval(() => {
      setLivrables((prev) =>
        prev.map((l) =>
          l.status === "active" ? { ...l, elapsed: l.elapsed + 1 } : l
        )
      );
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [livrables.map((l) => l.status).join(",")]);

  function update(id: number, patch: Partial<Livrable>) {
    setLivrables((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input.trim()) {
      setLivrables((prev) => [
        ...prev,
        { id: nextId, text: input.trim(), status: "idle", elapsed: 0 },
      ]);
      setNextId((n) => n + 1);
      setInput("");
      setAdding(false);
    }
    if (e.key === "Escape") {
      setInput("");
      setAdding(false);
    }
  }

  function remove(id: number) {
    setLivrables((prev) => prev.filter((l) => l.id !== id));
  }

  // Tri : active/paused en haut, idle au milieu, done en bas
  const order: Record<Status, number> = { active: 0, paused: 1, idle: 2, done: 3 };
  const sorted = [...livrables].sort((a, b) => order[a.status] - order[b.status]);

  const idleOrActiveCount = livrables.filter((l) => l.status !== "done").length;
  const hasActive = livrables.some((l) => l.status === "active");

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center px-6 py-16">
      <h1 className="text-2xl font-semibold mb-8">Mes livrables du jour</h1>

      <div className="w-full max-w-md border border-gray-200 rounded-lg mb-6 overflow-hidden">
        {livrables.length === 0 && !adding ? (
          <div className="p-12 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Aucun livrable ajouté</p>
          </div>
        ) : (
          <ul>
            {sorted.map((livrable) => {
              const isActive = livrable.status === "active";
              const isPaused = livrable.status === "paused";
              const isDone = livrable.status === "done";

              return (
                <li
                  key={livrable.id}
                  className={[
                    "px-5 py-3 text-sm border-b border-gray-100 last:border-b-0 flex items-center justify-between gap-3",
                    isPaused ? "bg-yellow-50" : "",
                  ].join(" ")}
                >
                  {/* Texte */}
                  <span className={isDone ? "line-through text-gray-400 flex-1" : "flex-1"}>
                    {livrable.text}
                  </span>

                  {/* Timer */}
                  {(isActive || isPaused) && (
                    <span className="font-mono text-xs text-gray-500 shrink-0">
                      {formatTime(livrable.elapsed)}
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {livrable.status === "idle" && (
                      <>
                        {!hasActive && (
                          <button
                            onClick={() => update(livrable.id, { status: "active" })}
                            className="text-xs border border-black px-2 py-1 rounded hover:bg-black hover:text-white transition-colors"
                          >
                            Commencer
                          </button>
                        )}
                        <button
                          onClick={() => remove(livrable.id)}
                          className="text-gray-300 hover:text-black transition-colors"
                        >
                          ×
                        </button>
                      </>
                    )}

                    {isActive && (
                      <>
                        <button
                          onClick={() => update(livrable.id, { status: "paused" })}
                          className="text-xs border border-yellow-400 text-yellow-600 px-2 py-1 rounded hover:bg-yellow-400 hover:text-white transition-colors"
                        >
                          Pause
                        </button>
                        <button
                          onClick={() => update(livrable.id, { status: "done" })}
                          className="text-xs border border-gray-300 text-gray-500 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                        >
                          Terminer
                        </button>
                      </>
                    )}

                    {isPaused && (
                      <>
                        <button
                          onClick={() => update(livrable.id, { status: "active" })}
                          className="text-xs border border-black px-2 py-1 rounded hover:bg-black hover:text-white transition-colors"
                        >
                          Reprendre
                        </button>
                        <button
                          onClick={() => update(livrable.id, { status: "done" })}
                          className="text-xs border border-gray-300 text-gray-500 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                        >
                          Terminer
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}

            {adding && (
              <li className="px-5 py-3 border-b border-gray-100 last:border-b-0">
                <input
                  autoFocus
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nom du livrable…"
                  className="w-full text-sm outline-none"
                />
              </li>
            )}
          </ul>
        )}
      </div>

      {idleOrActiveCount >= MAX ? (
        <p className="text-sm text-gray-400">Maximum 3 livrables atteint</p>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="border border-black text-black text-sm px-5 py-2 rounded-lg hover:bg-black hover:text-white transition-colors"
        >
          + Ajouter un livrable
        </button>
      )}
    </div>
  );
}
