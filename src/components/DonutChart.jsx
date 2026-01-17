import React, { useEffect, useRef, useState } from "react";

export const DonutChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [mode, setMode] = useState("UPI");
  const [isAnimating, setIsAnimating] = useState(false);

  // ────────────────────────────────────────────────
  // Data handling – computed once per render
  // ────────────────────────────────────────────────
  const txData = data?.[mode] || {};
  const pending = Number(txData.initiated) || 0;
  const success = Number(txData.success)   || 0;
  const failed  = Number(txData.failed)    || 0;
  const total   = pending + success + failed;
  const isEmpty = total === 0;

  // Animation trigger when data or mode meaningfully changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [mode, data]);

  // ────────────────────────────────────────────────
  // Chart creation / update
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (!chartRef.current || typeof ApexCharts === "undefined") {
      console.warn("ApexCharts not loaded or ref missing");
      return;
    }

    const series = isEmpty ? [1] : [pending, success, failed];
    const labels = isEmpty ? ["No activity"] : ["Initiated", "Success", "Failed"];

    const options = {
      series,
      labels,
      chart: {
        height: 280,
        type: "donut",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
      },
      colors: isEmpty ? ["#e2e8f0"] : ["#3187afff", "#369c36", "#1a5b8a"],
      stroke: { show: true, width: 5, colors: ["#e9eeecff"] },
      plotOptions: {
        pie: {
          donut: {
            size: "74%",
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: isEmpty ? "—" : total.toLocaleString(),
                fontSize: isAnimating ? "22px" : "20px",
                fontWeight: 800,
                color: isEmpty ? "#94a3b8" : "#0f172a",
                offsetY: -4,
                formatter: () => (isEmpty ? "" : total.toLocaleString()),
              },
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "radial",
          gradientToColors: isEmpty ? ["#9ca3af"] : ["#0d35b9ff", "#3b82f6", "#14b8a6"],
          stops: [0, 0, 100],
        },
      },
      dataLabels: { enabled: false },
      legend: {
        position: "bottom",
        fontSize: "13px",
        fontWeight: 500,
        offsetY: 6,
        markers: { width: 12, height: 12, radius: 12 },
        itemMargin: { horizontal: 14, vertical: 6 },
      },
      tooltip: {
        enabled: !isEmpty,
        style: { fontSize: "12.5px" },
      },
    };

    if (!chartInstance.current) {
      // First render → create chart
      chartInstance.current = new ApexCharts(chartRef.current, options);
      chartInstance.current.render();
    } else {
      // Update existing chart → smooth transition
      chartInstance.current.updateOptions(options, true, true);
    }

    // Cleanup on unmount or before next effect run
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [mode, data]); // ← correct dependencies only

  // Prevent rapid mode spam (optional but improves UX)
  const changeMode = (newMode) => {
    if (newMode !== mode) {
      setMode(newMode);
    }
  };

  const accentColor = mode === "UPI" ? "#3187afff" : "#369c36";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        borderRadius: "20px",
        border: "1px solid rgba(226,232,240,0.9)",
        boxShadow: "0 16px 32px -10px rgba(0,0,0,0.07)",
        padding: "20px 20px 28px",
        position: "relative",
        overflow: "hidden",
        height: "100%",
        minHeight: "340px",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.4s ease",
      }}
    >
      {/* Glow background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 70% 30%, ${accentColor}12 0%, transparent 65%)`,
          opacity: isAnimating ? 0.6 : 0.12,
          transition: "opacity 1s ease",
          pointerEvents: "none",
        }}
      />

      {/* Header - more compact */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            // style={{
            //   width: "12px",
            //   height: "12px",
            //   borderRadius: "50%",
            //   background: accentColor,
            //   boxShadow: `0 0 12px ${accentColor}50`,
            //   animation: isAnimating ? "breathe 2s infinite ease-in-out" : "none",
            // }}
          />
          <div>
            <h5
              style={{
                fontSize: "1.35rem",
                fontWeight: "800",
                color: "#0f172a",
                margin: 0,
              }}
            >
              {mode === "UPI" ? "Pay-in" : "Pay-out"}
            </h5>
            <p
              style={{
                margin: "2px 0 0 22px",
                fontSize: "0.9rem",
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              Transactions
            </p>
          </div>
        </div>

        {/* Even smaller toggle */}
        <div
          style={{
            background: "#f1f5f9",
            borderRadius: "999px",
            padding: "3px",
            display: "inline-flex",
            boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <button
            onClick={() => changeMode("UPI")}
            style={{
              padding: "5px 16px",
              borderRadius: "999px",
              fontSize: "0.86rem",
              fontWeight: "600",
              color: mode === "UPI" ? "white" : "#475569",
              background: mode === "UPI" ? accentColor : "transparent",
              border: "none",
              cursor: "pointer",
              transition: "all 0.28s ease",
              boxShadow: mode === "UPI" ? "0 2px 8px rgba(49,135,175,0.3)" : "none",
              minWidth: "70px",
            }}
          >
            Pay-in
          </button>

          <button
            onClick={() => changeMode("payout")}
            style={{
              padding: "5px 16px",
              borderRadius: "999px",
              fontSize: "0.86rem",
              fontWeight: "600",
              color: mode !== "UPI" ? "white" : "#475569",
              background: mode !== "UPI" ? accentColor : "transparent",
              border: "none",
              cursor: "pointer",
              transition: "all 0.28s ease",
              boxShadow: mode !== "UPI" ? "0 2px 8px rgba(54,156,54,0.3)" : "none",
              minWidth: "70px",
            }}
          >
            Payout
          </button>
        </div>
      </div>

      {/* Chart area */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={chartRef}
          style={{
            width: "100%",
            maxWidth: "340px",
            height: "280px",
            transform: isAnimating ? "scale(0.98)" : "scale(1)",
            transition: "transform 0.8s ease-out",
          }}
        />

        {isEmpty && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              fontSize: "1.1rem",
              background: "rgba(248,250,252,0.88)",
              borderRadius: "14px",
              pointerEvents: "none",
            }}
          >
            <div style={{ fontSize: "2.8rem", marginBottom: "8px", opacity: 0.7 }}>📊</div>
            No data
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};