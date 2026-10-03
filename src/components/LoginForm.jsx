import { useState } from "react";
import { useAuth } from "../context/useAuth.js";

export function LoginForm() {
  const { login, loading, error, setError } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("matrix2026");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }
    await login(username.trim(), password);
  };

  const fillDemo = () => {
    setUsername("admin");
    setPassword("matrix2026");
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 ">
      <div className="w-full max-w-sm">
        {/* Card minimalista */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold mb-3">
              M
            </div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Iniciar Sesión
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Accede al motor de factorización QR y estadísticas
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                disabled={loading}
                className="w-full px-3 py-2 text-sm bg-zinc-950/80 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-3 py-2 text-sm bg-zinc-950/80 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Ingresar al Studio</span>
              )}
            </button>
          </form>

          {/* Quick Demo Helper (Nielsen #7: Flexibilidad y eficiencia) */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
            <p className="text-[11px] text-zinc-500 mb-2 font-mono">
              Credenciales de prueba: admin / matrix2026
            </p>
            <button
              type="button"
              onClick={fillDemo}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 transition-colors"
            >
              Rellenar credenciales demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
