import React, { useEffect } from 'react'
import { usePost } from '../hooks/usePost'
import { useParams } from 'react-router-dom'
import { useGet } from '../hooks/useGet'
import Chart from "react-apexcharts";



const MerchantDetails = () => {
const { id } = useParams();
const {data:getMerchant} = useGet(`/show-merchant/${id}`);
useEffect(() =>{
    console.log(getMerchant);
},[getMerchant]);

  return (
   <div className="p-4">

      <h1 className="text-xl font-bold mb-4">Merchant Details</h1>

      {/* Cards */}
      {getMerchant?.data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Payin Wallet</h3>
            <p className="text-2xl font-semibold mt-2">₹ {getMerchant.data.payin_wallet}</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Payout Wallet</h3>
            <p className="text-2xl font-semibold mt-2">₹ {getMerchant.data.payout_wallet}</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Total Charges</h3>
            <p className="text-2xl font-semibold mt-2">₹ {getMerchant.data.total_charges}</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Rolling Amount</h3>
            <p className="text-2xl font-semibold mt-2">₹ {getMerchant.data.rolling_amount}</p>
          </div>

        </div>
      )}

      {/* Raw JSON output for debugging */}
      {/* <pre>{JSON.stringify(getMerchant, null, 2)}</pre> */}
{/* Pie Chart Section */}
{/* Pie Chart */}
<div className="bg-white p-4 shadow-md rounded-xl mt-6">
  <h3 className="text-lg font-semibold mb-4">Transaction Overview</h3>

  <Chart
    type="pie"
    width="100%"
    height={350}
    series={[44, 25, 31]} // replace with API values
    options={{
      labels: ["Success", "Pending", "Failed"],
      legend: { position: "bottom" },
      colors: ["#22c55e", "#facc15", "#ef4444"],
    }}
  />
</div>


    </div>
  )
}

export default MerchantDetails