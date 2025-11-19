import { useEffect, useMemo, useState } from "react";
import { DonutChart } from "../components/DonutChart";
import { LineChart } from "../components/LineChart";
import Table from "../components/Table";
import useAutoFetch from "../hooks/useAutoFetch";
import { MONTH_NAMES } from "../constants/Constants";
import DashboardSkeleton from "../components/DashboardSkeleton";
import largesttxn from "../images/largesttxn.jpg";


export const Dashboard = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [largeTransactionData, setLargeTransactionData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const { data: cardData, loading: recordLoading } =
    useAutoFetch("/collection-record");
  const { data: tableData } = useAutoFetch(
    "/reportrecords-List?status=success"
  );
  const initialDataOfTransactions = tableData?.data;

  const processTableData = useMemo(() => {
    if (!initialDataOfTransactions) return [];

    return [...initialDataOfTransactions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [initialDataOfTransactions]);

  const processLargeTransactionData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [initialDataOfTransactions]);

  // Update processTableData mapping
  useEffect(() => {
    const formattedTableData = processTableData.map((item, index) => {
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
        )

      };
    });

    setTransactionData(formattedTableData);

    const formattedLargeTransactionData = processLargeTransactionData.map((item) => ({
      name: item.user.name,
      amount: item.amount,
    }));
    setLargeTransactionData(formattedLargeTransactionData);
  }, [processTableData, processLargeTransactionData]);

  // Update transactioncolumn
  const transactioncolumn = [
    { header: "SQ No.", accessor: "sqno" },
    { header: "TXN Id", accessor: "txnid" },
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
    { header: "Date/Time", accessor: "time" }, // updated header
  ];

  useEffect(() => {
    if (!recordLoading && cardData) setInitialLoad(false);
  }, [recordLoading, cardData]);



  return (
    <>
      {initialLoad ? (
        <DashboardSkeleton />
      ) : (
        <div className="w-full flex justify-center py-8"> {/* Top & bottom spacing */}
          {/* Wrapper to match top cards + donut chart width */}
          <div className="w-full max-w-[1140px] px-4 lg:px-6">

            {/* -------- TOP CARDS + DONUT CHART -------- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Total Pay-IN Collection", icon: "fa-wallet", value: cardData?.total_payin_amount ?? 0 },
                  { title: "Total Pay-OUT", icon: "fa-wallet", value: cardData?.total_payout_amount ?? 0 },
                  { title: "Today Pay-IN Collection", icon: "fa-arrow-trend-up", value: cardData?.today_payin ?? 0 },
                  { title: "Today Pay-OUT", icon: "fa-arrow-trend-up", value: cardData?.today_payout ?? 0 },
                ].map((card, i) => (
                  // <div
                  //   key={i}
                  //   className="relative bg-white  rounded-xl shadow-lg flex flex-col h-full transform transition-transform duration-500 hover:scale-105"
                  // >
                  <div
                    key={i}
                    className="relative bg-white rounded-xl shadow-[0_4px_15px_rgba(255,165,0,0.2)] flex flex-col h-full transform transition-transform duration-500 hover:scale-105 hover:shadow-[0_6px_20px_rgba(255,165,0,0.3)]"
                  >



                    {/* Header */}
                    <div className="flex items-center px-5 py-4 bg-blue-500 text-white relative z-10 gap-4 rounded-t-xl">
                      <div className="bg-white rounded-full p-3 flex items-center justify-center shrink-0">
                        <i className={`fa-solid ${card.icon} text-blue-500 text-xl`}></i>
                      </div>
                      <h5 className="text-base sm:text-lg font-semibold text-white truncate whitespace-nowrap">
                        {card.title}
                      </h5>
                    </div>

                    {/* SVG Wave */}
                    <svg
                      className="absolute bottom-0 w-full"
                      viewBox="0 0 500 40"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,0 C250,40 250,40 500,0 L500,40 L0,40 Z"
                        className="fill-gray-300"
                      />
                    </svg>

                    {/* Value Section */}
                    <div className="flex justify-between items-center px-5 py-6 relative z-10 flex-1">
                      <h6 className="text-2xl font-bold text-gray-800 leading-none">
                        ₹ {card.value}
                      </h6>
                      <div className="bg-green-100 outline outline-green-500 text-xs rounded-full px-3 py-1 text-green-600 flex items-center">
                        <i className="fa-solid fa-arrow-up fa-xs mr-1"></i>
                        3.2%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Donut Chart */}
              {/* Donut Chart */}
              <div className="flex justify-center items-start">
                <div className="w-full max-w-[380px] p-6 rounded-xl backdrop-blur-xl shadow-[0_4px_20px_rgba(255,192,203,0.25)] transform transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_25px_rgba(255,192,203,0.35)]">
                  <DonutChart data={cardData?.transactionStatusCounts} />
                </div>


              </div>

              {/* Line Chart */}
              <div className="lg:col-span-2 p-6 rounded-xl backdrop-blur-xl shadow-[0_4px_20px_rgba(144,238,144,0.25)] transform transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_25px_rgba(144,238,144,0.35)]">
                <LineChart data={cardData?.monthWiseStatusCounts} className="h-[260px]" />
              </div>


              {/* Large Transactions */}
              <div className="flex justify-center">
                <div className="w-full max-w-[380px] p-6 rounded-xl bg-white/30 backdrop-blur-xl shadow-[0_4px_25px_rgba(255,182,193,0.25)] transform transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_30px_rgba(255,182,193,0.35)]">

                  {/* Header with bluish glow */}
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-bold text-black px-3 py-1 rounded-lg bg-[rgba(0,120,255,0.2)] backdrop-blur-sm shadow-[0_0_12px_rgba(0,120,255,0.6)]">
                      Large Transactions
                    </h5>
                  </div>

                  <div className="flow-root">
                    {largeTransactionData?.length > 0 ? (
                      <ul role="list" className="divide-y divide-white/10">
                        {largeTransactionData.map((item, index) => (
                          <li
                            key={index}
                            className={`py-3 sm:py-4 rounded-lg transition-all duration-300 
                hover:shadow-[0_0_15px_rgba(0,180,255,0.5),inset_0_0_10px_rgba(0,180,255,0.2)] 
                bg-[rgba(255,255,255,0.1)]`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-black truncate">
                                  {item.name}
                                </p>
                              </div>
                              <div className="inline-flex items-center text-base font-semibold text-black">
                                <i className="fa-solid fa-arrow-up text-green-500 mr-1"></i> ₹{item.amount}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex flex-col justify-center items-center py-8">
                        <img src={largesttxn} alt="No data" className="opacity-80" style={{ width: "300px" }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>


            </div>
            {/* -------- TABLE -------- */}
            <div className="mt-8 mb-4"> {/* spacing from line chart */}
              {/* <div className="bg-white rounded-lg border border-sky-00 shadow-lg w-full">  */}
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
              {/* </div> */}
            </div>
          </div>
        </div>
      )}
    </>


  );
};