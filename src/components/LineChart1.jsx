import { useEffect, useRef, useMemo, useState } from "react";

export const LineChart1 = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [showPayin, setShowPayin] = useState(true);
  const [showPayout, setShowPayout] = useState(true);

  // ================= MONTH CONSTANTS =================
  const DEFAULT_MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const MONTH_MAP = {
    January: "Jan", February: "Feb", March: "Mar", April: "Apr",
    May: "May", June: "Jun", July: "Jul", August: "Aug",
    September: "Sep", October: "Oct", November: "Nov", December: "Dec",
  };

  // ================= FORMAT API DATA =================
  const chartData = useMemo(() => {
    const map = {};

    if (Array.isArray(data)) {
      data.forEach((item) => {
        const monthFull = item.month_name?.split(" ")[0];
        const month = MONTH_MAP[monthFull] || "Jan";

        map[month] = {
          payinAmount: Number(item.payin_amount) || 0,
          payinCount: Number(item.payin_count) || 0,
          payoutAmount: Number(item.payout_amount) || 0,
          payoutCount: Number(item.payout_count) || 0,
        };
      });
    }

    return DEFAULT_MONTHS.map((month) => ({
      month_name: month,
      payinAmount: map[month]?.payinAmount || 0,
      payinCount: map[month]?.payinCount || 0,
      payoutAmount: map[month]?.payoutAmount || 0,
      payoutCount: map[month]?.payoutCount || 0,
    }));
  }, [data]);

  const months = chartData.map((i) => i.month_name);

  // ================= FORMATTERS =================
  const formatShortIndian = (num) => {
    if (num == null || num === 0) return "0";
    const abs = Math.abs(num);

    let value, unit;
    if (abs >= 10000000) {        // ≥ 1 Cr
      value = abs / 10000000;
      unit = "Cr";
    } else if (abs >= 100000) {   // ≥ 1 Lakh
      value = abs / 100000;
      unit = "L";
    } else if (abs >= 1000) {
      value = abs / 1000;
      unit = "K";
    } else {
      value = abs;
      unit = "";
    }

    // 1 decimal if small, else round to whole
    const formatted = value < 10 ? value.toFixed(1) : Math.round(value).toString();

    return (num < 0 ? "-" : "") + formatted + unit;
  };

  const formatFullIndian = (num) =>
    Number(num).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: num % 1 !== 0 ? 2 : 0,
    });

  // ================= DYNAMIC Y-MAX (only visible series) =================
  const yAxisMax = useMemo(() => {
    let values = [];
    if (showPayin) values.push(...chartData.map((i) => i.payinAmount));
    if (showPayout) values.push(...chartData.map((i) => i.payoutAmount));

    const max = Math.max(...values, 0);
    return max > 0 ? max * 1.12 : 10; // slight headroom
  }, [chartData, showPayin, showPayout]);

  // ================= SERIES =================
  const series = useMemo(() => {
    const s = [];
    if (showPayin) {
      s.push({ name: "Payin", data: chartData.map((i) => i.payinAmount) });
    }
    if (showPayout) {
      s.push({ name: "Payout", data: chartData.map((i) => i.payoutAmount) });
    }
    // Prevent empty chart crash / ugly look
    if (s.length === 0) {
      s.push({ name: "No selection", data: Array(12).fill(0) });
    }
    return s;
  }, [showPayin, showPayout, chartData]);

  // ================= CHART =================
  useEffect(() => {
    if (!window.ApexCharts || !chartRef.current) return;

    chartInstance.current?.destroy();

    const options = {
      chart: {
        type: "area",
        height: 320,
        toolbar: { show: false },
        fontFamily: "Inter, sans-serif",
      },

      series,

      colors: ["#2563EB", "#22C55E"].slice(0, series.length),

      stroke: { curve: "smooth", width: 3 },

      dataLabels: { enabled: false },

      xaxis: {
        categories: months,
        axisBorder: { show: true },
        axisTicks: { show: true },
      },

      yaxis: {
        min: 0,
        max: yAxisMax,
        tickAmount: 5,
        forceNiceScale: true,
        labels: {
          formatter: formatShortIndian,
          style: { fontSize: "12px" },
        },
        title: {
          text: "Amount (₹)",
          offsetX: 5,
          style: { fontSize: "13px", fontWeight: 500 },
        },
      },

      legend: { show: false },

      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.4,
          gradientToColors: ["#60A5FA", "#86EFAC"].slice(0, series.length),
          opacityFrom: 0.65,
          opacityTo: 0.15,
          stops: [0, 90, 100],
        },
      },

      tooltip: {
        shared: showPayin && showPayout,
        followCursor: true,
        intersect: false,
        y: {
          formatter: (_, { dataPointIndex }) => {
            const point = chartData[dataPointIndex];
            if (!point) return "";

            const lines = [];

            if (showPayin) {
              lines.push(
                `Payin: ₹${formatFullIndian(point.payinAmount)} (${point.payinCount})`
              );
            }
            if (showPayout) {
              lines.push(
                `Payout: ₹${formatFullIndian(point.payoutAmount)} (${point.payoutCount})`
              );
            }

            return lines.join("<br>");
          },
        },
      },

      noData: {
        text: "No data available",
        align: "center",
        verticalAlign: "middle",
        style: { fontSize: "14px", color: "#94a3b8" },
      },
    };

    chartInstance.current = new window.ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => chartInstance.current?.destroy();
  }, [series, months, chartData, yAxisMax, showPayin, showPayout]);

  return (
    <div className="w-full rounded-lg md:p-6 bg-white shadow-sm">
      <p className="text-xl font-bold text-gray-700 mb-4">
        Monthly Success Volume (Payin + Payout)
      </p>

      <div ref={chartRef} />

      <div className="flex justify-center gap-10 mt-5 text-sm font-medium text-gray-700">
        <label className="flex items-center gap-2.5 cursor-pointer hover:text-blue-600 transition">
          <input
            type="checkbox"
            checked={showPayin}
            onChange={() => setShowPayin((p) => !p)}
            className="w-4 h-4 accent-blue-600"
          />
          Payin
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer hover:text-green-600 transition">
          <input
            type="checkbox"
            checked={showPayout}
            onChange={() => setShowPayout((p) => !p)}
            className="w-4 h-4 accent-green-600"
          />
          Payout
        </label>
      </div>
    </div>
  );
};