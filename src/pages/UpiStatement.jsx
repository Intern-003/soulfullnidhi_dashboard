import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const UpiStatement = () => {
  const [upiData, setUpiData] = useState([]);

  const { data, loading, error } = useGet("/reportrecords-List?product=UPI");
  // console.log( "upi data",data);

  // 🔥 Same date format as ACC_TOPUP_SETTLEMENT.jsx
  const formatDateLikeTopup = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    const time = d.toLocaleTimeString();

    return `${day} ${month} ${year} - ${time}`;
  };


//   useEffect(() => {
//   const statusClasses = {
//       pending:  "bg-[#dfaf03ff] text-white",
//       initiated:"bg-blue-400 text-white",
//       success:  "bg-[#057034ff] text-white",
//       complete: "bg-[#057034ff] text-white",
//       failed:   "bg-[#ff3366] text-white",
//       reversed: "bg-[#ff3366] text-white",
//       refunded: "bg-gray-400 text-white",
//   };

//   if (data?.data) {
//     const sortedData = [...data.data].sort(
//       (a, b) => new Date(b.created_at) - new Date(a.created_at)
//     );
//     // console.log("sorted data : ",sortedData);  

//     const total = sortedData.length;
//     const formattedData = sortedData.map((item, index) => ({
//       sqno: (
//         <div className="flex flex-col text-left">
//           {/* <span><b>{total - index}</b></span> */}
//           <span><b>{item.id}</b></span>
//           <span>
//             {new Date(item.created_at).getDate()}{" "}
//             {MONTH_NAMES[new Date(item.created_at).getMonth()]}{" "}
//             {new Date(item.created_at).getFullYear()} <br />
//             {new Date(item.created_at).toLocaleTimeString()}
//           </span>
//         </div>
//       ),


//       id: item.id,
//       product_type: item.product ?? "N/A",
//       merchant_details: `${item.user?.name ?? "N/A"} (${item.user_id ?? "N/A"})`,

//       txnid: (
//         <div className="flex flex-col text-left">
//           <span>Payee VPA: <b>{item.payee_vpa ?? "null"}</b></span>
//           <span>Ref No: <b>{item.refno ?? "null"}</b></span>
//           <span>Payee Txnid: <b>{item.mytxnid}</b></span>
//           <span>TxnId: <b>{item.txnid}</b></span>
//         </div>
//       ),

//       amount: (
//         <div className="flex flex-col text-left">
//           <span>Amount: <b>{item.amount}</b></span>
//           <span>Charges: <b>{item.charge}</b></span>
//           <span>GST: <b>{item.gst}</b></span>
//           <span>Payin Rolling Amount: <b>{item.payin_rolling_amount}</b></span>
//         </div>
//       ),

//       numericAmount: parseFloat(item.amount) || 0,
//       date: formatDateLikeTopup(item.created_at),
//       status: item.status,

//       showstatus: (
//         <span
//           className={`px-2 py-1 rounded-full text-sm font-medium ${
//             statusClasses[item.status] ?? "bg-gray-600 text-white"
//           }`}
//         >
//           {item?.status
//             ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
//             : "N/A"}
//         </span>
//       ),
//     }));

//     setUpiData(formattedData);
//   }
// }, [data]);
useEffect(() => {
  const statusClasses = {
    pending:  "bg-[#dfaf03ff] text-white",
    initiated:"bg-blue-400 text-white",
    success:  "bg-[#057034ff] text-white",
    complete: "bg-[#057034ff] text-white",
    failed:   "bg-[#ff3366] text-white",
    reversed: "bg-[#ff3366] text-white",
    refunded: "bg-gray-400 text-white",
  };

  if (data?.data) {
    const sortedData = [...data.data].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const formattedData = sortedData.map((item, index) => {
      const d = new Date(item.created_at);

      // Format date like "16 Dec 25"
      const formattedDate = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });

      // Format time like "04:59 PM"
      const formattedTime = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return {
        sqno: (
          <div className="flex flex-col text-left">
            <span><b>{item.id}</b></span>
            <span className="text-sm font-medium">{formattedDate}</span>
            <span className="text-sm text-gray-500">{formattedTime}</span>
          </div>
        ),
        id: item.id,
        product_type: item.product ?? "N/A",
        merchant_details: `${item.user?.name ?? "N/A"} (${item.user_id ?? "N/A"})`,
        txnid: (
          <div className="flex flex-col text-left">
            <span>Payee VPA: <b>{item.payee_vpa ?? "null"}</b></span>
            <span>Ref No: <b>{item.refno ?? "null"}</b></span>
            <span>Payee Txnid: <b>{item.mytxnid}</b></span>
            <span>TxnId: <b>{item.txnid}</b></span>
          </div>
        ),
        amount: (
          <div className="flex flex-col text-left">
            <span>Amount: <b>{item.amount}</b></span>
            <span>Charges: <b>{item.charge}</b></span>
            <span>GST: <b>{item.gst}</b></span>
            <span>Payin Rolling Amount: <b>{item.payin_rolling_amount}</b></span>
          </div>
        ),
        numericAmount: parseFloat(item.amount) || 0,
        status: item.status,
        showstatus: (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${statusClasses[item.status] ?? "bg-gray-600 text-white"}`}
          >
            {item?.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : "N/A"}
          </span>
        ),
      };
    });

    setUpiData(formattedData);
  }
}, [data]);



  const upiColumn = [
    { header: "Order Id", accessor: "sqno" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Transaction Details", accessor: "txnid" },
    { header: "Amount/ Commission", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="rounded-lg flex justify-between items-center p-4 shadow-md"
      style={{ background: 'linear-gradient(250deg, #55abe9ff 0%, #00418c 100%)' }}>
        <h4 className="font-bold text-white text-xl">Upi Statement</h4>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500">Error: {error}</div>
      ) : (
        <Table
          columns={upiColumn}
          data={upiData}
          showStatusFilter={true}
          showExport={true}
          showSearch={false}
          showDeleteColumn={false}
          showSelectUserFilter={true}
          statusList={REPORT_STATUSES}
          className="shadow-lg rounded-lg overflow-hidden"
        />
      )}
    </div>
  );
};

export default UpiStatement;
