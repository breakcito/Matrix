import { useState } from "react";

const PRESETS = [
  {
    name: "Identidad 3×3",
    matrix: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  },
  {
    name: "Rectangular 4×3",
    matrix: [
      [1, 2, 4],
      [3, 8, 14],
      [2, 6, 13],
      [1, 4, 10],
    ],
  },
  {
    name: "Clásica 2×2",
    matrix: [
      [1, 2],
      [3, 4],
    ],
  },
  {
    name: "Flotantes Diminutos (1e-15)",
    matrix: [
      [1e-15, 2],
      [0, 3],
    ],
  },
  {
    name: "Diagonal 3×3",
    matrix: [
      [5, 0, 0],
      [0, -2, 0],
      [0, 0, 7],
    ],
  },
];

export function MatrixInput({ onProcess, loading }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [grid, setGrid] = useState([
    [1, 2, 4],
    [3, 8, 14],
    [2, 6, 13],
  ]);
  const [mode, setMode] = useState("grid"); // 'grid' | 'raw'
  const [rawText, setRawText] = useState(
    JSON.stringify(
      [
        [1, 2, 4],
        [3, 8, 14],
        [2, 6, 13],
      ],
      null,
      2,
    ),
  );
  const [validationError, setValidationError] = useState(null);

  const applyDimensions = (newRows, newCols) => {
    const r = Math.max(1, Math.min(newRows, 50));
    const c = Math.max(1, Math.min(newCols, 50));
    setRows(r);
    setCols(c);

    const newGrid = [];
    for (let i = 0; i < r; i++) {
      const row = [];
      for (let j = 0; j < c; j++) {
        row.push(grid[i]?.[j] !== undefined ? grid[i][j] : 0);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setRawText(JSON.stringify(newGrid, null, 2));
    setValidationError(null);
  };

  const handleCellChange = (i, j, value) => {
    const newGrid = grid.map((r) => [...r]);
    const num = parseFloat(value);
    newGrid[i][j] = isNaN(num) ? value : num;
    setGrid(newGrid);
    setRawText(JSON.stringify(newGrid, null, 2));
    setValidationError(null);
  };

  const applyPreset = (presetMatrix) => {
    const r = presetMatrix.length;
    const c = presetMatrix[0].length;
    setRows(r);
    setCols(c);
    setGrid(presetMatrix);
    setRawText(JSON.stringify(presetMatrix, null, 2));
    setValidationError(null);
  };

  const generateRandom = () => {
    const newGrid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(Math.floor(Math.random() * 20) - 5);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setRawText(JSON.stringify(newGrid, null, 2));
    setValidationError(null);
  };

  const handleRawChange = (text) => {
    setRawText(text);
    setValidationError(null);
    try {
      const parsed = JSON.parse(text);
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        Array.isArray(parsed[0])
      ) {
        setRows(parsed.length);
        setCols(parsed[0].length);
        setGrid(parsed);
      }
    } catch {
      // Ignorar errores sintácticos mientras el usuario escribe en modo raw
    }
  };

  const handleClearToZeros = () => {
    const newGrid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(0);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setRawText(JSON.stringify(newGrid, null, 2));
    setValidationError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    let matrixToSubmit = grid;

    if (mode === "raw") {
      try {
        matrixToSubmit = JSON.parse(rawText);
      } catch (err) {
        setValidationError("JSON inválido: " + err.message);
        return;
      }
    }

    // Validación preliminar en cliente (Nielsen #5)
    if (!Array.isArray(matrixToSubmit) || matrixToSubmit.length === 0) {
      setValidationError("La matriz no puede estar vacía");
      return;
    }

    const c = matrixToSubmit[0]?.length || 0;
    if (c === 0) {
      setValidationError("Las filas de la matriz no pueden estar vacías");
      return;
    }

    for (let i = 0; i < matrixToSubmit.length; i++) {
      if (!Array.isArray(matrixToSubmit[i]) || matrixToSubmit[i].length !== c) {
        setValidationError(`La matriz no es rectangular en la fila ${i + 1}`);
        return;
      }
      for (let j = 0; j < c; j++) {
        const val = matrixToSubmit[i][j];
        if (typeof val !== "number" || isNaN(val) || !isFinite(val)) {
          setValidationError(
            `El valor en la posición [${i}][${j}] no es un número válido`,
          );
          return;
        }
      }
    }

    onProcess(matrixToSubmit);
  };

  return (
    <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl">
      {/* Controles de dimensión y presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <span>Editor de Matriz</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
              {rows} × {cols}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Ingresa los valores numéricos o selecciona un preset
          </p>
        </div>

        {/* Selectores de dimensiones */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">Filas (M):</span>
            <input
              type="number"
              min="1"
              max="50"
              value={rows}
              onChange={(e) =>
                applyDimensions(parseInt(e.target.value) || 1, cols)
              }
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-12 px-2 py-1 bg-zinc-950/80 border border-zinc-800 rounded text-center text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-zinc-600 font-mono">×</span>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">Cols (N):</span>
            <input
              type="number"
              min="1"
              max="50"
              value={cols}
              onChange={(e) =>
                applyDimensions(rows, parseInt(e.target.value) || 1)
              }
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-12 px-2 py-1 bg-zinc-950/80 border border-zinc-800 rounded text-center text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Toggle modo Grid vs Raw */}
          <div className="flex items-center bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800 text-xs ml-2">
            <button
              type="button"
              onClick={() => setMode("grid")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mode === "grid"
                  ? "bg-zinc-800 text-zinc-100 font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Celdas
            </button>
            <button
              type="button"
              onClick={() => setMode("raw")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mode === "raw"
                  ? "bg-zinc-800 text-zinc-100 font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Presets rápidos */}
      <div className="py-3 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-zinc-500 text-[11px] font-mono mr-1 select-none">
          Presets:
        </span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPreset(p.matrix)}
            className="px-2.5 py-1 rounded-md bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-300 text-[11px] font-mono transition-colors whitespace-nowrap"
          >
            {p.name}
          </button>
        ))}
        <button
          type="button"
          onClick={generateRandom}
          className="px-2.5 py-1 rounded-md bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 text-[11px] font-mono transition-colors whitespace-nowrap ml-auto"
        >
          🎲 Aleatoria
        </button>
      </div>

      {/* Alerta de validación */}
      {validationError && (
        <div className="my-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* Contenido del editor */}
      <form onSubmit={handleSubmit} className="mt-2">
        {mode === "grid" ? (
          <div className="overflow-x-auto p-4 bg-zinc-950/80 border border-zinc-800/90 rounded-xl max-h-80">
            <div className="inline-block min-w-full">
              <table className="border-collapse mx-auto">
                <tbody>
                  {grid.map((row, i) => (
                    <tr key={i}>
                      <td className="text-[10px] font-mono text-zinc-600 pr-2 select-none text-right">
                        {i}
                      </td>
                      {row.map((val, j) => (
                        <td key={j} className="p-1">
                          <input
                            type="text"
                            value={val}
                            onChange={(e) =>
                              handleCellChange(i, j, e.target.value)
                            }
                            placeholder="0"
                            className="w-16 sm:w-20 px-2 py-1.5 text-xs font-mono text-center bg-zinc-900 border border-zinc-800 rounded text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-3">
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => handleRawChange(e.target.value)}
              placeholder="[[1, 2], [3, 4]]"
              className="w-full bg-transparent text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none resize-y"
            />
          </div>
        )}

        {/* Acciones principales */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClearToZeros}
            className="text-xs px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors font-mono"
          >
            Limpiar a ceros
          </button>

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Calculando rotación y QR...</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>Calcular</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
