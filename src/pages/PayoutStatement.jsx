import { useState, useEffect, useRef } from "react";
import Table from "../components/Table";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const PayoutStatement = () => {
  const [payoutData, setPayoutData] = useState([]);

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
  const fetchPayoutReports = async () => {
    if (!hasMore || loading) return;

    if (cursor !== null && lastCursorRef.current === cursor) return;
    lastCursorRef.current = cursor;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const query = new URLSearchParams({
        product: "payout",
        // per_page: 5000,
        per_page: entriesPerPage,
        ...(cursor && { cursor }),
      }).toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reportrecords-List?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
      setError("Failed to load payout statements");
    } finally {
      setLoading(false);
    }
  };

  // First load
  useEffect(() => {
    fetchPayoutReports();
  }, []);

  useEffect(() => {
    setRawData([]);
    setCursor(null);
    setHasMore(true);
    setError(null);

    fetchPayoutReports();
  }, [entriesPerPage]);

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    fetchPayoutReports();
  };

  // Auto-load next chunks
  // useEffect(() => {
  //   if (cursor) fetchPayoutReports();
  // }, [cursor]);

  // ─────────────────────────────────────
  // Data formatting (UNCHANGED LOGIC)
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
      refunded: "bg-[#ff3366] text-white",
    };

    const sortedData = [...rawData].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    const formattedData = sortedData.map((item) => {
      const d = new Date(item.created_at);

      return {
        /* ================= REQUIRED BY TABLE ================= */
        id: item.id,
        user_id: item.user_id,
        merchant_details: `${item.user?.name ?? "N/A"} (${item.user_id ?? "N/A"})`,
        status: item.status,

        /* ================= RAW DATE (FILTER / EXPORT) ================= */
        created_at: item.created_at,

        /* ================= UI FIELDS ================= */
        sqno: (
          <div className="flex flex-col text-left">
            <span>
              <b>{item.id}</b>
            </span>
            <span>
              {d.getDate()} {MONTH_NAMES[d.getMonth()]} {d.getFullYear()}
            </span>
            {/* <span className="text-sm text-gray-500">
              {d.toLocaleTimeString()}
            </span> */}
            <span className="text-sm text-gray-500">
              {d
                .toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                .toUpperCase()}
            </span>
          </div>
        ),

        txnid: (
          <div className="flex flex-col text-left">
            <span>
              Holder: <b>{item.payer_name}</b>
            </span>
            <span>
              Account: <b>{item.payer_acc_no}</b>
            </span>
            <span>
              IFSC: <b>{item.payer_ifsc}</b>
            </span>
            <span>
              UPI Id: <b>{item.payer_upi ?? "N/A"}</b>
            </span>
            <span>
              Mobile: <b>{item.payer_mobile}</b>
            </span>
          </div>
        ),

        reference_details: (
          <div className="flex flex-col text-left">
            <span>
              Payment Mode: <b>{item.payout_mode ?? "null"}</b>
            </span>
            <span>
              Ref No: <b>{item.refno ?? "null"}</b>
            </span>
            <span>
              Order ID: <b>{item.mytxnid}</b>
            </span>
            <span>
              Txnid: <br />
              <b>{item.txnid}</b>
            </span>
          </div>
        ),

        amount: (
          <div className="flex flex-col text-left">
            <span>
              Opening Wallet Amount: <b>{item.payout_opening_balance ?? 0}</b>
            </span>
            <span>
              Pay Amount: <b>{item.amount}</b>
            </span>
            <span>
              Total Charges: <b>{item.charge ?? 0}</b>
            </span>
            <span>
              Total Debited Amount:{" "}
              <b>
                {(Number(item.amount ?? 0) + Number(item.charge ?? 0)).toFixed(
                  2,
                )}
              </b>
            </span>
            <span>
              Closing Wallet Amount: <b>{item.payout_closing_balance ?? 0}</b>
            </span>
            <span>
              Note:{" "}
              <b>
                Debit{" "}
                {(Number(item.amount ?? 0) + Number(item.charge ?? 0)).toFixed(
                  2,
                )}{" "}
                to Payout Wallet
              </b>
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
            {item.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : "N/A"}
          </span>
        ),
      };
    });

    setPayoutData(formattedData);
  }, [rawData]);

  // ─────────────────────────────────────
  // Table columns
  // ─────────────────────────────────────
  const payoutColumn = [
    { header: "Order ID", accessor: "sqno" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Bank Details", accessor: "txnid" },
    { header: "Reference Details", accessor: "reference_details" },
    { header: "Amount / Commission", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div
        className="rounded-lg flex justify-between items-center p-4 shadow-md"
        style={{
          background: "linear-gradient(250deg, #55abe9ff 0%, #00418c 100%)",
        }}
      >
        <h4 className="font-bold text-white text-xl">Payout Statement</h4>
      </div>

      {loading && rawData.length === 0 ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500">{error}</div>
      ) : (
        // <Table
        //   columns={payoutColumn}
        //   data={payoutData}
        //   showStatusFilter={true}
        //   showExport={true}
        //   showSearch={false}
        //   showSelectUserFilter={true}
        //   showDeleteColumn={false}
        //   statusList={REPORT_STATUSES}
        // />
        <Table
          columns={payoutColumn}
          data={payoutData}
          showStatusFilter={true}
          showExport={true}
          showSearch={false}
          showSelectUserFilter={true}
          showDeleteColumn={false}
          statusList={REPORT_STATUSES}
          isServerPaginated={true}
          hasMore={hasMore}
          isLoadingMore={loading}
          onLoadNext={handleLoadMore}
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
        />
      )}

      {loading && rawData.length > 0 && (
        <div className="text-center text-sm text-gray-500 py-4 hidden">
          Loading more payout records…
        </div>
      )}
    </div>
  );
};

export default PayoutStatement;
