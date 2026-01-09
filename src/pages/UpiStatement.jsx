import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const UpiStatement = () => {
  const [upiData, setUpiData] = useState([]);

  const { data, loading, error } = useGet("/reportrecords-List?product=UPI");

  useEffect(() => {
    if (!data?.data) return;

    const statusClasses = {
      pending: "bg-[#dfaf03ff] text-white",
      initiated: "bg-[#0f3cb9ff] text-white",
      success: "bg-[#057034ff] text-white",
      complete: "bg-[#057034ff] text-white",
      failed: "bg-[#ff3366] text-white",
      reversed: "bg-[#ff3366] text-white",
      refunded: "bg-gray-400 text-white",
    };

    const sortedData = [...data.data].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const formattedData = sortedData.map((item) => {
      const d = new Date(item.created_at);

      return {
        /* ================= REQUIRED BY TABLE (DO NOT REMOVE) ================= */
        id: item.id,
        user_id: item.user_id,
        merchant_details: `${item.user?.name ?? "N/A"} (${item.user_id ?? "N/A"})`,
        status: item.status,

        /* ================= RAW DATE (FILTER / EXPORT USES THIS) ================= */
        created_at: item.created_at,

        /* ================= UI FIELDS ================= */
        sqno: (
          <div className="flex flex-col text-left">
            <span><b>{item.id}</b></span>
            <span>
              {d.getDate()} {MONTH_NAMES[d.getMonth()]} {d.getFullYear()}
            </span>
            <span className="text-sm text-gray-500">
              {d.toLocaleTimeString()}
            </span>
          </div>
        ),

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

        showstatus: (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              statusClasses[item.status] ?? "bg-gray-600 text-white"
            }`}
          >
            {item?.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : "N/A"}
          </span>
        ),
      };
    });

    setUpiData(formattedData);
  }, [data]);

  const upiColumn = [
    { header: "Order Id", accessor: "sqno" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Transaction Details", accessor: "txnid" },
    { header: "Amount / Commission", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
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
        <h4 className="font-bold text-white text-xl">Upi Statement</h4>
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
          columns={upiColumn}
          data={upiData}
          showStatusFilter={true}
          showExport={true}
          showSearch={false}
          showDeleteColumn={false}
          showSelectUserFilter={true}
          statusList={REPORT_STATUSES}
        />
      )}
    </div>
  );
};

export default UpiStatement;
