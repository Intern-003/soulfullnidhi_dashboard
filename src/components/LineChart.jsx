import React, { useEffect, useRef } from "react";

export const LineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (window.ApexCharts && chartRef.current) {
      const options = {
        chart: {
          height: "100%",
          maxWidth: "100%",
          type: "area",
          fontFamily: "Inter, sans-serif",
          dropShadow: { enabled: false },
          toolbar: { show: false },
        },
        tooltip: {
          enabled: true,
          x: { show: false },
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.55,
            opacityTo: 0,
            shade: "#1C64F2",
            gradientToColors: ["#1C64F2"],
          },
        },
        dataLabels: { enabled: false },
        stroke: { width: 6 },
        grid: {
          show: false,
          strokeDashArray: 4,
          padding: { left: 2, right: 2, top: 0 },
        },
        series: [
          {
            name: "Transactions",
            data: [6500, 6418, 6456, 6526, 6356, 6456, 6654, 6589, 6897, 6400, 6600, 6560],
            color: "#1A56DB",
          },
        ],
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec"
          ],
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: { show: false },
      };

      const chart = new window.ApexCharts(chartRef.current, options);
      chart.render();

      return () => chart.destroy();
    }
  }, []);

  return (
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 pb-2">
            32.4k
          </h5>
          <p className="text-base font-normal text-gray-500">Transactions this year</p>
        </div>
      </div>

      <div ref={chartRef}></div>
    </div>
  );
};