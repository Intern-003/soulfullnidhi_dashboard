import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet"; // <-- import your hook
import { MONTH_NAMES } from "../constants/Constants";

const Acc_topup_settlement = () => {
  const [topupPayoutData, setTopupPayoutData] = useState([]);

  // ✅ Use your hook to fetch schemes
  const { data, loading, error } = useGet(
    "/reportrecords-List?product=topup_payout"
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
        order_id: item.id ?? "N/A",
        product_type: item.product ?? "N/A",
        merchant_details: item.user.name ?? "N/A",
        txnid: item.txnid,
        date:
          new Date(item.created_at).getDate() +
          " " +
          MONTH_NAMES[new Date(item.created_at).getMonth()] +
          " " +
          new Date(item.created_at).getFullYear(),
        amount: item.amount ?? "N/A",
        status: (
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
      setTopupPayoutData(formattedData);
    }
  }, [data]);

  const topupPayoutColumn = [
    { header: "SQ NO", accessor: "sqno" },
    { header: "Order id", accessor: "order_id" },
    { header: "Product Type", accessor: "product_type" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Transaction Id", accessor: "txnid" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: "date" }
  ];

  return (
    <div>
      <div
        className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center"
        style={{ margin: "0 0 20px 0", padding: "10px" }}
      >
        <h4 className="font-bold text-white text-lg py-2">
          Topup Settlement Statement
        </h4>
      </div>

      {loading ? (
        <div className="text-center py-6 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">Error: {error}</div>
      ) : (
        <Table
          columns={topupPayoutColumn}
          data={topupPayoutData}
          showStatusFilter={true}
          showExport={true}
          showSearch={true}
          showDeleteColumn={false}
        />
      )}
    </div>
  );
};

export default Acc_topup_settlement;
