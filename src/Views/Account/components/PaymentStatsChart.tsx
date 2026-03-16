import { Bar, Line, Doughnut } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

interface PaymentStatsChartProps {
  title: string;
  type: "bar" | "line" | "doughnut";
  data: ChartData<any>;
  options?: ChartOptions<any>;
  loading?: boolean;
  error?: string | null;
  height?: string;
}

export default function PaymentStatsChart({
  title,
  type,
  data,
  options,
  loading = false,
  error = null,
  height = "h-64 sm:h-72 lg:h-80",
}: PaymentStatsChartProps) {
  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === "doughnut",
        position: "bottom" as const,
        labels: { boxWidth: 12 },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    ...(type !== "doughnut" && {
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: "rgba(0,0,0,0.05)" },
          beginAtZero: true,
        },
      },
    }),
    ...options,
  };

  const renderChart = () => {
    switch (type) {
      case "bar":
        return <Bar data={data} options={defaultOptions} />;
      case "line":
        return <Line data={data} options={defaultOptions} />;
      case "doughnut":
        return (
          <Doughnut
            data={data}
            options={{ ...defaultOptions, cutout: "68%" }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-optimed-tiber mb-3 sm:mb-4">
        {title}
      </h3>

      {loading ? (
        <div className={`${height} flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-optimed-tiber mx-auto"></div>
            <p className="mt-3 text-sm text-gray-500">Cargando datos...</p>
          </div>
        </div>
      ) : error ? (
        <div className={`${height} flex items-center justify-center`}>
          <div className="text-center text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : (
        <div className={height}>{renderChart()}</div>
      )}
    </div>
  );
}
