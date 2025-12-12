import React, { useEffect, useRef, useState } from "react";

export const DonutChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [mode, setMode] = useState("UPI"); // default payin

  const getValues = () => {
    const transactionData = data?.[mode] || {};
    const pending = Number(transactionData.initiated) || 0;
    const success = Number(transactionData.success) || 0;
    const failed = Number(transactionData.failed) || 0;
    const total = pending + success + failed;

    return { pending, success, failed, total };
  };

  const { pending, success, failed, total } = getValues();

  const isEmpty = total === 0; // flag for no transactions

  useEffect(() => {
    if (!chartRef.current || typeof ApexCharts === "undefined") return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const seriesData = isEmpty ? [1] : [pending, success, failed]; // single slice if empty

    const options = {
      series: seriesData,
      labels: isEmpty ? ["No Transactions"] : ["Initiated", "Success", "Failed"],
      chart: { height: 260, type: "donut" },
      colors: isEmpty
        ? ["#d1d5db"] // single gray color for empty chart
        : ["#2194f1ff", "#369c36", "#2134dfff"],
      stroke: { colors: ["transparent"] },
      plotOptions: {
        pie: {
          donut: {
            size: "80%",
            labels: {
              show: true,
              name: { show: true, offsetY: 20 },
              value: { show: true, offsetY: -20 },
              total: {
                showAlways: true,
                show: true,
                label: isEmpty ? "No Transactions" : "Transactions",
                formatter: () => (isEmpty ? 0 : total),
              },
            },
          },
        },
      },
      dataLabels: { enabled: false },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "radial",
          gradientToColors: isEmpty ? ["#9ca3af"] : ["#ecbb19ff", "#3b82f6", "#14b8a6"],
          stops: [0, 70, 100],
        },
      },
      legend: { position: "bottom", fontSize: "14px" },
      tooltip: { enabled: !isEmpty },
    };

    // eslint-disable-next-line no-undef
    chartInstance.current = new ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => chartInstance.current?.destroy();
  }, [mode, pending, success, failed, total, isEmpty]);

  return (
    <div className="w-full bg-[#e8eaed] rounded-lg  p-4 md:p-6">
      <div className="flex justify-between mb-3 h-20 ">
        <h5 className="text-xl font-bold text-gray-900 pt-4 ">Transactions</h5>
        <div className="flex">
          <button
            className="px-3 rounded-lg font-bold text-[#062f70ff]"
            onClick={() => setMode(mode === "UPI" ? "payout" : "UPI")}
          >
            {mode === "UPI" ? "Payin" : "Payout"}
          </button>
        </div>
      </div>
      <div className="py-8" ref={chartRef}></div>
    </div>
  );
};
