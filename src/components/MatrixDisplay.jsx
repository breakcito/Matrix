import { useState } from "react";

function formatCell(val) {
  if (val === null || val === undefined) return "—";
  if (val === 0 || Math.abs(val) < 1e-13) return "0";
  if (Math.abs(val) < 1e-4 || Math.abs(val) >= 1e5) {
    return val.toExponential(3);
  }
  return Number.isInteger(val) ? val.toString() : val.toFixed(4);
}

export function MatrixDisplay({ results }) {
  const [activeTab, setActiveTab] = useState("q"); // 'original', 'rotated', 'q', 'r'
  const [copied, setCopied] = useState(false);

  if (!results) return null;

  const matrices = {
    original: {
      name: "Matriz Original (A)",
      symbol: "A",
      matrix: results.original,
      desc: "Entrada provista por el usuario",
      tag: "Entrada",
    },
    rotated: {
      name: "Matriz Rotada 90° (Aᴿ)",
      symbol: "Aᴿ",
      matrix: results.rotated,
      desc: "Rotación en sentido horario realizada por la API en Go",
      tag: "Rotación",
    },
    q: {
      name: "Factor Ortogonal (Q)",
      symbol: "Q",
      matrix: results.q,
      desc: "Matriz ortogonal calculada mediante reflectores Householder (Qᵀ·Q = I)",
      tag: "Ortogonal",
    },
    r: {
      name: "Factor Triangular Superior (R)",
      symbol: "R",
      matrix: results.r,
      desc: "Matriz triangular superior con subdiagonal limpia a 0 (A = Q·R)",
      tag: "Triangular",
    },
  };

  const current = matrices[activeTab] || matrices.q;
  const m = current.matrix.length;
  const n = current.matrix[0]?.length || 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(current.matrix));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl">
      {/* Header con tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {Object.entries(matrices).map(([key, item]) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                <span className="font-mono font-bold text-[11px]">
                  {item.symbol}
                </span>
                <span>{item.tag}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-zinc-400">
          <span className="font-mono">
            Dimensión:{" "}
            <strong className="text-zinc-200">
              {m} × {n}
            </strong>
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 text-[11px] font-mono transition-colors flex items-center gap-1.5"
            title="Copiar JSON de la matriz actual"
          >
            {copied ? (
              <>
                <span className="text-emerald-400">✓</span>
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Copiar JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info de la matriz activa */}
      <div className="py-3 flex items-center justify-between text-xs text-zinc-400">
        <span className="text-zinc-200 font-medium">{current.name}</span>
        <span className="text-[11px] text-zinc-500 hidden sm:inline">
          {current.desc}
        </span>
      </div>

      {/* Grid visor de matriz con estilo monospace y espaciado matemático */}
      <div className="overflow-x-auto p-4 bg-zinc-950/80 border border-zinc-800/90 rounded-xl mt-1 max-h-96">
        <table className="border-collapse mx-auto">
          <tbody>
            {current.matrix.map((row, i) => (
              <tr key={i} className="hover:bg-zinc-900/40 transition-colors">
                <td className="text-[10px] font-mono text-zinc-600 pr-2 select-none text-right">
                  {i}
                </td>
                {row.map((val, j) => {
                  const isZero = val === 0 || Math.abs(val) < 1e-13;
                  const isNegative = val < 0 && !isZero;
                  return (
                    <td
                      key={j}
                      className={`px-3 py-2 text-xs font-mono text-center border border-zinc-800/40 rounded-sm transition-colors ${
                        isZero
                          ? "text-zinc-600 font-light"
                          : isNegative
                            ? "text-rose-300 font-medium"
                            : "text-zinc-200 font-medium"
                      }`}
                      title={`[${i}][${j}] = ${val}`}
                    >
                      {formatCell(val)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
