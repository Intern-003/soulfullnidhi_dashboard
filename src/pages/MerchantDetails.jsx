import React, { useEffect, useState } from 'react'
import { usePost } from '../hooks/usePost'
import { useParams } from 'react-router-dom'
import { useGet } from '../hooks/useGet'
import useAutoFetch from '../hooks/useAutoFetch'

import Chart from "react-apexcharts";
    import MyBarChart from '../components/MyBarChart';


const MerchantDetails = () => {
  const { id } = useParams();
 const {data:record} = useGet(`/Merchant-Collection?merchant_id=${id}`);

 const {data:getMerchant} = useGet(`/show-merchant/${id}`);
 const chartCount  =record?.transactionStatusCounts || {};

const chartSeries = chartCount
  ? [
      chartCount.pending ?? 0,
      chartCount.success ?? 0,
      chartCount.initiated ?? 0,
    ]
  : [0, 0, 0];

const chartLabels = ["Pending", "Success", "Initiated"];
// const pieOptions = {
//   chart: {
//     type: 'donut',
//         dropShadow: {
//       enabled: true, // adds shadow for depth
//       top: 10,
//       left: 0,
//       blur: 10,
//       opacity: 0.3,
//     },
//   },
//   labels: ["Pending", "Success", "Initiated"], // This is REQUIRED for pie charts
//    colors: ['#FFC107', '#4CAF50', '#F44336'], // yellow, green, red
//   legend: {
//     position: "bottom",
//   },
//   responsive: [{
//     breakpoint: 480,
//     options: {
//       chart: {
//         width: 300
//       },
//       legend: {
//         position: "bottom"
//       }
//     }
//   }]
// };

const pieOptions = {
  chart: {
    type: 'donut',
    background: '#ffffff', // light theme
    dropShadow: {
      enabled: true,
      top: 5,
      left: 0,
      blur: 8,
      opacity: 0.2,
    },
  },
  labels: ["Pending", "Success", "Initiated"],
  colors: ['#b9a358ff', '#006400', '#E57373'], // Success = dark green (#006400)
  legend: {
    position: "bottom",
    labels: {
      colors: '#555',
    },
  },
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 270, // tilt for 3D effect
      donut: {
        size: '65%',
        background: 'transparent',
        labels: {
          show: true,
          name: { show: true, color: '#333' },
          value: { show: true, color: '#333' },
        },
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: ['#cc9e09ff', '#004d00', '#EF9A9A'], 
      // Success gradient = dark green (#004d00)
      inverseColors: false,
      // opacityFrom: 0.9,
      // opacityTo: 0.7,
      stops: [0, 100],
    },
  },
  tooltip: {
    theme: 'light',
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: { width: 300 },
        legend: { position: "bottom" },
      },
    },
  ],
};



 console.log("record data",record);;



  return (
   <div className="p-4">

      <h1 className="text-xl font-bold mb-4">Merchant Details</h1>

      {/* Cards */}
      {record && (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Payin Wallet</h3>
            <p className="text-2xl font-semibold mt-2">₹ {record.today_payin}</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Payout Wallet</h3>
            <p className="text-2xl font-semibold mt-2">₹ {record.today_payout}</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Total Charges</h3>
            <p className="text-2xl font-semibold mt-2">₹ {record.total_payin_amount}</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Rolling Amount</h3>
            <p className="text-2xl font-semibold mt-2">₹ {record.total_payout_amount}</p>
          </div>

       
        </div>
        </>

      )}
   {record && (
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col lg:flex-row gap-6">
    {/* Pie Chart */}
    <div className="flex-1">
      <h3 className="text-lg font-semibold mb-4">Transaction Status Distribution</h3>
      {chartSeries.some(val => val > 0) ? (
        <Chart
          options={pieOptions}
          series={chartSeries}
          type="pie"
          height={350}
        />
      ) : (
        <div className="text-center text-gray-500">
          No transaction data available yet
        </div>
      )}
    </div>

    {/* Line Chart */}
    <div className="flex-1">
      <h3 className="text-lg font-semibold mb-4">Transactions Over Time</h3>
      <MyBarChart record={record} />
    </div>
  </div>
)}

    </div>

  )
}

export default MerchantDetails