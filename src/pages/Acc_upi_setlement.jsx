import { useState, useEffect, useRef } from "react";
import Table from "../components/Table";
import { REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const Acc_upi_setlement = () => {
  const [payinSettlementData, setPayinSettlementData] = useState([]);

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
  const fetchPayinSettlement = async () => {
    if (!hasMore || loading) return;
    if (cursor !== null && lastCursorRef.current === cursor) return;
    lastCursorRef.current = cursor;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const query = new URLSearchParams({
        product: "payin_settlement",
        per_page: entriesPerPage,
        ...(cursor && { cursor }),
      }).toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reportrecords-List?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();

      if (json?.status) {
        setRawData((prev) => {
          const ids = new Set(prev.map((i) => i.id));
          const unique = json.data.filter((i) => !ids.has(i.id));
          return [...prev, ...unique];
        });

        setCursor(json.next_cursor);
        if (!json.next_cursor) setHasMore(false);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load Payin Settlement");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPayinSettlement();
  }, []);

  // Reload when page size changes
  useEffect(() => {
    setRawData([]);
    setCursor(null);
    setHasMore(true);
    lastCursorRef.current = null;
    fetchPayinSettlement();
  }, [entriesPerPage]);

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    fetchPayinSettlement();
  };

  // ─────────────────────────────────────
  // Format data for Table
  // ─────────────────────────────────────
  useEffect(() => {
    if (!rawData.length) return;

    const statusClasses = {
      pending: "bg-[#dfaf03ff] text-white",
      initiated: "bg-blue-400 text-white",
      success: "bg-[#057034ff] text-white",
      completed: "bg-[#057034ff] text-white",
      failed: "bg-[#ff3366] text-white",
      reversed: "bg-[#ff3366] text-white",
      refunded: "bg-gray-400 text-white",
    };

    const formatted = rawData.map((item, index) => {
      const d = new Date(item.created_at);

      return {
        id: item.id,
        user_id: item.user_id,
        merchant_details: `${item.user?.name ?? "N/A"} (${item.user_id})`,
        status: item.status,
        created_at: item.created_at,
        sqno: index + 1,
        txnid: item.txnid ?? "N/A",
        product_type: item.product ?? "N/A",
        amount: item.amount ?? "N/A",
        numericAmount: parseFloat(item.amount) || 0,

        date: (
          <div className="flex flex-col w-28">
            <span className="text-sm font-medium">
              {d.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              })}
            </span>
            <span className="text-sm text-gray-500">
              {d.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        ),

        payin_opening_balance: item.payin_opening ?? "0.0",
        payin_closing_balance: item.payin_closing ?? "0.0",

        showstatus: (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              statusClasses[item.status] ?? "bg-gray-100 text-gray-800"
            }`}
          >
            {item.status}
          </span>
        ),
      };
    });

    setPayinSettlementData(formatted);
  }, [rawData]);

  // ─────────────────────────────────────
  // Table columns
  // ─────────────────────────────────────
  const payinSettlementColumn = [
    { header: "SQ NO", accessor: "id" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Transaction Id", accessor: "txnid" },
    { header: "Product Type", accessor: "product_type" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
    { header: "Date", accessor: "date" },
    { header: "Opening Bal", accessor: "payin_opening_balance" },
    { header: "Closing Bal", accessor: "payin_closing_balance" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div
        className="rounded-lg flex justify-between items-center p-4 shadow-md"
        style={{
          background: "linear-gradient(250deg, #55abe9ff 0%, #00418c 100%)",
        }}
      >
        <h4 className="font-bold text-white text-lg sm:text-xl">
          Payin Settlement Statement
        </h4>
      </div>

      {loading && rawData.length === 0 ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500">{error}</div>
      ) : (
        <Table
          columns={payinSettlementColumn}
          data={payinSettlementData}
          showStatusFilter
          showExport
          showSearch={false}
          showSelectUserFilter
          showDateFilter
          showDeleteColumn={false}
          statusList={REPORT_STATUSES}
          isServerPaginated
          hasMore={hasMore}
          isLoadingMore={loading}
          onLoadNext={handleLoadMore}
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
        />
      )}
    </div>
  );
};

export default Acc_upi_setlement;
