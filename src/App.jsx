import { useState } from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./context/useAuth.js";
import { Navbar } from "./components/Navbar.jsx";
import { LoginForm } from "./components/LoginForm.jsx";
import { MatrixInput } from "./components/MatrixInput.jsx";
import { MatrixDisplay } from "./components/MatrixDisplay.jsx";
import { StatsPanel } from "./components/StatsPanel.jsx";
import { processMatrixApi } from "./api/client.js";

function Studio() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleProcess = async (matrix) => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await processMatrixApi(matrix);
      setResults(data);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Error al procesar la matriz";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 mt-20">
      {/* Encabezado del Studio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/60">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <span>Factorización QR & Estadísticas</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Rotación 90° y descomposición QR
          </p>
        </div>
      </div>

      {/* Alerta de error si falla la llamada */}
      {apiError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
          <span className="text-sm">⚠️</span>
          <div>
            <strong className="font-semibold block mb-0.5">
              Error en el procesamiento:
            </strong>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Entrada y configuración de matriz */}
      <MatrixInput onProcess={handleProcess} loading={loading} />

      {/* Panel de Estadísticas requeridas */}
      {results && <StatsPanel stats={results.stats} />}

      {/* Visualización de Matrices (Original, Rotada, Q, R) */}
      {results && <MatrixDisplay results={results} />}
    </main>
  );
}

function MainContent() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      {isAuthenticated ? <Studio /> : <LoginForm />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
