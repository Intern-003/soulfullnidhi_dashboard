import { useEffect, useMemo, useState } from "react";
import { DonutChart } from "../components/DonutChart";
import { LineChart1 } from "../components/LineChart1";
import Table from "../components/Table";
import useAutoFetch from "../hooks/useAutoFetch";
import { MONTH_NAMES } from "../constants/Constants";
import DashboardSkeleton from "../components/DashboardSkeleton";

export const Dashboard = () => {
  const [role] = useState(atob(localStorage.getItem("role")) || "admin");

  const [transactionData, setTransactionData] = useState([]);
  const [largeTransactionData, setLargeTransactionData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  // ✅ Status filter
  const [statusFilter, setStatusFilter] = useState("SUCCESS");


  // APIs
  const { data: cardData, loading: recordLoading } =
    useAutoFetch("/collection-record");

  const { data: tableData } =
    useAutoFetch("/reportrecords-List");

  const initialDataOfTransactions = tableData?.data || [];

  // Sort by latest
  const processTableData = useMemo(() => {
    return [...initialDataOfTransactions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [initialDataOfTransactions]);

  // Status filter logic
  const filteredTableData = useMemo(() => {
    if (statusFilter === "ALL") return processTableData;

    return processTableData.filter(
      (item) => item.status?.toUpperCase() === statusFilter
    );
  }, [processTableData, statusFilter]);

  // Top 4 transactions
  const processLargeTransactionData = useMemo(() => {
    return [...initialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [initialDataOfTransactions]);

  // Format table data
  useEffect(() => {
    const formattedTableData = filteredTableData.map((item, index) => {
      const date = new Date(item.created_at);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });


      let statusClass =
        "bg-[#057034ff] text-white"; // default

      if (item.status === "pending") {
        statusClass =
          "bg-[#dfaf03ff] text-white";
      } else if (item.status === "failed") {
        statusClass =
          "bg-[#ff3366] text-white border-red-300";
      } else if (item.status === "initiated") {
        statusClass =
          "bg-blue-100 text-blue-600 border border-blue-300";
      } else if (item.status === "complete") {
        statusClass =
          "bg-[#057034ff] text-white";
      } else if (item.status === "reversed") {
        statusClass =
          "bg-[#ff3366] text-white";
      } else if (item.status === "refunded") {
        statusClass =
          "bg-gray-100 text-gray-600 border border-gray-300";
      }



      return {
        sqno: index + 1,
        txnid: item.txnid,
        name: item.user?.name || "-",
        type: item.product,
        amount: item.amount,
        status: (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {item.status.toUpperCase()}
          </span>
        ),
        time: (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{formattedDate}</span>
            <span className="text-sm text-gray-500">{formattedTime}</span>
          </div>
        ),
      };
    });

    setTransactionData(formattedTableData);

    const formattedLargeTransactionData = processLargeTransactionData.map(
      (item) => ({
        name: item.user?.name,
        product: item.product,
        amount: item.amount,
      })
    );

    setLargeTransactionData(formattedLargeTransactionData);
  }, [filteredTableData, processLargeTransactionData]);

  // Table columns
  const transactioncolumn = [

    { header: "TXN Id", accessor: "txnid" },
    { header: "Merchant", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
    { header: "Date/Time", accessor: "time" },
  ];

  useEffect(() => {
    if (!recordLoading && cardData) setInitialLoad(false);
  }, [recordLoading, cardData]);

  const cardsToShow = [
    { title: "Total Pay-IN Collection", value: cardData?.total_payin_amount ?? 0 },
    { title: "Total Pay-OUT", value: cardData?.total_payout_amount ?? 0 },
    { title: "Today Pay-IN Collection", value: cardData?.today_payin ?? 0 },
    { title: "Today Pay-OUT", value: cardData?.today_payout ?? 0 },
  ];

  return (
    <>
      {initialLoad ? (
        <DashboardSkeleton />
      ) : (
        <div className="w-full py-8">
          <div className="w-full px-4">

            {/* ================= CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <h5 className="p-3 text-white font-semibold"
                  style={{ background: "linear-gradient(250deg,#2a91d9,#00418c)" }}>
                  Today Pay-IN
                </h5>
                <div className="p-6 text-center font-bold text-xl">
                  ₹{cardsToShow[2].value.toLocaleString()}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <h5 className="p-3 text-white font-semibold"
                  style={{ background: "linear-gradient(250deg,#118dca,#1158ad)" }}>
                  Total Pay-IN
                </h5>
                <div className="p-6 text-center font-bold text-xl">
                  ₹{cardsToShow[0].value.toLocaleString()}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <h5 className="p-3 text-white font-semibold"
                  style={{ background: "linear-gradient(250deg,#2a91d9,#00418c)" }}>
                  Today Pay-OUT
                </h5>
                <div className="p-6 text-center font-bold text-xl">
                  ₹{cardsToShow[3].value.toLocaleString()}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <h5 className="p-3 text-white font-semibold"
                  style={{ background: "linear-gradient(250deg,#2a91d9,#00418c)" }}>
                  Total Pay-OUT
                </h5>
                <div className="p-6 text-center font-bold text-xl">
                  ₹{cardsToShow[1].value.toLocaleString()}
                </div>
              </div>

            </div>

            {/* ================= CHARTS ================= */}
            <div className="flex gap-4 w-full pt-8">
              <div className="w-[60%]"
              style={{background: "linear-gradient(180deg, #ecf3ffff, #e8f0ff, #d6e4ff)"}} >
                <LineChart1 data={cardData?.monthWiseStatusCounts} />
              </div>
              <div className="w-[40%] shadow-xl"
              style={{background: "linear-gradient(180deg, #ecf3ffff, #e8f0ff, #d6e4ff)"}}>
                <DonutChart data={cardData?.transactionStatusCounts || []} />
              </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="mt-8 bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Transactions</h4>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                  <option value="PENDING">Pending</option>
                  <option value="REVERSED">Reversed</option>
                  <option value="REFUNDED">Refunded</option>
                  <option value="COMPLETE">Complete</option>
                  <option value="INITIATED">Initiated</option>
                </select>

              </div>

              <Table
                columns={transactioncolumn}
                data={transactionData}
                showSearch={false}
                showPagination={true}
                showExport={false}
                showStatusFilter={false}
                showDeleteColumn={false}
                showDateFilter={false}
              />
            </div>

          </div>
        </div>
      )}
    </>
  );
};
