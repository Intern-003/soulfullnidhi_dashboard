import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet"; // <-- import your hook
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const Acc_upi_setlement = () => {
  const [payinSettlementData, setPayinSettlementData] = useState([]);

  // ✅ Use your hook to fetch schemes
  const { data, loading, error } = useGet(
    "/reportrecords-List?product=payin_settlement"
  );

  // ✅ Format data whenever "data" changes
  useEffect(() => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      initiated: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
      complete: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      reversed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };

    if (data?.data) {
      const formattedData = data.data.map((item, index) => ({
        sqno: index + 1,
        id: item.id,
        product_type: item.product ?? "N/A",
        merchant_details: item.user.name ?? "N/A",
        txnid: item.txnid,
        amount: item.amount ?? "N/A",
        date:
          new Date(item.created_at).getDate() +
          " " +
          MONTH_NAMES[new Date(item.created_at).getMonth()] +
          " " +
          new Date(item.created_at).getFullYear() +
          " - " +
          new Date(item.created_at).toLocaleTimeString(),
        status: item.status,  
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
    }
  }, [data]);

  const payinSettlementColumn = [
    { header: "SQ NO", accessor: "sqno" },
    { header: "Product Type", accessor: "product_type" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Transaction Id", accessor: "txnid" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
    { header: "Date", accessor: "date" },
  ];

  return (
    <div>
      <div
        className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center"
        style={{ margin: "0 0 20px 0", padding: "10px" }}
      >
        <h4 className="font-bold text-white text-lg py-2">
          Payin Settlement Statement
        </h4>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500">Error: {error}</div>
      ) : (
        <Table
          columns={payinSettlementColumn}
          data={payinSettlementData}
          showStatusFilter={true}
          showExport={true}
          showSearch={true}
          showDeleteColumn={false}
          statusList={REPORT_STATUSES}
        />
      )}
    </div>
  );
};

export default Acc_upi_setlement;
