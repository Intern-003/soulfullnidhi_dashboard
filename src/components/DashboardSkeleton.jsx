import React, { useState } from "react";

const DashboardSkeleton = () => {
  const [role] = useState(atob(localStorage.getItem("role")) || "admin");

  return (
    <div className="flex min-h-screen bg-[#fffdf5]">
      <div className="flex-1 p-6 lg:p-10 animate-pulse">
        {/* ================= TOP KPI CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border shadow-sm p-6 bg-white"
              style={{ borderColor: "#D4AF37" }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 w-32 bg-[#f5e6a3] rounded" />
                <div className="h-6 w-6 bg-[#f5e6a3] rounded" />
              </div>

              <div className="h-8 w-28 bg-[#e6d17a] rounded mb-4" />

              <div className="h-4 w-20 bg-[#fff3c4] rounded" />
            </div>
          ))}
        </div>

        {/* ================= CHART SECTION ================= */}
        {role === "admin" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
            {/* Line Chart Skeleton */}
            <div
              className="xl:col-span-2 rounded-2xl border shadow-sm p-6 bg-white"
              style={{ borderColor: "#D4AF37" }}
            >
              <div className="h-5 w-40 bg-[#f5e6a3] rounded mb-6" />
              <div className="h-64 bg-[#fff3c4] rounded-lg" />
            </div>

            {/* Donut Skeleton */}
            <div
              className="xl:col-span-1 rounded-2xl border shadow-sm p-6 flex flex-col items-center justify-center bg-white"
              style={{ borderColor: "#D4AF37" }}
            >
              <div className="h-5 w-40 bg-[#f5e6a3] rounded mb-6" />

              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-[#f5e6a3]" />
                <div className="absolute top-10 left-10 w-28 h-28 rounded-full bg-white" />
              </div>

              <div className="mt-6 space-y-2 w-full">
                <div className="h-3 w-24 bg-[#f5e6a3] rounded mx-auto" />
                <div className="h-3 w-32 bg-[#f5e6a3] rounded mx-auto" />
              </div>
            </div>
          </div>
        )}

        {/* ================= TABLE SECTION ================= */}
        <div
          className="rounded-2xl border shadow-sm overflow-hidden bg-white"
          style={{ borderColor: "#D4AF37" }}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#fff7d6]">
            <div className="h-5 w-48 bg-[#f5e6a3] rounded" />
          </div>

          {/* Rows */}
          <div className="p-6 space-y-4">
            {[...Array(6)].map((_, row) => (
              <div
                key={row}
                className="flex justify-between items-center border-b pb-3"
                style={{ borderColor: "#f3cb1a" }}
              >
                {[...Array(6)].map((__, col) => (
                  <div key={col} className="h-4 w-24 bg-[#f5e6a3] rounded" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
