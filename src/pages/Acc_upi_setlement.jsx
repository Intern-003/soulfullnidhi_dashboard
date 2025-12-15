import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const Acc_upi_setlement = () => {
  const [payinSettlementData, setPayinSettlementData] = useState([]);


  const { data, loading, error } = useGet(
    "/reportrecords-List?product=payin_settlement"
  );


  useEffect(() => {
    const statusClasses = {
      pending:  "bg-yellow-600 text-white",
      initiated:"bg-blue-600 text-white",
      success:  "bg-green-600 text-white",
      complete: "bg-green-700 text-white",
      failed:   "bg-red-600 text-white",
      reversed: "bg-red-700 text-white",
      refunded: "bg-gray-600 text-white",
    };

    if (data?.data) {
    const formattedData = data.data.map((item, index) => ({
      sqno: index + 1,
      id: item.id,
      product_type: item.product ?? "N/A",
      merchant_details: `${item.user?.name ?? "N/A"} (${item.user_id ?? "N/A"})`,
      txnid: item.txnid ?? "N/A",
      amount: item.amount ?? "N/A",
      numericAmount: parseFloat(item.amount) || 0,

      date:
        new Date(item.created_at).getDate() +
        " " +
        MONTH_NAMES[new Date(item.created_at).getMonth()] +
        " " +
        new Date(item.created_at).getFullYear() +
        " - " +
        new Date(item.created_at).toLocaleTimeString(),
      status: item.status,
      payin_closing_balance: item.payin_closing_balance ?? "0.0",
      payin_opening_balance: item.payin_opening_balance ?? "0.0",
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
    }));
    setPayinSettlementData(formattedData);
  } }, [data]);

  const payinSettlementColumn = [
    { header: "SQ NO", accessor: "id" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Transaction Id", accessor: "txnid" },
    { header: "Product Type", accessor: "product_type" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
    { header: "Date", accessor: "date" },
    { header: "Opening Bal", accessor: "payin_opening_balance" },
    { header: "Closing Bal", accessor: "payin_closing_balance" },
  
  ];


  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="rounded-lg flex justify-between items-center p-4 shadow-md"
      style={{ background: "linear-gradient(275deg, #062f70ff, #0d3dc4ff)" }}>
        <h4 className="font-bold text-white text-lg sm:text-xl">
          Payin Settlement Statement
        </h4>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500 text-sm sm:text-base">
          Error: {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={payinSettlementColumn}
            data={payinSettlementData}
            showStatusFilter={true}
            showExport={true}
            showSearch={false}
            showSelectUserFilter={true}
            showDateFilter={true}
            showDeleteColumn={false}
            statusList={REPORT_STATUSES}
            className="shadow-lg rounded-lg overflow-hidden min-w-[700px] sm:min-w-full"
          />
        </div>
      )}
    </div>
  );
};

export default Acc_upi_setlement;
