import React, { useEffect, useRef } from "react";


export const DonutChart = ({ data }) => {
  const chartRef = useRef(null);

<<<<<<< HEAD
  // Convert values to numbers safely
  const pending = Number(data?.pending || 0);
  const success = Number(data?.success || 0);
  const failed = Number(data?.failed || 0);
  const total = pending + success + failed;

  useEffect(() => {
    // ❌ STOP if no data or invalid data
    if (!data || total <= 0) return;
    if (!chartRef.current || typeof ApexCharts === "undefined") return;

    const options = {
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
              name: { show: true, offsetY: 20 },
              total: {
                showAlways: true,
                show: true,
                label: "Transactions",
                formatter: () => total,
=======
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
                
>>>>>>> page-ui
              },
              value: { show: true, offsetY: -20 },
            },
          },
        },
      },
      labels: ["Pending", "Success", "Failed"],
      dataLabels: { enabled: false },
      legend: { position: "bottom" },
    };

    // eslint-disable-next-line no-undef
    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

<<<<<<< HEAD
    return () => chart.destroy();
  }, [data, total]);
=======
      return () => chart.destroy();
    }
  }, [pending, success, failed]);
>>>>>>> page-ui

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="mb-3">
        <h5 className="text-xl font-bold leading-none text-gray-900 pe-1">
          Transactions
        </h5>
      </div>
<<<<<<< HEAD

      {total > 0 ? (
        <div className="py-6" ref={chartRef}></div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "320px",
            flexDirection: "column",
          }}
        >
          <img src={nodatapie} alt="No data" style={{ width: "250px" }} />
        </div>
      )}
=======
      {/* Always render chart even if 0 */}
      <div className="py-6" ref={chartRef}></div>
>>>>>>> page-ui
    </div>
  );
};

