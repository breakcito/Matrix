function formatStat(num) {
  if (num === null || num === undefined) return "—";
  if (num === 0) return "0";
  if (Math.abs(num) < 1e-4 || Math.abs(num) >= 1e6) {
    return num.toExponential(4);
  }
  return Number.isInteger(num) ? num.toString() : num.toFixed(4);
}

export function StatsPanel({ stats }) {
  if (!stats) return null;

  return (
    <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <span>Operaciones y Estadísticas</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cálculos agregados sobre las matrices rotada, Q y R
          </p>
        </div>

        {/* Indicador de Matriz Diagonal (Op 5) */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            stats.hasDiagonalMat
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400"
          }`}
          title="Verificación de si alguna de las matrices calculadas es diagonal"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              stats.hasDiagonalMat
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                : "bg-zinc-500"
            }`}
          />
          <span>
            {stats.hasDiagonalMat
              ? "Matriz Diagonal: Sí"
              : "Matriz Diagonal: No"}
          </span>
        </div>
      </div>

      {/* Grid de 4 tarjetas estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-3">
        {/* Valor Máximo */}
        <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700/80 transition-colors">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
            Valor Máximo
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span
              className="text-xl sm:text-2xl font-mono font-semibold text-zinc-100 tracking-tight"
              title={stats.maxValue?.toString()}
            >
              {formatStat(stats.maxValue)}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">max</span>
          </div>
        </div>

        {/* Valor Mínimo */}
        <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700/80 transition-colors">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
            Valor Mínimo
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span
              className="text-xl sm:text-2xl font-mono font-semibold text-zinc-100 tracking-tight"
              title={stats.minValue?.toString()}
            >
              {formatStat(stats.minValue)}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">min</span>
          </div>
        </div>

        {/* Promedio */}
        <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700/80 transition-colors">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
            Promedio
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span
              className="text-xl sm:text-2xl font-mono font-semibold text-zinc-100 tracking-tight"
              title={stats.average?.toString()}
            >
              {formatStat(stats.average)}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">avg</span>
          </div>
        </div>

        {/* Suma Total */}
        <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700/80 transition-colors">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
            Suma Total
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span
              className="text-xl sm:text-2xl font-mono font-semibold text-zinc-100 tracking-tight"
              title={stats.totalSum?.toString()}
            >
              {formatStat(stats.totalSum)}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">sum</span>
          </div>
        </div>
      </div>
    </section>
  );
}
