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

  // Normal API calls only (no crypto)
  const { data: cardData, loading: recordLoading } = useAutoFetch("/collection-record");
  const { data: tableData } = useAutoFetch("/reportrecords-List?status=success");
  // console.log(cardData);

  const initialDataOfTransactions = tableData?.data;

  // Sort table data
  const processTableData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [initialDataOfTransactions]);

  // Get largest 4 transactions
  const processLargeTransactionData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [initialDataOfTransactions]);

  // Format table & top transactions
  useEffect(() => {
    const formattedTableData = processTableData.map((item, index) => {
      const date = new Date(item.created_at);
      const formattedDate = `${date.getDate()} ${
        MONTH_NAMES[date.getMonth()]
      } ${date.getFullYear()}`;
      const formattedTime = date.toLocaleTimeString();

      return {
        sqno: index + 1,
        txnid: item.txnid,
        name: item.user.name,
        type: item.product,
        amount: item.amount,
        status: (
          <span className="px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
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
        name: item.user.name,
        product: item.product,
        amount: item.amount,
      })
    );

    setLargeTransactionData(formattedLargeTransactionData);
  }, [processTableData, processLargeTransactionData]);

  // Table columns
  const transactioncolumn = [
    { header: "SQ No.", accessor: "sqno" },
    { header: "TXN Id", accessor: "txnid" },
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
    { header: "Date/Time", accessor: "time" },
  ];

  useEffect(() => {
    if (!recordLoading && cardData) setInitialLoad(false);
  }, [recordLoading, cardData]);

  // Only normal cards
  const cardsToShow = [
    {
      title: "Total Pay-IN Collection",
      value: cardData?.total_payin_amount ?? 0,
    },
    {
      title: "Total Pay-OUT",
      value: cardData?.total_payout_amount ?? 0,
    },
    {
      title: "Today Pay-IN Collection",
      value: cardData?.today_payin ?? 0,
    },
    {
      title: "Today Pay-OUT",
      value: cardData?.today_payout ?? 0,
    },
  ];

  return (
    <>
      {initialLoad ? (
        <DashboardSkeleton />
      ) : (
        <div className="w-full py-8">
          <div className="w-full px-4">
 
            {/* --- CARDS --- */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">

                {/* Today Pay-IN */}
                <div className="h-30 bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 flex flex-col">
                  <h5
                    className="text-m font-semibold text-white tracking-wide p-3"
                    style={{ background: "linear-gradient(275deg,#062f70ff,#0d3dc4ff)" }}
                  >
                    Today Pay-IN
                  </h5>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl font-bold text-gray-800">
                      ₹{cardsToShow[2].value.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Total Pay-IN */}
                <div className="h-30 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                  <h5
                    className="text-m font-semibold text-white tracking-wide p-3"
                    style={{ background: "linear-gradient(75deg,#062f70ff,#0d3dc4ff)" }}
                  >
                    Total Pay-IN
                  </h5>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl font-bold text-gray-800">
                      ₹{cardsToShow[0].value.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Today Pay-OUT */}
                <div className="h-30 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                  <h5
                    className="text-m font-semibold text-white tracking-wide p-3"
                    style={{ background: "linear-gradient(275deg,#062f70ff,#0d3dc4ff)" }}
                  >
                    Today Pay-OUT
                  </h5>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl font-bold text-gray-800">
                      ₹{cardsToShow[3].value.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Total Pay-OUT */}
                <div className="h-30 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                  <h5
                    className="text-m font-semibold text-white tracking-wide p-3"
                    style={{ background: "linear-gradient(275deg,#062f70ff,#0d3dc4ff)" }}
                  >
                    Total Pay-OUT
                  </h5>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl font-bold text-gray-800">
                      ₹{cardsToShow[1].value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="flex gap-4 w-full pt-8">
              <div className="w-[60%]">
                <LineChart1 data={cardData.monthWiseStatusCounts} />
              </div>
              <div className="w-[40%] bg-[#e8eaed] shadow-xl">
                <DonutChart data={cardData?.transactionStatusCounts || []} />
              </div>
            </div>
            {/* Table */}
            <div className="mt-8">
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
