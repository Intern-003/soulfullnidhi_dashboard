import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const PayoutStatement = () => {
  const [payoutData, setPayoutData] = useState([]);

  const { data, loading, error } = useGet("/reportrecords-List?product=payout");

  useEffect(() => {
    if (!data?.data) return;

    const statusClasses = {
      pending: "bg-[#dfaf03ff] text-white",
      initiated: "bg-blue-400 text-white",
      success: "bg-[#057034ff] text-white",
      completed: "bg-[#057034ff] text-white",
      failed: "bg-[#ff3366] text-white",
      reversed: "bg-[#ff3366] text-white",
      refunded: "bg-[#ff3366] text-white",
    };

    const sortedData = [...data.data].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
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
            <span>Holder: <b>{item.payer_name}</b></span>
            <span>Account: <b>{item.payer_acc_no}</b></span>
            <span>IFSC: <b>{item.payer_ifsc}</b></span>
            <span>UPI Id: <b>{item.payer_upi ?? "N/A"}</b></span>
            <span>Mobile: <b>{item.payer_mobile}</b></span>
          </div>
        ),

        reference_details: (
          <div className="flex flex-col text-left">
            <span>Payment Mode: <b>{item.payout_mode ?? "null"}</b></span>
            <span>Ref No: <b>{item.refno ?? "null"}</b></span>
            <span>Order ID: <b>{item.mytxnid}</b></span>
            <span>Txnid: <br /><b>{item.txnid}</b></span>
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
                {(Number(item.amount ?? 0) + Number(item.charge ?? 0)).toFixed(2)}
              </b>
            </span>
            <span>
              Closing Wallet Amount: <b>{item.payout_closing_balance ?? 0}</b>
            </span>
            <span>
              Note:{" "}
              <b>
                Debit{" "}
                {(Number(item.amount ?? 0) + Number(item.charge ?? 0)).toFixed(2)}{" "}
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
  }, [data]);

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

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500">
          Error: {error}
        </div>
      ) : (
        <Table
          columns={payoutColumn}
          data={payoutData}
          showStatusFilter={true}
          showExport={true}
          showSearch={false}
          showSelectUserFilter={true}
          showDeleteColumn={false}
          statusList={REPORT_STATUSES}
        />
      )}
    </div>
  );
};

export default PayoutStatement