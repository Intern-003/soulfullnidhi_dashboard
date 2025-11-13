import { useEffect, useMemo, useState } from "react";
import { DonutChart } from "../components/DonutChart";
import { LineChart } from "../components/LineChart";
import Table from "../components/Table";
import useAutoFetch from "../hooks/useAutoFetch";
import { MONTH_NAMES } from "../constants/Constants";
import DashboardSkeleton from "../components/DashboardSkeleton";
// import nodatafound from "../images/largesttxn.jpg";
import nodatafound from "../images/placeholder.jpeg";


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

  useEffect(() => {
    const formattedTableData = processTableData.map((item, index) => ({
      sqno: index + 1,
      txnid: item.txnid,
      name: item.user.name,
      type: item.product,
      amount: item.amount,
      status: (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800`}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      ),
      time:
        new Date(item.created_at).getDate().toString() +
        " " +
        MONTH_NAMES[new Date(item.created_at).getMonth()] +
        " " +
        new Date(item.created_at).getFullYear() +
        " - " +
        new Date(item.created_at).toLocaleTimeString(),
    }));
    setTransactionData(formattedTableData);

    const formattedLargeTransactionData = processLargeTransactionData.map(
      (item) => ({
        name: item.user.name,
        amount: item.amount,
      })
    );
    setLargeTransactionData(formattedLargeTransactionData);
  }, [processTableData, processLargeTransactionData]);

  useEffect(() => {
    if (!recordLoading && cardData) setInitialLoad(false);
  }, [recordLoading, cardData]);

  const transactioncolumn = [
    { header: "SQ No.", accessor: "sqno" },
    { header: "TXN Id", accessor: "txnid" },
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
    { header: "Time", accessor: "time" },
  ];

  return (
    <>
      {initialLoad ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
              <div className="m-5 relative bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-6 bg-blue-500 text-white relative z-10 rounded-b-xl">
                  <div className="bg-white rounded-full p-3">
                    <i className="fa-solid fa-wallet text-blue-500 fa-lg"></i>
                  </div>
                  <h5 className="text-lg font-semibold tracking-tight">
                    Total Pay-IN Collection
                  </h5>
                </div>

                <svg
                  className="absolute bottom-0 w-full"
                  viewBox="0 0 500 50"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0 C250,50 250,50 500,0 L500,50 L0,50 Z"
                    className="fill-gray-400"
                  />
                </svg>

                <div className="flex justify-between items-center p-6 relative z-10">
                  <h6 className="text-2xl font-bold text-gray-800">
                    ₹ {cardData?.total_payin_amount ?? 0}
                  </h6>
                  <div className="bg-green-100 outline outline-green-500 font-small text-xs rounded-full px-1 py-1 text-green-500 flex items-center">
                    <i className="fa-solid fa-arrow-up fa-sm mr-1"></i>
                    3.2%
                  </div>
                </div>
              </div>

              <div className="m-5 relative bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-6 bg-blue-500 text-white relative z-10 rounded-b-xl">
                  <div className="bg-white rounded-full p-3">
                    <i className="fa-solid fa-wallet text-blue-500 fa-lg"></i>
                  </div>
                  <h5 className="text-lg font-semibold tracking-tight">
                    Total Pay-OUT
                  </h5>
                </div>

                <svg
                  className="absolute bottom-0 w-full"
                  viewBox="0 0 500 50"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0 C250,50 250,50 500,0 L500,50 L0,50 Z"
                    className="fill-gray-400"
                  />
                </svg>

                <div className="flex justify-between items-center p-6 relative z-10">
                  <h6 className="text-2xl font-bold text-gray-800">
                    ₹ {cardData?.total_payout_amount ?? 0}
                  </h6>
                  <div className="bg-green-100 outline outline-green-500 font-small text-xs rounded-full px-1 py-1 text-green-500 flex items-center">
                    <i className="fa-solid fa-arrow-up fa-sm mr-1"></i>
                    3.2%
                  </div>
                </div>
              </div>

              <div className="m-5 relative bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-6 bg-blue-500 text-white relative z-10 rounded-b-xl">
                  <div className="bg-white rounded-full p-3">
                    <i className="fa-solid fa-arrow-trend-up text-blue-500 fa-lg"></i>
                  </div>
                  <h5 className="text-lg font-semibold tracking-tight">
                    Today Pay-IN Collection
                  </h5>
                </div>

                <svg
                  className="absolute bottom-0 w-full"
                  viewBox="0 0 500 50"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0 C250,50 250,50 500,0 L500,50 L0,50 Z"
                    className="fill-gray-400"
                  />
                </svg>

                <div className="flex justify-between items-center p-6 relative z-10">
                  <h6 className="text-2xl font-bold text-gray-800">
                    ₹ {cardData?.today_payin ?? 0}
                  </h6>
                  <div className="bg-green-100 outline outline-green-500 font-small text-xs rounded-full px-1 py-1 text-green-500 flex items-center">
                    <i className="fa-solid fa-arrow-up fa-sm mr-1"></i>
                    3.2%
                  </div>
                </div>
              </div>

              <div className="m-5 relative bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-6 bg-blue-500 text-white relative z-10 rounded-b-xl">
                  <div className="bg-white rounded-full p-3">
                    <i className="fa-solid fa-arrow-trend-up text-blue-500 fa-lg"></i>
                  </div>
                  <h5 className="text-lg font-semibold tracking-tight">
                    Today Pay-OUT
                  </h5>
                </div>

                <svg
                  className="absolute bottom-0 w-full"
                  viewBox="0 0 500 50"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0 C250,50 250,50 500,0 L500,50 L0,50 Z"
                    className="fill-gray-400"
                  />
                </svg>

                <div className="flex justify-between items-center p-6 relative z-10">
                  <h6 className="text-2xl font-bold text-gray-800">
                    ₹ {cardData?.today_payout ?? 0}
                  </h6>
                  <div className="bg-green-100 outline outline-green-500 font-small text-xs rounded-full px-1 py-1 text-green-500 flex items-center">
                    <i className="fa-solid fa-arrow-up fa-sm mr-1"></i>
                    3.2%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <div className="w-full">
                <DonutChart data={cardData?.transactionStatusCounts} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-5">
            <div className="lg:col-span-7">
              <LineChart data={cardData?.monthWiseStatusCounts} />
            </div>

            <div className="lg:col-span-3 flex justify-center">
              <div className="w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-bold leading-none text-gray-900">
                    Large Transactions
                  </h5>
                  {/* <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all
              </a> */}
                </div>

                <div className="flow-root">
                  {largeTransactionData && largeTransactionData.length > 0 ? (
                    <ul role="list" className="divide-y divide-gray-200">
                      {largeTransactionData.map((item, index) => (
                        <li key={index} className="py-3 sm:py-4">
                          <div className="flex items-center">
                            <div className="flex-1 min-w-0 ms-4">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900">
                              ₹{item.amount}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col justify-center items-center " >
                      <img
                        src={nodatafound}
                        alt="No data found"
                        className="opacity-80 "
                        style={{ width: "350px" }}
                      />

                    </div>
                  )}
                </div>
              </div>
            </div>
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
        </>
      )}
    </>
  );
};
