import React, { useMemo, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from "chart.js";
import useUser from "@/hooks/useUser";
import DateRangePicker from "./components/DateRangePicker";
import PaymentStatsChart from "./components/PaymentStatsChart";
import {
  usePaymentStatsByType,
  usePaymentStatsByOrigin,
  usePaymentStatsByDate,
  usePaymentStatsByDateRange,
  usePaymentStatsSumByType,
  usePaymentStatsByMonth,
  usePaymentStatsByYear,
} from "./hooks/usePaymentStats";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  Title
);

export default function Account() {
  const { user } = useUser();

  // Date range state
  const [dateRange, setDateRange] = useState(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30); // Last 30 days by default
    return {
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
    };
  });

  // Fetch all payment statistics
  const { data: statsByType, isLoading: loadingByType } =
    usePaymentStatsByType(dateRange);
  const { data: statsByOrigin, isLoading: loadingByOrigin } =
    usePaymentStatsByOrigin(dateRange);
  const { data: statsByDate, isLoading: loadingByDate } =
    usePaymentStatsByDate();
  const { data: statsByDateRange, isLoading: loadingByDateRange } =
    usePaymentStatsByDateRange(dateRange);
  const { data: statsSumByType, isLoading: loadingSumByType } =
    usePaymentStatsSumByType(dateRange);
  const { data: statsByMonth, isLoading: loadingByMonth } =
    usePaymentStatsByMonth(dateRange);
  const { data: statsByYear, isLoading: loadingByYear } =
    usePaymentStatsByYear(dateRange);

  // Chart data configurations
  const chartByTypeData = useMemo(() => {
    if (!statsByType || statsByType.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Total",
            data: [],
            backgroundColor: "rgba(37, 99, 235, 0.7)",
          },
        ],
      };
    }

    return {
      labels: statsByType.map((s) => s.type || "Sin tipo"),
      datasets: [
        {
          label: "Total",
          data: statsByType.map((s) => s.total || 0),
          backgroundColor: "rgba(37, 99, 235, 0.7)",
          borderColor: "#2563eb",
          borderWidth: 1,
        },
        {
          label: "Cantidad",
          data: statsByType.map((s) => s.count || 0),
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "#10b981",
          borderWidth: 1,
        },
      ],
    };
  }, [statsByType]);

  const chartByOriginData = useMemo(() => {
    if (!statsByOrigin || statsByOrigin.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Total",
            data: [],
            backgroundColor: "rgba(139, 92, 246, 0.7)",
          },
        ],
      };
    }

    return {
      labels: statsByOrigin.map((s) => s.origin || "Sin origen"),
      datasets: [
        {
          label: "Total",
          data: statsByOrigin.map((s) => s.total || 0),
          backgroundColor: "rgba(139, 92, 246, 0.7)",
          borderColor: "#8b5cf6",
          borderWidth: 1,
        },
        {
          label: "Cantidad",
          data: statsByOrigin.map((s) => s.count || 0),
          backgroundColor: "rgba(236, 72, 153, 0.7)",
          borderColor: "#ec4899",
          borderWidth: 1,
        },
      ],
    };
  }, [statsByOrigin]);

  const chartByDateData = useMemo(() => {
    if (!statsByDate || statsByDate.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Total",
            data: [],
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.15)",
          },
        ],
      };
    }

    return {
      labels: statsByDate.map((s) =>
        new Date(s.date).toLocaleDateString("es-ES", {
          month: "short",
          day: "numeric",
        })
      ),
      datasets: [
        {
          label: "Total",
          data: statsByDate.map((s) => s.total || 0),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.15)",
          tension: 0.35,
          fill: true,
        },
      ],
    };
  }, [statsByDate]);

  const chartByDateRangeData = useMemo(() => {
    if (!statsByDateRange || statsByDateRange.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Total",
            data: [],
            backgroundColor: "rgba(245, 158, 11, 0.7)",
          },
        ],
      };
    }

    return {
      labels: statsByDateRange.map((s) =>
        new Date(s.date).toLocaleDateString("es-ES", {
          month: "short",
          day: "numeric",
        })
      ),
      datasets: [
        {
          label: "Total",
          data: statsByDateRange.map((s) => s.total || 0),
          backgroundColor: "rgba(245, 158, 11, 0.7)",
          borderColor: "#f59e0b",
          borderWidth: 1,
        },
      ],
    };
  }, [statsByDateRange]);

  const chartSumByTypeData = useMemo(() => {
    if (!statsSumByType || statsSumByType.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };
    }

    const colors = [
      "#60a5fa",
      "#8b5cf6",
      "#f87272",
      "#34d399",
      "#fbbf24",
      "#fb923c",
    ];

    return {
      labels: statsSumByType.map((s) => s.type || "Sin tipo"),
      datasets: [
        {
          data: statsSumByType.map((s) => s.sum || 0),
          backgroundColor: statsSumByType.map(
            (_, i) => colors[i % colors.length]
          ),
          borderWidth: 0,
        },
      ],
    };
  }, [statsSumByType]);

  const chartByMonthData = useMemo(() => {
    if (!statsByMonth || statsByMonth.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Total",
            data: [],
            backgroundColor: "rgba(16, 185, 129, 0.7)",
          },
        ],
      };
    }

    return {
      labels: statsByMonth.map((s) => {
        const [year, month] = s.month.split("-");
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
          "es-ES",
          { month: "short", year: "numeric" }
        );
      }),
      datasets: [
        {
          label: "Total",
          data: statsByMonth.map((s) => s.total || 0),
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "#10b981",
          borderWidth: 1,
        },
      ],
    };
  }, [statsByMonth]);

  const chartByYearData = useMemo(() => {
    if (!statsByYear || statsByYear.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Total",
            data: [],
            backgroundColor: "rgba(239, 68, 68, 0.7)",
          },
        ],
      };
    }

    return {
      labels: statsByYear.map((s) => s.year),
      datasets: [
        {
          label: "Total",
          data: statsByYear.map((s) => s.total || 0),
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderColor: "#ef4444",
          borderWidth: 1,
        },
      ],
    };
  }, [statsByYear]);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-optimed-tiber/60 rounded-lg shadow-xl w-full h-full overflow-y-auto">
      {/* Header */}
      <header className="mt-4 bg-optimed-tiber px-4 sm:px-6 lg:px-8 py-3 grid grid-cols-2 items-center shadow-lg rounded-lg mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl text-white font-extrabold tracking-wide drop-shadow">
          Estadísticas de Pagos
        </h1>
        <div className="justify-self-end">
          <span className="hidden sm:inline font-semibold text-sm sm:text-base px-3 py-1 text-white rounded">
            {user?.name} {user?.lastName}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-6 grid gap-4 sm:gap-6 lg:gap-8">
        {/* Date Range Picker */}
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onFromChange={(from) => setDateRange((prev) => ({ ...prev, from }))}
          onToChange={(to) => setDateRange((prev) => ({ ...prev, to }))}
        />

        {/* Payment Stats by Date (no date range) */}
        <section>
          <PaymentStatsChart
            title="Estadísticas por Fecha"
            type="line"
            data={chartByDateData}
            loading={loadingByDate}
            error={
              !loadingByDate && (!statsByDate || statsByDate.length === 0)
                ? "No hay datos disponibles"
                : null
            }
          />
        </section>

        {/* Two column grid for charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <PaymentStatsChart
            title="Pagos por Tipo"
            type="bar"
            data={chartByTypeData}
            loading={loadingByType}
            error={
              !loadingByType && (!statsByType || statsByType.length === 0)
                ? "No hay datos disponibles"
                : null
            }
          />

          <PaymentStatsChart
            title="Pagos por Origen"
            type="bar"
            data={chartByOriginData}
            loading={loadingByOrigin}
            error={
              !loadingByOrigin && (!statsByOrigin || statsByOrigin.length === 0)
                ? "No hay datos disponibles"
                : null
            }
          />
        </section>

        {/* Date Range and Sum by Type */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <PaymentStatsChart
            title="Pagos por Rango de Fechas"
            type="bar"
            data={chartByDateRangeData}
            loading={loadingByDateRange}
            error={
              !loadingByDateRange &&
              (!statsByDateRange || statsByDateRange.length === 0)
                ? "No hay datos disponibles"
                : null
            }
          />

          <PaymentStatsChart
            title="Suma Total por Tipo"
            type="doughnut"
            data={chartSumByTypeData}
            loading={loadingSumByType}
            error={
              !loadingSumByType &&
              (!statsSumByType || statsSumByType.length === 0)
                ? "No hay datos disponibles"
                : null
            }
          />
        </section>

        {/* Monthly and Yearly Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <PaymentStatsChart
            title="Pagos por Mes"
            type="bar"
            data={chartByMonthData}
            loading={loadingByMonth}
            error={
              !loadingByMonth && (!statsByMonth || statsByMonth.length === 0)
                ? "No hay datos disponibles"
                : null
            }
          />

          <PaymentStatsChart
            title="Pagos por Año"
            type="bar"
            data={chartByYearData}
            loading={loadingByYear}
            error={
              !loadingByYear && (!statsByYear || statsByYear.length === 0)
                ? "No hay datos disponibles"
                : null
            }
          />
        </section>
      </main>
    </div>
  );
}
