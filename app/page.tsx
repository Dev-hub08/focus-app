"use client";

import { useState } from "react";

export default function Home() {
  const [livrables, setLivrables] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState("");

  const MAX = 3;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input.trim()) {
      setLivrables([...livrables, input.trim()]);
      setInput("");
      setAdding(false);
    }
    if (e.key === "Escape") {
      setInput("");
      setAdding(false);
    }
  }

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
            {livrables.map((livrable, i) => (
              <li key={i} className="px-5 py-3 text-sm border-b border-gray-100 last:border-b-0 flex items-center justify-between">
                <span>{livrable}</span>
                <button
                  onClick={() => setLivrables(livrables.filter((_, j) => j !== i))}
                  className="text-gray-300 hover:text-black transition-colors ml-4"
                >
                  ×
                </button>
              </li>
            ))}
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

      {livrables.length >= MAX ? (
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
