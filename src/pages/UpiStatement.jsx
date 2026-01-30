import { useState, useEffect, useRef } from "react";
import Table from "../components/Table";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const UpiStatement = () => {
  const [upiData, setUpiData] = useState([]);

  // ─────────────────────────────────────
  // Cursor pagination states
  // ─────────────────────────────────────
  const [rawData, setRawData] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const [entriesPerPage, setEntriesPerPage] = useState(50);
      const lastCursorRef = useRef(null);


  // ─────────────────────────────────────
  // Cursor-based API fetch
  // ─────────────────────────────────────
  const fetchUpiReports = async () => {
    if (!hasMore || loading) return;

        if (cursor !== null && lastCursorRef.current === cursor) return;
  lastCursorRef.current = cursor;  

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const query = new URLSearchParams({
        product: "UPI",
        // per_page: 5000,
        per_page:entriesPerPage,
        ...(cursor && { cursor }),
      }).toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reportrecords-List?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (json?.status) {
          setRawData((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));

          const uniqueNewData = (json.data || []).filter(
            (item) => !existingIds.has(item.id),
          );

          return [...prev, ...uniqueNewData];
        });

        setCursor(json.next_cursor);

        if (!json.next_cursor) {
          setHasMore(false); // all data loaded
        }
      } else {
        throw new Error("Invalid API response");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load UPI statements");
    } finally {
      setLoading(false);
    }
  };

  // First load
  useEffect(() => {
    fetchUpiReports();
  }, []);

  useEffect(() => {
    setRawData([]);
    setCursor(null);
    setHasMore(true);
    setError(null);

      fetchUpiReports(); 
  }, [entriesPerPage]);

    const handleLoadMore = () => {
    if (!hasMore || loading) return;
    fetchUpiReports();
  };

  // Auto-load next chunks
  // useEffect(() => {
  //   if (cursor) fetchUpiReports();
  // }, [cursor]);

  // ─────────────────────────────────────
  // Data formatting (unchanged logic)
  // ─────────────────────────────────────
  useEffect(() => {
    if (!rawData.length) return;

    const statusClasses = {
      pending: "bg-[#dfaf03ff] text-white",
      initiated: "bg-[#0f3cb9ff] text-white",
      success: "bg-[#057034ff] text-white",
      complete: "bg-[#057034ff] text-white",
      failed: "bg-[#ff3366] text-white",
      reversed: "bg-[#ff3366] text-white",
      refunded: "bg-gray-400 text-white",
    };

    const sortedData = [...rawData].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const formattedData = sortedData.map((item) => {
      const d = new Date(item.created_at);

      return {
        id: item.id,
        user_id: item.user_id,
        merchant_details: `${item.user?.name ?? "N/A"} (${item.user_id ?? "N/A"})`,
        status: item.status,
        created_at: item.created_at,

        sqno: (
          <div className="flex flex-col text-left">
            <span><b>{item.id}</b></span>
            <span>
              {d.getDate()} {MONTH_NAMES[d.getMonth()]} {d.getFullYear()}
            </span>
            <span className="text-sm text-gray-500">
              {d.toLocaleTimeString()}
            </span>
          </div>
        ),

        txnid: (
          <div className="flex flex-col text-left">
            <span>Payee VPA: <b>{item.payee_vpa ?? "null"}</b></span>
            <span>Ref No: <b>{item.refno ?? "null"}</b></span>
            <span>Payee Txnid: <b>{item.mytxnid}</b></span>
            <span>TxnId: <b>{item.txnid}</b></span>
          </div>
        ),

        amount: (
          <div className="flex flex-col text-left">
            <span>Amount: <b>{item.amount}</b></span>
            <span>Charges: <b>{item.charge}</b></span>
            <span>GST: <b>{item.gst}</b></span>
            <span>
              Payin Rolling Amount: <b>{item.payin_rolling_amount}</b>
            </span>
          </div>
        ),

        numericAmount: parseFloat(item.amount) || 0,

        showstatus: (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              statusClasses[item.status] ?? "bg-gray-600 text-white"
            }`}
          >
            {item?.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : "N/A"}
          </span>
        ),
      };
    });

    setUpiData(formattedData);
  }, [rawData]);

  // ─────────────────────────────────────
  // Table columns
  // ─────────────────────────────────────
  const upiColumn = [
    { header: "Order Id", accessor: "sqno" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Transaction Details", accessor: "txnid" },
    { header: "Amount / Commission", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div
        className="rounded-lg flex justify-between items-center p-4 shadow-md"
        style={{
          background: "linear-gradient(250deg, #55abe9ff 0%, #00418c 100%)",
        }}
      >
        <h4 className="font-bold text-white text-xl">
          UPI Statement 
        </h4>
      </div>

      {/* Table */}
      {loading && rawData.length === 0 ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500">{error}</div>
      ) : (
        <Table
          columns={upiColumn}
          data={upiData}
          showStatusFilter={true}
          showExport={true}
          showSearch={false}
          showDeleteColumn={false}
          showSelectUserFilter={true}
          statusList={REPORT_STATUSES}

          isServerPaginated={true}
          hasMore={hasMore}
          isLoadingMore={loading}
          onLoadNext={handleLoadMore}
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
        />
      )}

      {/* Loading indicator for next chunks */}
      {loading && rawData.length > 0 && (
        <div className="text-center text-sm text-gray-500 py-4 hidden">
          Loading more UPI records…
        </div>
      )}
    </div>
  );
};

export default UpiStatement;
