import React, { useState, useRef, useEffect } from "react";

import { useGet } from "../hooks/useGet";
import logo1 from "../images/soulful_logo.png";
import logo_omisha from "../images/logo_omisha.png";
import logo_ebook from "../images/logo_ebook.png";
import { useReactToPrint } from "react-to-print";
import Invoice_ebbok from "../components/Invoice_ebbok";
import Invoice_soulful from "../components/Invoice_soulful";
import Invoice_omisha from "../components/Invoice_omisha";

const companies = {
  company1: {
    name: "Soulful Overseas Pvt Ltd",
    address: "Mumbai, India",
    logo: logo1,
    gst: "22AAAAA0000A1Z5",
    phone: "9999999999",
  },
  company2: {
    name: "Omisha Jewels",
    address: "27 PRESTIGE TOWER INDIRA COMPLEX NAVLAKHA, INDORE Madhya Pradesh, India",
    gst: "23AADCO1523C1Z7",
    phone: "+91 93000 98007",
    logo: logo_omisha,
  },
  company3: {
    name: "Ebookspay",
    address: "316 Laxmi Plaza,Laxmi Industrial Estate,Andheri West,Mumbai, Maharashtra - 400053.",
    gst: "44CCCCC2222C3Z7",
    phone: "7777777777",
    logo: logo_ebook,
  },
};

const Invoice = () => {

  const [txnId, setTxnId] = useState("");
  const [data, setData] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("company1");
  const [searched, setSearched] = useState(false);
  const [apiUrl, setApiUrl] = useState(null);

  const { data: txndata, loading } = useGet(apiUrl);
console.log(txndata);
  const [invoiceNo, setInvoiceNo] = useState("");

  const fetchData = () => {
    if (!txnId) return;
    setSearched(true);
    setApiUrl(`/txn-records-List?id=${txnId}`);
  };

  const invoiceRef = useRef();

  useEffect(() => {
    if (txndata) {
      console.log("API DATA:", txndata);
      setData(txndata);
      setInvoiceNo(generateInvoiceNo());
    } else {
      setData(null);
    }
  }, [txndata]);

  const generateInvoiceNo = () => {
    const date = new Date();

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const random = Math.floor(100 + Math.random() * 900); // 3-digit

    return `INV-${yyyy}${mm}${dd}-${random}`;
  };

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `invoice_${txnId}`,
  });

  const company = companies[selectedCompany];

  const [manualData, setManualData] = useState({
  name: "",
  txn: "",
  rrn: "",
  amount: "",
  date:""
});


const renderInvoice = () => {
  const props = {
    data,
    company,
    invoiceNo,
    invoiceRef,
      manualData,
  setManualData
  };

  switch (selectedCompany) {
    case "company1":
      return <Invoice_soulful {...props} />;

    case "company2":
      return <Invoice_omisha {...props} />;

    case "company3":
      return <Invoice_ebbok {...props} />;

    default:
      return null;
  }
};



  return (
    <div className="p-6">
      <div className="bg-gray-100 shadow-md rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-4  ">

        {/* 🔹 TXN INPUT */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Transaction ID</label>
          <input
            type="text"
            placeholder="Enter TXN ID"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            className="shoadow-md border border-[#e5f0ff] bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-100"
          />
        </div>

        {/* 🔹 FETCH BUTTON */}
        <button
          onClick={fetchData}
          disabled={!txnId || loading}
          className={`mt-5 px-5 py-2 rounded-lg text-white transition flex items-center gap-2
    ${
      loading || !txnId
        ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 cursor-not-allowed"
        : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:opacity-90 shadow-md"
    }`}
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Fetching...
            </>
          ) : (
            "Fetch"
          )}
        </button>

        {/* 🔹 COMPANY SELECT */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Select Company</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-60"
          >
            <option value="company1">Soulful Overseas</option>
            <option value="company2">Omisha Jewels</option>
            <option value="company3">Ebookspay</option>
          </select>
        </div>

        {/* 🔹 DOWNLOAD BUTTON */}
        <button
          onClick={handlePrint}
          // disabled={!data}
          className={`mt-5 px-5 py-2 rounded-lg text-white transition bg-green-600`}
        >
          Download / Print
        </button>

        
<div className="w-[800px] mx-auto mb-3 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg">
  💡 Tip: Double-click on invoice fields to edit 
  <b> Amount, Customer Name, Txn ID,Date and RRN</b>.
</div>
      </div>

      

      {/* {data && renderInvoice()} */}
      {(data || !searched) && renderInvoice()}
      {/* {searched && !data && (
        <div className="w-[800px] mx-auto bg-white border border-red-100 rounded-xl p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            No Data Found
          </h2>

          <p className="text-gray-500">No transaction found for this TXN ID.</p>

          <p className="text-sm text-gray-400 mt-2">
            Please check the ID and try again.
          </p>
        </div>
      )} */}
    </div>
  );
};

export default Invoice;
