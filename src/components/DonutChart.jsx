import React, { useEffect, useRef } from "react";
// import nodatapie from "../images/pienodata.jpeg";


import nodatapie from "../images/placeholder.jpeg";
export const DonutChart = ({ data }) => {
  const chartRef = useRef(null);
const total =
  (data?.pending || 0) + (data?.success || 0) + (data?.failed || 0);

  useEffect(() => {
    if (chartRef.current && typeof ApexCharts !== "undefined") {
      const getChartOptions = () => ({
        series: [data?.pending, data?.success, data?.failed],
        colors: ["#FDBA8C", "#1C64F2", "#16BDCA"],
        chart: {
          height: 320,
          width: "100%",
          type: "donut",
          animations: {
            enabled: false,
          },
        },
        stroke: { colors: ["transparent"] },
        plotOptions: {
          pie: {
            donut: {
              size: "80%",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontFamily: "Inter, sans-serif",
                  offsetY: 20,
                },
                total: {
                  showAlways: true,
                  show: true,
                  label: "Transactions",
                  fontFamily: "Inter, sans-serif",
                  formatter: function (w) {
                    const sum = w.globals.seriesTotals.reduce(
                      (a, b) => a + b,
                      0
                    );
                    return sum;
                  },
                },
                value: {
                  show: true,
                  fontFamily: "Inter, sans-serif",
                  offsetY: -20,
                  formatter: (value) => value,
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

      return () => {
        chart.destroy();
      };
    }
  }, [data]);

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="mb-3">
        <h5 className="text-xl font-bold leading-none text-gray-900 pe-1">
          Transactions
        </h5>
      </div>

      {/* <div className="py-6" ref={chartRef}></div> */}


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
    <img
      src={nodatapie}
      alt="No data found"
      style={{ width: "250px" }}
    />
    {/* <p style={{ color: "#777", marginTop: "10px" }}>No transactions yet</p> */}
  </div>
)}
    </div>
  );
};
