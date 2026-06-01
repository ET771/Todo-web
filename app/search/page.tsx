"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Spinner } from "@/components/Spinner";
import { todoService } from "@/services/todoService";
import { Todo } from "@/types";

export default function SearchPage() {
  return (
    <AppShell>
      <Search />
    </AppShell>
  );
}

function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce 300ms: llama al backend cuando el usuario deja de escribir
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await todoService.search(query.trim());
        setResults(data);
        setSearched(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handlePress = (item: Todo) => {
    const listId = item.parentId ?? item.id;
    router.push(`/lists/${listId}`);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Buscar</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar listas y tareas..."
        className="mb-4 w-full rounded-xl bg-gray-100 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-[#005BBF]/30 md:max-w-xl"
      />

      {loading && (
        <div className="mt-6 flex justify-center">
          <Spinner />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="mt-10 flex flex-col items-center px-6 text-center">
          <p className="mb-3 text-4xl">--</p>
          <p className="text-gray-500">
            No se encontraron resultados para{" "}
            <span className="font-semibold">&quot;{query}&quot;</span>
          </p>
        </div>
      )}

      {!loading && !searched && (
        <div className="mt-10 flex flex-col items-center px-6 text-center">
          <p className="mb-3 text-4xl">...</p>
          <p className="text-gray-400">
            Escribe para buscar entre tus listas y tareas
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="mb-3 text-sm text-gray-500">
            {results.length} resultado{results.length !== 1 ? "s" : ""}
          </p>
          <div className="md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePress(item)}
              className="mb-3 w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-[#005BBF]"
            >
              <span
                className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  item.parentId
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {item.parentId ? "Tarea" : "Lista"}
              </span>
              <p className="font-semibold text-gray-900">{item.title}</p>
              {item.description ? (
                <p className="line-clamp-2 text-sm text-gray-500">
                  {item.description}
                </p>
              ) : null}
              {item.completed ? (
                <p className="mt-1 text-xs font-semibold text-green-700">
                  Completado
                </p>
              ) : null}
            </button>
          ))}
          </div>
        </>
      )}
    </div>
  );
}
