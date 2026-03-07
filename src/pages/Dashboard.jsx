import { useEffect, useState, useMemo } from "react";
import { DonutChart } from "../components/DonutChart";
import { LineChart1 } from "../components/LineChart1";
import Table from "../components/Table";
import useAutoFetch from "../hooks/useAutoFetch";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { useNavigate } from "react-router-dom";
// import { setSafeItem, getSafeItem, removeSafeItem } from "../utils/localSecure";

export const Dashboard = () => {
  const DASHBOARD_LOCK_KEY = "payment_dashboard_logged_in";
  const navigate = useNavigate();

  // ─── Auth states ───
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ─── Cursor pagination states ───
  const [rawRecords, setRawRecords] = useState([]);
  const [currentCursor, setCurrentCursor] = useState(null);   // what we send to API
  const [nextCursor, setNextCursor] = useState(null);         // candidate from last response
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(50);


  // ─── Dashboard states ───
  const [role] = useState(atob(localStorage.getItem("role") || "") || "admin");
  const [transactionData, setTransactionData] = useState([]);
  const [largeTransactionData, setLargeTransactionData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [statusFilter, setStatusFilter] = useState("SUCCESS");

  // ─── APIs ───
  const { data: cardData, loading: recordLoading } = useAutoFetch("/collection-record");

  
  const { data: summaryData, loading: summaryLoading } = useAutoFetch("/collection-summary");
  
const { data: statusCounts, loading: statusLoading } = useAutoFetch("/collection-statuscounts");
const { data: monthwiseData, loading: monthLoading } = useAutoFetch("/collection-monthwise");
const { data: cashfreeData, loading: cashfreeLoading } = useAutoFetch("/collection-cashfree");


  // Dynamic URL for cursor-based pagination
  const getTableUrl = () => {
    const params = new URLSearchParams({
      // per_page: "50",   // ← changed to 150 (good balance)
       per_page: entriesPerPage.toString(),
      ...(currentCursor && { cursor: currentCursor }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
    });
    return `/reportrecords-List?${params.toString()}`;
  };

  const { data: pageData, loading: pageLoading } = useAutoFetch(getTableUrl());

  // Merge incoming page into accumulated records – NO automatic cursor advance
  useEffect(() => {
    if (pageLoading || !pageData) return;

    const newRecords = pageData?.data || pageData?.records || pageData?.result || [];

    setRawRecords((prev) => {
      const seen = new Set(prev.map((r) => r.txnid || r.id || r._id));
      const uniqueNew = newRecords.filter((r) => !seen.has(r.txnid || r.id || r._id));
      return [...prev, ...uniqueNew];
    });

    // Only store next cursor – wait for user to click Load More
    const candidate = pageData?.next_cursor || pageData?.next || pageData?.next_page || null;
    setNextCursor(candidate);
    setHasMore(!!candidate);

    setIsLoadingMore(false); // re-enable button
  }, [pageData, pageLoading]);

  // Reset pagination on mount
  useEffect(() => {
    setRawRecords([]);
    setCurrentCursor(null);
    setNextCursor(null);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [entriesPerPage]);

  // ─── Load More Handler ───
  const handleLoadMore = () => {
    if (!nextCursor || pageLoading || isLoadingMore) return;
    
    setIsLoadingMore(true);
    setCurrentCursor(nextCursor); // This triggers new fetch via useAutoFetch
  };

  // ─── Data processing ───
  const sortedRecords = useMemo(() => {
    return [...rawRecords].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [rawRecords]);

  const filteredTableData = useMemo(() => {
    if (statusFilter === "ALL") return sortedRecords;
    return sortedRecords.filter(
      (item) => (item.status || "").toUpperCase() === statusFilter
    );
  }, [sortedRecords, statusFilter]);

  const topLargeTransactions = useMemo(() => {
    return [...rawRecords]
      .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))
      .slice(0, 4);
  }, [rawRecords]);

  // ─── Format table rows + large transactions ───
  useEffect(() => {
    const formatted = filteredTableData.map((item, index) => {
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

      const statusUpper = (item.status || "UNKNOWN").toUpperCase();
      let statusClass = "bg-gray-100 text-gray-700 border-gray-300 font-medium";

      switch (statusUpper) {
        case "SUCCESS":
        case "COMPLETED":
          statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold";
          break;
        case "PENDING":
        case "INITIATED":
          statusClass = "bg-amber-50 text-amber-700 border-amber-200 font-semibold";
          break;
        case "FAILED":
        case "REVERSED":
        case "REFUNDED":
          statusClass = "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
          break;
        default:
          break;
      }

      return {
        sqno: index + 1,
        txnid: item.txnid || "—",
        name: `${item.user?.name ?? "N/A"} (${item.user_id ?? "N/A"})`,
        type: item.product || "—",
        amount: item.amount,
        status: (
          <span
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border shadow-sm ${statusClass}`}
          >
            {statusUpper}
          </span>
        ),
        time: (
          <div className="flex flex-col leading-tight">
            <span className="font-medium text-gray-900">{formattedDate}</span>
            <span className="text-xs text-gray-500 mt-0.5">{formattedTime}</span>
          </div>
        ),
      };
    });

    setTransactionData(formatted);

    const formattedLarge = topLargeTransactions.map((item) => ({
      name: `${item.user?.name ?? "N/A"} (${item.user_id ?? "N/A"})`,
      product: item.product,
      amount: item.amount,
    }));

    setLargeTransactionData(formattedLarge);
  }, [filteredTableData, topLargeTransactions]);

  // ─── Auth check ───
  useEffect(() => {
    const checkAuthentication = () => {
      const lock = JSON.parse(localStorage.getItem(DASHBOARD_LOCK_KEY) || "{}");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      // const user = getSafeItem("user");

      const isValid =
        lock?.userId &&
        user?.id &&
        lock.userId === user.id &&
        user.id !== undefined;

      setIsAuthenticated(isValid);
      setIsCheckingAuth(false);

      if (!isValid) {
        navigate("/", { replace: true });
      }
    };

    const timer = setTimeout(checkAuthentication, 150);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem(DASHBOARD_LOCK_KEY);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (!recordLoading && cardData) setInitialLoad(false);
  }, [recordLoading, cardData]);

const cardsToShow = useMemo(() => [
  { title: "Today Pay-IN", value: summaryData?.today_payin ?? "00" },
  { title: "Total Pay-IN", value: summaryData?.total_payin ?? "00" },
  { title: "Today Pay-OUT", value: summaryData?.today_payout ?? "00"},
  { title: "Total Pay-OUT", value: summaryData?.total_payout ?? "00" },
], [summaryData]);

const donutData = useMemo(() => statusCounts || [], [statusCounts]);
const lineChartData = useMemo(() => monthwiseData || [], [monthwiseData]);


  const formatRupee = (value) => {
    const num = Math.round(Number(value || 0));
    return num.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

//   const formatRupee = (value) => {
//   const num = Number(value || 0);

//   if (num >= 10000000) {
//     return `${(num / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
//   }

//   if (num >= 100000) {
//     return `${(num / 100000).toFixed(2).replace(/\.00$/, "")} L`;
//   }

//   return `${num.toLocaleString("en-IN")}`;
// };

  const transactioncolumn = [
    { header: "TXN Id", accessor: "txnid" },
    { header: "Merchant", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
    { header: "Date/Time", accessor: "time" },
  ];

  // ─── Render ───
  // if (isCheckingAuth) return <DashboardSkeleton />;
  // if (!isAuthenticated) return null;
  if(isCheckingAuth || recordLoading || initialLoad){
    return <DashboardSkeleton />
  }
  if (!isAuthenticated) return null;


  
  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100/70 pb-16">
      <div className="mx-auto px-5 sm:px-7 lg:px-10 pt-8 lg:pt-12">
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mb-12">
          {cardsToShow.map((card, i) => {
            const amountStr = formatRupee(card.value);
            let fontClass = "text-xl md:text-xl";
            // const len = amountStr.length;

            // if (len >= 7) fontClass = "text-2.5xl md:text-3.5xl";
            // if (len >= 9) fontClass = "text-2xl md:text-3xl";
            // if (len >= 11) fontClass = "text-xl md:text-2.5xl";
            // if (len >= 13) fontClass = "text-lg md:text-2xl";
            // if (len >= 15) fontClass = "text-base md:text-xl";
            // if (len >= 17) fontClass = "text-sm md:text-lg";
            // if (len >= 19) fontClass = "text-xs md:text-base";
            // if (len >= 21) fontClass = "text-xs md:text-sm";

            return (
              <div
                key={i}
                className={`group relative bg-white rounded-tl-3xl rounded-br-3xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-400 hover:shadow-[0_25px_70px_rgba(0,0,0,0.18)] hover:-translate-y-2 border border-slate-100/80 min-w-0`}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-3 transform -skew-x-12 origin-left"
                  style={{
                    background: "linear-gradient(90deg, rgba(6,76,150,1) 0%, rgba(40,142,214,1) 100%)",
                  }}
                />
                <div className="p-6 pt-9 relative">
                  <h3 className="text-sm font-semibold text-slate-600 mb-2.5 tracking-wider uppercase">
                    {card.title}
                  </h3>
                  <div
                    // className={`${fontClass} font-extrabold text-slate-800 tracking-tight whitespace-nowrap overflow-hidden max-w-full w-full`}
    className="font-bold text-slate-800 whitespace-nowrap w-full tabular-nums text-[clamp(10px,1.5vw,20px)]"

                    title={`₹${amountStr}`}
                  >
                    ₹{amountStr}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
  {role === "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 mb-12">
          {/* Line chart */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-slate-100/80 p-6 lg:p-8 overflow-hidden transition-all duration-400 hover:shadow-[0_25px_70px_rgb(0,0,0,0.09)]">
            <h3 className="text-2xl font-semibold text-slate-800 mb-8 relative inline-block">
              Monthly Performance
              <span className="absolute -bottom-2.5 left-0 w-16 h-1 bg-gradient-to-r from-blue-500/50 to-indigo-500/50 rounded-full" />
            </h3>
           
            <div className="h-[400px] lg:h-[440px] -mx-2">
              {/* <LineChart1 data={cardData?.monthWiseStatusCounts} /> */}
              < LineChart1 data={lineChartData}/>
            </div>
             
          </div>
          {/* Donut chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-slate-100/80 p-6 lg:p-8 transition-all duration-400 hover:shadow-[0_25px_70px_rgb(0,0,0,0.09)]">
            <h3 className="text-2xl font-semibold text-slate-800 mb-8 relative inline-block">
              Status Distribution
              <span className="absolute -bottom-2.5 left-0 w-16 h-1 bg-gradient-to-r from-rose-500/50 to-pink-500/50 rounded-full" />
            </h3>
            <div className="h-[400px] flex items-center justify-center">
              {/* <DonutChart data={cardData?.transactionStatusCounts || []} /> */}
              <DonutChart data={donutData}/>
            </div>
          </div>
        </div>
       )}

        {/* TABLE SECTION */}
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-slate-100/80 overflow-hidden">
          <div className="px-7 py-6 border-b border-slate-100/80 bg-slate-50/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <h3 className="text-2xl font-semibold text-slate-800">Transaction History</h3>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-6 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[200px] transition-all shadow-sm hover:border-blue-300 appearance-none cursor-pointer"
                >
                  <option value="ALL">All Status</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                  <option value="PENDING">Pending</option>
                  <option value="REVERSED">Reversed</option>
                  <option value="REFUNDED">Refunded</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="INITIATED">Initiated</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={transactioncolumn}
              data={transactionData}
              showSearch={false}
              showPagination={true}
              showExport={false}
              showStatusFilter={false}
              showDeleteColumn={false}
              showDateFilter={false}

              isServerPaginated={true}           // Tell Table to use server logic
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadNext={handleLoadMore}
              pageLoading={pageLoading}

              
              entriesPerPage={entriesPerPage}
              setEntriesPerPage={setEntriesPerPage}
            />

          
          </div>
        </div>
      </div>
    </div>
  );
};