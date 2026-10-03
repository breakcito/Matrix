import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth.js";
import { checkApiHealth } from "../api/client.js";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    checkApiHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));

    const interval = setInterval(() => {
      checkApiHealth()
        .then(() => setApiOnline(true))
        .catch(() => setApiOnline(false));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm">
            QR
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
              Matrix Studio
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-medium">
                v2.0
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicador de estado del API (Nielsen #1) */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-400"
            title={apiOnline ? "API Go conectada" : "Verificando API..."}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                apiOnline === true
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  : apiOnline === false
                    ? "bg-rose-400"
                    : "bg-amber-400"
              }`}
            />
            <span className="text-[11px]">
              {apiOnline === true
                ? "API Activa"
                : apiOnline === false
                  ? "Sin conexión"
                  : "Conectando"}
            </span>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
                {user}
              </span>
              <button
                onClick={logout}
                type="button"
                className="text-xs px-2.5 py-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
                title="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
