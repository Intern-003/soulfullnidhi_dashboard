import React, { useEffect, useRef } from "react";



export const DonutChart = ({ data }) => {
  const chartRef = useRef(null);

  // Ensure fallback 0 values
  const pending = data?.pending || 0;
  const success = data?.success || 0;
  const failed = data?.failed || 0;

  useEffect(() => {
    if (chartRef.current && typeof ApexCharts !== "undefined") {
      const getChartOptions = () => ({
        series: [pending, success, failed],
        colors: ["#FDBA8C", "#1C64F2", "#16BDCA"],
        chart: {
          height: 320,
          width: "100%",
          type: "donut",
          animations: { enabled: false },
        },
        stroke: { colors: ["transparent"] },
        plotOptions: {
          pie: {
            donut: {
              size: "80%",
              labels: {
                show: true,
                name: { show: true, fontFamily: "Inter, sans-serif", offsetY: 20 },
                value: {
                  show: true,
                  fontFamily: "Inter, sans-serif",
                  offsetY: -20,
                  formatter: (val) => val,
                },
                total: {
                  showAlways: true,
                  show: true,
                  label: "Transactions",
                  fontFamily: "Inter, sans-serif",
                  formatter: function (w) {
                    return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  },
                },
                
              },
            },
          },
        },
        grid: { padding: { top: -2 } },
        labels: ["Pending", "Success", "Failed"],
        dataLabels: { enabled: false },
        legend: { position: "bottom", fontFamily: "Inter, sans-serif" },
      });

      const chart = new ApexCharts(chartRef.current, getChartOptions());
      chart.render();

      return () => chart.destroy();
    }
  }, [pending, success, failed]);

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="mb-3">
        <h5 className="text-xl font-bold leading-none text-gray-900 pe-1">
          Transactions
        </h5>
      </div>
      {/* Always render chart even if 0 */}
      <div className="py-6" ref={chartRef}></div>
    </div>
  );
};

