// import { useState, useEffect } from "react";
// import Table from "../components/Table";
// import { useGet } from "../hooks/useGet";
// import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
// import { TableSkeleton } from "../components/TableSkeleton";

// const Acc_topup_settlement = () => {
//   const [topupPayoutData, setTopupPayoutData] = useState([]);


//   const { data, loading, error } = useGet(
//     "/reportrecords-List?product[]=topup_payout&product[]=take_back_from_wallet"
//   );


//   useEffect(() => {

//     const statusClasses = {
//       pending:  "bg-[#dfaf03ff] text-white",
//       initiated:"bg-blue-400 text-white",
//       success:  "bg-[#057034ff] text-white",
//       completed: "bg-[#057034ff] text-white",
//       failed:   "bg-[#ff3366] text-white",
//       reversed: "bg-[#ff3366] text-white",
//       refunded: "bg-gray-400 text-white",
//     };

//     if (data?.data) {
//       const formattedData = data.data.map((item, index) => ({
//         sqno: index + 1,
//         id: item.id,
//         product_type: item.product ?? "N/A",
//         merchant_details: `${item.user?.name ?? "N/A"} (${item.user_id ?? "N/A"})`,
//         txnid: item.txnid,
//         date: (() => {
//           const d = new Date(item.created_at);

//           // Format date like "16 Dec 25"
//           const formattedDate = d.toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "2-digit",
//           });


//           const formattedTime = d.toLocaleTimeString("en-US", {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//           });

//           return (
//             <div className="flex flex-col w-28">
//               <span className="text-sm font-medium">{formattedDate}</span>
//               <span className="text-sm text-gray-500">{formattedTime}</span>
//             </div>
//           );
//         })(),



//         amount: item.amount ?? "N/A",
//         numericAmount: parseFloat(item.amount) || 0, // ✅ for calculations
//         status: item.status,
//         payout_closing_balance: item.payout_closing_balance ?? "0.0",
//         payout_opening_balance: item.payout_opening_balance ?? "0.0",
//         showstatus: (
//           <span
//             className={`px-2 py-1 rounded-full text-sm font-medium ${statusClasses[item.status] ?? "bg-gray-100 text-gray-800"
//               }`}
//           >
//             {item?.status
//               ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
//               : "N/A"}
//           </span>
//         ),
//       }));
//       setTopupPayoutData(formattedData);
//     }

//   }, [data]);

//   const topupPayoutColumn = [
//     { header: "SQ NO", accessor: "id" },
//     { header: "Merchant Details", accessor: "merchant_details" },
//     { header: "Transaction Id", accessor: "txnid" },
//     { header: "Product Type", accessor: "product_type" },
//     { header: "Amount", accessor: "amount" },
//     { header: "Status", accessor: "showstatus" },
//     { header: "Date", accessor: "date" },
//     { header: "Opening Bal", accessor: "payout_opening_balance" },
//     { header: "Closing Bal", accessor: "payout_closing_balance" },
//   ];

//   return (
//     <div className="p-4 space-y-4">
//       {/* Header */}
//       <div className=" rounded-lg flex justify-between items-center p-4 shadow-md"
//       style={{ background: 'linear-gradient(250deg, #55abe9ff 0%, #00418c 100%)' }}>
//         <h4 className="font-bold text-white text-xl">
//           Topup Settlement Statement
//         </h4>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <TableSkeleton />
//       ) : error ? (
//         <div className="text-center py-6 text-red-500">Error: {error}</div>
//       ) : (
//         <Table
//           columns={topupPayoutColumn}
//           data={topupPayoutData}
//           showStatusFilter={true}
//           showExport={true}
//           showSearch={false}
//           showSelectUserFilter={true}
//           showDeleteColumn={false}
//           statusList={REPORT_STATUSES}
//           className="shadow-lg rounded-lg overflow-hidden"
//         />
//       )}
//     </div>
//   );
// };

// export default Acc_topup_settlement;

import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const Acc_topup_settlement = () => {
  const [topupPayoutData, setTopupPayoutData] = useState([]);

  const { data, loading, error } = useGet(
    "/reportrecords-List?product[]=topup_payout&product[]=take_back_from_wallet"
  );

  useEffect(() => {
    if (!data?.data) return;

    const statusClasses = {
      pending: "bg-[#dfaf03ff] text-white",
      initiated: "bg-blue-400 text-white",
      success: "bg-[#057034ff] text-white",
      completed: "bg-[#057034ff] text-white",
      failed: "bg-[#ff3366] text-white",
      reversed: "bg-[#ff3366] text-white",
      refunded: "bg-gray-400 text-white",
    };

    const formattedData = data.data.map((item, index) => {
      const d = new Date(item.created_at);

      const formattedDate = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });

      const formattedTime = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return {
        /* ================= REQUIRED BY TABLE ================= */
        id: item.id,
        user_id: item.user_id,
        merchant_details: `${item.user?.name ?? "N/A"} (${item.user_id ?? "N/A"})`,
        status: item.status,

        /* ================= RAW DATE (VERY IMPORTANT) ================= */
        created_at: item.created_at,

        /* ================= UI FIELDS ================= */
        sqno: index + 1,

        txnid: item.txnid,

        product_type: item.product ?? "N/A",

        date: (
          <div className="flex flex-col w-28">
            <span className="text-sm font-medium">{formattedDate}</span>
            <span className="text-sm text-gray-500">{formattedTime}</span>
          </div>
        ),

        amount: item.amount ?? "N/A",
        numericAmount: parseFloat(item.amount) || 0,

        payout_opening_balance: item.payout_opening_balance ?? "0.0",
        payout_closing_balance: item.payout_closing_balance ?? "0.0",

        showstatus: (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              statusClasses[item.status] ?? "bg-gray-100 text-gray-800"
            }`}
          >
            {item?.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : "N/A"}
          </span>
        ),
      };
    });

    setTopupPayoutData(formattedData);
  }, [data]);

  const topupPayoutColumn = [
    { header: "SQ NO", accessor: "id" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Transaction Id", accessor: "txnid" },
    { header: "Product Type", accessor: "product_type" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
    { header: "Date", accessor: "date" },
    { header: "Opening Bal", accessor: "payout_opening_balance" },
    { header: "Closing Bal", accessor: "payout_closing_balance" },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div
        className="rounded-lg flex justify-between items-center p-4 shadow-md"
        style={{
          background: "linear-gradient(250deg, #55abe9ff 0%, #00418c 100%)",
        }}
      >
        <h4 className="font-bold text-white text-xl">
          Topup Settlement Statement
        </h4>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500">
          Error: {error}
        </div>
      ) : (
        <Table
          columns={topupPayoutColumn}
          data={topupPayoutData}
          showStatusFilter={true}
          showExport={true}
          showSearch={false}
          showSelectUserFilter={true}
          showDeleteColumn={false}
          statusList={REPORT_STATUSES}
        />
      )}
    </div>
  );
};

export default Acc_topup_settlement;
