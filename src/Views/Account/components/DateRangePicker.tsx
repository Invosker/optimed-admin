

interface DateRangePickerProps {
  from: string;
  to: string;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
  onQuickSelect?: (from: string, to: string) => void;
}

export default function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
  onQuickSelect,
}: DateRangePickerProps) {
  const handleQuickSelect = (days: number) => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - days);

    const toStr = toDate.toISOString().split("T")[0];
    const fromStr = fromDate.toISOString().split("T")[0];

    onFromChange(fromStr);
    onToChange(toStr);
    onQuickSelect?.(fromStr, toStr);
  };

  const handleThisYear = () => {
    const now = new Date();
    const fromStr = `${now.getFullYear()}-01-01`;
    const toStr = now.toISOString().split("T")[0];

    onFromChange(fromStr);
    onToChange(toStr);
    onQuickSelect?.(fromStr, toStr);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-semibold text-optimed-tiber mb-3">
        Filtrar por Rango de Fechas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
            Desde
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="w-full h-9 sm:h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-optimed-tiber/40"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
            Hasta
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="w-full h-9 sm:h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-optimed-tiber/40"
          />
        </div>
      </div>

      {/* Quick select buttons */}
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleQuickSelect(7)}
          className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          Últimos 7 días
        </button>
        <button
          onClick={() => handleQuickSelect(30)}
          className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          Últimos 30 días
        </button>
        <button
          onClick={() => handleQuickSelect(90)}
          className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          Últimos 3 meses
        </button>
        <button
          onClick={handleThisYear}
          className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          Este año
        </button>
      </div>
    </div>
  );
}
