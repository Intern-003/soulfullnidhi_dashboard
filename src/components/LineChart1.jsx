import { useEffect, useRef, useMemo } from "react";

export const LineChart1 = ({ data }) => {
  const chartRef = useRef(null);

    useEffect(() => {
        // console.log("👉 Raw API data received in LineChart:", data);
    }, [data]);

 // Default 12 months
const DEFAULT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Map full month names to short names
const MONTH_MAP = {
  January: "Jan", February: "Feb", March: "Mar", April: "Apr",
  May: "May", June: "Jun", July: "Jul", August: "Aug",
  September: "Sep", October: "Oct", November: "Nov", December: "Dec"
};

const chartData = useMemo(() => {
  const dataMap = {};

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((item) => {
      // Remove year from month_name, e.g., "December 2025" → "December"
      const monthFull = item.month_name?.split(" ")[0];
      const month = MONTH_MAP[monthFull] || "Jan"; // normalize to short name

      dataMap[month] = {
        payinAmount: Number(item.payin_amount) || 0,
        // payinAmount:50000,
        payinCount: Number(item.payin_count) || 0,
        payoutAmount: Number(item.payout_amount) || 0,
        // payoutAmount:987654321,
        payoutCount: Number(item.payout_count) || 0,
      };
    });
  }

  // Merge API data with default months so all months appear
  return DEFAULT_MONTHS.map((month) => ({
    month_name: month,
    payinAmount: dataMap[month]?.payinAmount || 0,
    payinCount:dataMap[month]?.payinCount || 0,
    payoutAmount: dataMap[month]?.payoutAmount || 0,
    payoutCount: dataMap[month]?.payoutCount || 0,
    // payin: 1200,
    // payout: 90
  }));
}, [data]);

const months = chartData.map((i) => i.month_name);
const payin = chartData.map((i) => i.payinAmount);
const payout = chartData.map((i) => i.payoutAmount    );


  // Render ApexCharts
  useEffect(() => {
    if (window.ApexCharts && chartRef.current) {

      const options = {
        chart: {
          height: 300,
          type: "area",
          toolbar: { show: false },
          fontFamily: "Inter, sans-serif",
        },
        series: [
          { name: "Payin", data: payin },
          { name: "Payout", data: payout },
        ],
        stroke: { curve: "smooth", width: 4 },
        dataLabels: { enabled: false },
        xaxis: { categories: months },
        yaxis: { show: true },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ["#34D399", "#0C7EDB"],
            opacityFrom: 0.6,
            opacityTo: 0.1,
            stops: [0, 100],
          },
        },
 tooltip: {
  enabled: true,
  shared: false, // set to false so each series shows individually
  y: {
    formatter: (val, { seriesIndex, dataPointIndex }) => {
      const point = chartData[dataPointIndex];
      if (seriesIndex === 0) {
        // Payin series
        return `Payin Amount: ${point.payinAmount}, Count: ${point.payinCount}`;
      } else {
        // Payout series
        return `Payout Amount: ${point.payoutAmount}, Count: ${point.payoutCount}`;
      }
    }
  }
}

      };

      const chart = new window.ApexCharts(chartRef.current, options);
      chart.render();

      return () => chart.destroy();
    }
  }, [payin, payout, months, chartData]);


  return (
    <div className=" w-full bg-[#e8eaed] rounded-lg  md:p-6 ">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">
            {/* {payin.reduce((a, b) => a + b, 0) + payout.reduce((a, b) => a + b, 0)} */}
          </h5>
          <p className="text-xl font-bold text-gray-500">Total success (Payin + Payout)</p>
        </div>
      </div>
      <div ref={chartRef} className="py-8"></div>
    </div>
  );
};
