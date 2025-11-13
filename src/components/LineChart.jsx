import { useEffect, useRef, useState } from "react";
import nodatafound from "../images/nodataLine.jpg";

export const LineChart = ({ data }) => {
  const chartRef = useRef(null);
  const [amount, setAmount] = useState([]);
  const [months, setMonths] = useState([]);

  const total = Array.isArray(data)
    ? data.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
    : 0;

  useEffect(() => {
    if (Array.isArray(data)) {
      setAmount(data.map((item) => Number(item.total)));
      setMonths(data.map((item) => item.month_name));
    }
  }, [data]);

  useEffect(() => {
    if (window.ApexCharts && chartRef.current && amount.length > 0) {
      const options = {
        chart: {
          type: "area",
          height: 300,
          toolbar: { show: false },
          zoom: { enabled: false },
          sparkline: { enabled: true },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 900,
          },
        },
        stroke: {
          curve: "smooth",
          width: 6,
          colors: ["#2563EB"], // main blue line
          lineCap: "round",
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            gradientToColors: ["#60A5FA"], // lighter blue
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 100],
          },
        },
        markers: {
          size: 0,
          hover: { size: 7 },
        },
        grid: { show: false },
        dataLabels: { enabled: false },
        tooltip: {
          theme: "light",
          y: { formatter: (val) => `₹${val}` },
          style: { fontSize: "14px", fontFamily: "Inter, sans-serif" },
        },
        series: [{ name: "Transactions", data: amount }],
        xaxis: {
          categories: months,
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
  }, [amount, months]);

  return (
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 pb-2">
            {total}
          </h5>
          <p className="text-base font-normal text-gray-500">
            Transactions this year
          </p>
        </div>
      </div>

      {total > 0 ? (
        <div className="py-4" ref={chartRef}></div>
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
            src={nodatafound}
            alt="No data found"
            style={{ width: "350px" }}
          />
        </div>
      )}
    </div>
  );
};
