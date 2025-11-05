import { useEffect, useRef, useState } from "react";
import nodatafound from "../images/nodatafound.jpeg";

export const LineChart = ({ data }) => {
  const chartRef = useRef(null);
  const [amount, setAmount] = useState([1]);
  const [months, setMonths] = useState([]);
  const total =
  (data?.pending || 0) + (data?.success || 0) + (data?.failed || 0);

  useEffect(() => {
    const fetchedAmount = data?.map((item) => item.total);
    const fetchedMonths = data?.map((item) => item.month_name);

    setAmount(fetchedAmount);
    setMonths(fetchedMonths);
  }, [data]);

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
          animations: { enabled: false },
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
            data: amount,
            color: "#1A56DB",
          },
        ],
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
  }, [data, amount, months]);

  return (
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 pb-2">
            {Array.isArray(amount)
              ? amount.reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0)
              : 0}
          </h5>
          <p className="text-base font-normal text-gray-500">
            Transactions this year
          </p>
        </div>
      </div>

      {/* <div ref={chartRef}></div> */}
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
      src={nodatafound}
      alt="No data found"
      style={{ width: "150px" }}
    />
    {/* <p style={{ color: "#777", marginTop: "10px" }}>No transactions yet</p> */}
  </div>
)}


    </div>
  );
};
