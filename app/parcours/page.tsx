"use client";

import { useState } from "react";

type Checkpoint = {
  id: number;
  label: string;
};

export default function Parcours() {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    { id: 1, label: "Départ" },
  ]);
  const [nextId, setNextId] = useState(2);

  function ajouter() {
    setCheckpoints((prev) => [
      ...prev,
      { id: nextId, label: `Étape ${nextId}` },
    ]);
    setNextId((n) => n + 1);
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center px-6 py-16">
      <h1 className="text-2xl font-semibold mb-8">Mon parcours</h1>

      <button
        onClick={ajouter}
        className="mb-10 border border-black text-black text-sm px-5 py-2 rounded-lg hover:bg-black hover:text-white transition-colors"
      >
        Ajouter
      </button>

      <div className="flex flex-row items-center overflow-x-auto pb-4">
        {checkpoints.map((cp, i) => (
          <div key={cp.id} className="flex flex-row items-center">
            {/* Cercle + label */}
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full border-2 border-black bg-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black" />
              </div>
              <span className="mt-1 text-sm text-gray-600 whitespace-nowrap">{cp.label}</span>
            </div>

            {/* Ligne vers le prochain cercle */}
            {i < checkpoints.length - 1 && (
              <div className="h-px w-12 bg-gray-300 mb-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
