import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse p-6 space-y-8">
      {/* ========== TOP SECTION (4 CARDS + DONUT CHART) ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Left cards section */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="m-5 relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
            >
              {/* Card header skeleton */}
              <div className="flex justify-between items-center p-6 bg-gray-300 relative z-10 rounded-b-xl">
                <div className="bg-gray-200 rounded-full p-4 h-10 w-10"></div>
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
              </div>

              {/* Decorative SVG shape placeholder */}
              <svg
                className="absolute bottom-0 w-full"
                viewBox="0 0 500 50"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 C250,50 250,50 500,0 L500,50 L0,50 Z"
                  className="fill-gray-100"
                />
              </svg>

              {/* Card bottom section skeleton */}
              <div className="flex justify-between items-center p-6 relative z-10">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Donut Chart skeleton */}
        <div className="flex justify-center items-center">
          <div className="w-80 h-80 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* ========== SECOND SECTION (LINE CHART + LARGE TRANSACTIONS) ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-5">
        {/* Line chart */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-lg shadow-md p-4">
          <div className="h-72 bg-gray-200 rounded"></div>
        </div>

        {/* Large Transactions box */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg shadow-md p-4">
          <div className="flex justify-between mb-4">
            <div className="h-5 w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== TABLE SECTION ========== */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-gray-100 pb-2"
            >
              {[...Array(5)].map((__, j) => (
                <div key={j} className="h-4 w-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;