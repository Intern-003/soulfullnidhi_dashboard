import { useEffect, useState, useMemo } from "react";
import { DonutChart } from "../components/DonutChart";
import { LineChart1 } from "../components/LineChart1";
import Table from "../components/Table";
import useAutoFetch from "../hooks/useAutoFetch";
import { MONTH_NAMES } from "../constants/Constants";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const DASHBOARD_LOCK_KEY = "payment_dashboard_logged_in";

  const navigate = useNavigate();

  // ──────────────────────────────────────────────────────
  // 1. Auth checking state
  // ──────────────────────────────────────────────────────
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ──────────────────────────────────────────────────────
  // 2. Main dashboard states
  // ──────────────────────────────────────────────────────
  const [role] = useState(atob(localStorage.getItem("role") || "") || "admin");

  const [transactionData, setTransactionData] = useState([]);
  const [largeTransactionData, setLargeTransactionData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const [statusFilter, setStatusFilter] = useState("SUCCESS");

  // APIs
  const { data: cardData, loading: recordLoading } = useAutoFetch("/collection-record");
  const { data: tableData } = useAutoFetch("/reportrecords-List");

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

  // Top 4 largest transactions
  const processLargeTransactionData = useMemo(() => {
    return [...initialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [initialDataOfTransactions]);

  // ──────────────────────────────────────────────────────
  // 3. Authentication check (runs once on mount)
  // ──────────────────────────────────────────────────────
  useEffect(() => {
    const checkAuthentication = () => {
      const lock = JSON.parse(localStorage.getItem(DASHBOARD_LOCK_KEY) || "{}");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const isValid =
        lock?.userId &&
        user?.id &&
        lock.userId === user.id &&
        user.id !== undefined;

      setIsAuthenticated(isValid);
      setIsCheckingAuth(false);

      if (!isValid) {
        console.log("Auth check failed → redirecting to login");
        navigate("/", { replace: true });
      } else {
        console.log("Auth check passed");
      }
    };

    const timer = setTimeout(checkAuthentication, 150);
    return () => clearTimeout(timer);
  }, [navigate]);

  // ──────────────────────────────────────────────────────
  // 4. Logout handler
  // ──────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem(DASHBOARD_LOCK_KEY);
    navigate("/", { replace: true });
  };

  // ──────────────────────────────────────────────────────
  // 5. Format table data
  // ──────────────────────────────────────────────────────
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

    setTransactionData(formattedTableData);

    const formattedLarge = processLargeTransactionData.map((item) => ({
      name: `${item.user?.name ?? "N/A"} (${item.user_id ?? "N/A"})`,
      product: item.product,
      amount: item.amount,
    }));

    setLargeTransactionData(formattedLarge);
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
    { title: "Today Pay-IN", value: cardData?.today_payin ?? 0 },
    { title: "Total Pay-IN", value: cardData?.total_payin_amount ?? 0},
    { title: "Today Pay-OUT", value: cardData?.today_payout ?? 0 },
    { title: "Total Pay-OUT", value: cardData?.total_payout_amount ?? 0 },
  ];

  // Optional: human-friendly large number formatting (uncomment if desired)
  /*
  const formatAmount = (value) => {
    if (!value) return "0";
    const num = Number(value);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000)    return `₹${(num / 100000).toFixed(1)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };
  */

  const formatRupee = (value) => {
    const num = Math.round(Number(value || 0));
    return num.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // ──────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────
  if (isCheckingAuth) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/70 pb-16">
      <div className="mx-auto max-w-[1720px] px-5 sm:px-7 lg:px-10 pt-8 lg:pt-12">

        {/* CARDS – aggressive font shrink per digit length */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mb-12">
          {cardsToShow.map((card, i) => {
            const amountStr = formatRupee(card.value);
            let fontClass = "text-2xl md:text-xl";

            const len = amountStr.length;
            if (len >= 7)  fontClass = "text-2.5xl md:text-3.5xl";
            if (len >= 9)  fontClass = "text-2xl md:text-3xl";
            if (len >= 11) fontClass = "text-xl md:text-2.5xl";
            if (len >= 13) fontClass = "text-lg md:text-2xl";
            if (len >= 15) fontClass = "text-base md:text-xl";
            if (len >= 17) fontClass = "text-sm md:text-lg";
            if (len >= 19) fontClass = "text-xs md:text-base";
            if (len >= 21) fontClass = "text-xs md:text-sm";

            return (
              <div
                key={i}
                className={`
                  group relative bg-white rounded-tl-3xl rounded-br-3xl 
                  shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden 
                  transition-all duration-400 hover:shadow-[0_25px_70px_rgba(0,0,0,0.18)]
                  hover:-translate-y-2 border border-slate-100/80
                  min-w-0
                `}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-3 transform -skew-x-12 origin-left"
                  style={{
                    background: "linear-gradient(90deg, rgba(6, 76, 150, 1) 0%, rgba(40, 142, 214, 1) 100%)"
                  }}
                />
                
                <div className="p-6 pt-9 relative">
                  <h3 className="text-sm font-semibold text-slate-600 mb-2.5 tracking-wider uppercase">
                    {card.title}
                  </h3>
                  <div 
                    className={`
                      ${fontClass} font-extrabold text-slate-800 tracking-tight 
                      whitespace-nowrap overflow-hidden 
                      max-w-full w-full
                    `}
                    title={`₹${amountStr}`}
                  >
                    ₹{amountStr}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 mb-12">
          <div className="
            lg:col-span-3 bg-white rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.06)] 
            border border-slate-100/80 p-6 lg:p-8 overflow-hidden
            transition-all duration-400 hover:shadow-[0_25px_70px_rgb(0,0,0,0.09)]
          ">
            <h3 className="text-2xl font-semibold text-slate-800 mb-8 relative inline-block">
              Monthly Performance
              <span className="absolute -bottom-2.5 left-0 w-16 h-1 bg-gradient-to-r from-blue-500/50 to-indigo-500/50 rounded-full" />
            </h3>
            <div className="h-[400px] lg:h-[440px] -mx-2">
              <LineChart1 data={cardData?.monthWiseStatusCounts} />
            </div>
          </div>

          <div className="
            lg:col-span-2 bg-white rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.06)] 
            border border-slate-100/80 p-6 lg:p-8
            transition-all duration-400 hover:shadow-[0_25px_70px_rgb(0,0,0,0.09)]
          ">
            <h3 className="text-2xl font-semibold text-slate-800 mb-8 relative inline-block">
              Status Distribution
              <span className="absolute -bottom-2.5 left-0 w-16 h-1 bg-gradient-to-r from-rose-500/50 to-pink-500/50 rounded-full" />
            </h3>
            <div className="h-[400px] flex items-center justify-center">
              <DonutChart data={cardData?.transactionStatusCounts || []} />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="
          bg-white rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.06)] 
          border border-slate-100/80 overflow-hidden
        ">
          <div className="px-7 py-6 border-b border-slate-100/80 bg-slate-50/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <h3 className="text-2xl font-semibold text-slate-800">
                Transaction History
              </h3>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="
                    bg-white border border-slate-200 text-slate-700 text-sm 
                    rounded-full px-6 py-3 focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 outline-none min-w-[200px] 
                    transition-all shadow-sm hover:border-blue-300
                    appearance-none cursor-pointer
                  "
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};