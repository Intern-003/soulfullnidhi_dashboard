import { useEffect, useMemo, useState } from "react";
import { DonutChart } from "../components/DonutChart";
import { LineChart } from "../components/LineChart";
import Table from "../components/Table";
import useAutoFetch from "../hooks/useAutoFetch";
import { MONTH_NAMES } from "../constants/Constants";
import DashboardSkeleton from "../components/DashboardSkeleton";
import largesttxn from "../images/largesttxn.jpg";

export const Dashboard = () => {
  // Get role from localStorage
  // const [role] = useState(atob(localStorage.getItem("role")) || "admin");
  const [role] = useState(() => {
    const storedRole = localStorage.getItem("role");
    return storedRole ? atob(storedRole) : "admin";
  });


  const [transactionData, setTransactionData] = useState([]);
  const [largeTransactionData, setLargeTransactionData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch data
  const { data: cardData, loading: recordLoading } = useAutoFetch("/collection-record");
  const { data: tableData } = useAutoFetch("/reportrecords-List?status=success");
  const { data: cryptotableData } = useAutoFetch("/crypto-reportrecords-list?status=success");

  const initialDataOfTransactions = tableData?.data;
  const cryptoinitialDataOfTransactions = cryptotableData?.data;

  // console.log("Table Data:", tableData);
  // console.log("Crypto Table Data:", cryptotableData);

  // Process table data
  const processTableData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [initialDataOfTransactions]);

  const cryptoprocessTableData = useMemo(() => {
    if (!cryptoinitialDataOfTransactions) return [];
    return [...cryptoinitialDataOfTransactions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [cryptoinitialDataOfTransactions]);

  // Process top 4 largest transactions
  const processLargeTransactionData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [initialDataOfTransactions]);

  const cryptoprocessLargeTransactionData = useMemo(() => {
    if (!cryptoinitialDataOfTransactions) return [];
    return [...cryptoinitialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [cryptoinitialDataOfTransactions]);

  // Format transaction & large transaction data
  useEffect(() => {
    const tableSource =
      role === "crypto" ? cryptoprocessTableData : processTableData;

    const largeSource =
      role === "crypto" ? cryptoprocessLargeTransactionData : processLargeTransactionData;

    // Format table data
    const formattedTableData = tableSource.map((item, index) => {
      const date = new Date(item.created_at);
      const formattedDate = `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
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

    // Format large transactions
    const formattedLargeTransactionData = largeSource.map((item) => ({
      name: item.user.name,
      product: item.product,
      amount: item.amount,
    }));

    setLargeTransactionData(formattedLargeTransactionData);
  }, [
    role,
    processTableData,
    processLargeTransactionData,
    cryptoprocessTableData,
    cryptoprocessLargeTransactionData,
  ]);

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
    // console.log(cardData);
  }, [recordLoading, cardData]);

  // Role-based cards
  const normalCards = [
    { title: "Total Pay-IN Collection", icon: "fa-wallet", value: cardData?.total_payin_amount ?? 0 },
    { title: "Total Pay-OUT", icon: "fa-wallet", value: cardData?.total_payout_amount ?? 0 },
    { title: "Today Pay-IN Collection", icon: "fa-arrow-trend-up", value: cardData?.today_payin ?? 0 },
    { title: "Today Pay-OUT", icon: "fa-arrow-trend-up", value: cardData?.today_payout ?? 0 },
  ];

  const cryptoCard = [
    { title: "Total Crypto-IN Collection", icon: "fa-bitcoin-sign", value: cardData?.total_crypto ?? 0 },
    { title: "Total Crypto-OUT Collection", icon: "fa-bitcoin-sign", value: cardData?.total_crypto_payout ?? 0 },
    { title: "Today Crypto-IN Collection", icon: "fa-bitcoin-sign", value: cardData?.today_crypto ?? 0 },
    { title: "Today Crypto-OUT Collection", icon: "fa-bitcoin-sign", value: cardData?.today_crypto_payout ?? 0 },
  ];

  let cardsToShow = [];
  if (role === "admin") cardsToShow = [...normalCards];
  else if (role === "crypto") cardsToShow = [...cryptoCard];
  else cardsToShow = [...normalCards]; // normal users
  // console.log(cardData?.transactionStatusCounts);
  return (
    <>
      {initialLoad ? (
        <DashboardSkeleton />
      ) : (
        <div className="w-full py-8">
          <div className="w-full px-4">
            <div className="max-w-[1140px] mx-auto px-4 grid grid-cols-1 gap-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Today Pay-IN */}
                <div className="h-30 bg-white rounded-2xl shadow-xl/20 overflow-hidden border border-blue-100  flex flex-col">
                  <h5
                    className="text-m font-semibold text-white tracking-wide p-3"
                    style={{ background: "linear-gradient(275deg,  #062f70ff, #0d3dc4ff)" }}
                  >
                    Today Pay-IN
                  </h5>

                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl font-bold text-gray-800">
                      ₹1200909097697          {/* ₹{cardsToShow.find(c => c.title.includes('Today Pay-IN'))?.value?.toLocaleString() || '0.00'} */}
                    </p>
                  </div>

                  {/* <div className="h-1" style={{ background: "linear-gradient(275deg, #062f70ff, #0d3dc4ff)" }} /> */}
                </div>

                {/* Total Pay-IN */}
                <div className="h-30 bg-white rounded-2xl shadow-xl/20  overflow-hidden  flex flex-col">
                  <h5
                    className="text-m font-semibold text-white tracking-wide p-3"
                    style={{ background: "linear-gradient(275deg,  #062f70ff, #0d3dc4ff)" }}
                  >
                    Total Pay-IN
                  </h5>

                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl font-bold text-gray-800">
                      ₹{cardsToShow.find(c => c.title.includes('Total Pay-IN'))?.value?.toLocaleString() || '0.00'}
                    </p>
                  </div>

                  {/* <div className="h-1" style={{ background: "linear-gradient(275deg, #062f70ff, #0d3dc4ff)" }} /> */}
                </div>

                {/* Today Pay-OUT */}
                <div className="h-30 bg-white rounded-2xl shadow-xl/30 overflow-hidden  flex flex-col">
                  <h5
                    className="text-m font-semibold text-white tracking-wide p-3"
                    style={{ background: "linear-gradient(275deg, #062f70ff, #0d3dc4ff)" }}
                  >
                    Today Pay-OUT
                  </h5>

                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl font-bold text-gray-800">
                      ₹{cardsToShow.find(c => c.title.includes('Today Pay-OUT'))?.value?.toLocaleString() || '0.00'}
                    </p>
                  </div>

                  {/* <div className="h-1" style={{ background: "linear-gradient(275deg, #062f70ff, #0d3dc4ff)" }} /> */}
                </div>

                {/* Total Pay-OUT */}
                <div className="h-30 bg-white rounded-2xl shadow-xl/30 overflow-hidden  flex flex-col">
                  <h5
                    className="text-m font-semibold text-white tracking-wide p-3"
                    style={{ background: "linear-gradient(275deg, #062f70ff, #0d3dc4ff)" }}
                  >
                    Total Pay-OUT
                  </h5>

                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl font-bold text-gray-800">
                      ₹{cardsToShow.find(c => c.title.includes('Total Pay-OUT'))?.value?.toLocaleString() || '0.00'}
                    </p>
                  </div>

                  {/* <div className="h-1" style={{ background: "linear-gradient(275deg, #062f70ff, #0d3dc4ff)" }} /> */}
                </div>

              </div>
            </div>

            {/* -------- TABLE -------- */}
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
