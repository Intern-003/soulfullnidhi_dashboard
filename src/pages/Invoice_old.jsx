import React, { useState, useRef, useEffect } from "react";

import { useGet } from "../hooks/useGet";
import logo1 from "../images/logo.png";
import logo_omisha from "../images/logo_omisha.png";
import logo_ebook from "../images/logo_ebook.png";
import { useReactToPrint } from "react-to-print";
import Invoice_ebbok from "../components/Invoice_ebbok";
import Invoice_soulful from "../components/Invoice_soulful";
import Invoice_omisha from "../components/Invoice_omisha";

const companies = {
  company1: {
    name: "Soulful Overseas",
    address: "Mumbai, India",
    logo: logo1,
    gst: "22AAAAA0000A1Z5",
    phone: "9999999999",
  },
  company2: {
    name: "Omisha Jewels",
    address: "27 PRESTIGE TOWER INDIRA COMPLEX NAVLAKHA, INDORE Madhya Pradesh, India",
    gst: "33BBBBB1111B2Z6",
    phone: "8888888888",
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
          disabled={!data}
          className={`mt-5 px-5 py-2 rounded-lg text-white transition 
      ${
        data
          ? "bg-green-600 hover:bg-green-700"
          : "bg-gray-400 cursor-not-allowed"
      }`}
        >
          Download / Print
        </button>
      </div>

      {/* 🔹 Invoice UI */}
      {data && (
        <div
          ref={invoiceRef}
          style={{
            width: "800px",
            margin: "auto",
            background: "#fff",
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* 🔷 TOP HEADER */}
<div
  style={{
    background: "#1f78a8",
    color: "#fff",
    padding: "20px",
    position: "relative",
  }}
>
  {/* angled design */}
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: "120px",
      height: "100%",
      background: "#0b5e8a",
      transform: "skewX(-30deg)",
    }}
  />

  {/* HEADER CONTENT */}
  <div
    style={{
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    {/* Left spacer (same width as logo for perfect centering) */}
    <div style={{ width: "60px" }} />

    {/* CENTER COMPANY NAME */}
    <h2 className="uppercase"
      style={{
        margin: 0,
        textAlign: "center",
        flex: 1,
        fontWeight: "600",
        letterSpacing: "1px",
        fontSize:"25px"
      }}
    >
      {company.name}
    </h2>

    {/* RIGHT LOGO */}
    <div
      style={{
        height: "60px",
        width: "60px",
        backgroundColor: "#fff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={company.logo}
        style={{
          height: "40px",
          objectFit: "contain",
        }}
      />
    </div>
  </div>
</div>

          {/* 🔷 BIG TITLE */}
          <div style={{ padding: "30px 40px" }}>
            <h1
              style={{
                fontSize: "48px",
                color: "#1f78a8",
                margin: "0 0 20px 0",
                letterSpacing: "2px",
                textAlign:"center"
              }}
            >
              INVOICE
            </h1>

            {/* 🔹 DETAILS */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
              }}
            >
              <div>
                <p>
                  <b>ISSUED TO:</b>
                </p>
                <p>Customer</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p>
                  <b>INVOICE NO:</b> {invoiceNo}
                </p>
                <p>
                  <b>DATE:</b> {data?.data?.created_at}
                </p>
                <p>
                  <b>TXN ID:</b> {data?.data?.payid}
                </p>
              </div>
            </div>

            {/* 🔹 TABLE */}
            <table
              style={{
                width: "100%",
                marginTop: "30px",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ background: "#1f78a8", color: "#fff" }}>
                  <th style={{ padding: "10px", textAlign: "left" }}>
                    DESCRIPTION
                  </th>
                  <th>MRP</th>
                  <th>QTY</th>
                  <th>TOTAL</th>
                </tr>
              </thead>

              <tbody>
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>Digital Product</td>
                  <td>{data?.data?.amount}</td>
                  <td>1</td>
                  <td>{data?.data?.amount} Rs</td>
                </tr>
              </tbody>
            </table>

            {/* 🔹 SUBTOTAL */}
            <div style={{ marginTop: "30px", textAlign: "right" }}>
              <p>
                <b>SUBTOTAL:</b> {data?.data?.amount} Rs
              </p>
              <p>Tax: 0%</p>
            </div>

            {/* 🔹 TOTAL BAR */}
            <div
              style={{
                background: "#1f78a8",
                color: "#fff",
                padding: "12px",
                marginTop: "10px",
                textAlign: "right",
                fontWeight: "bold",
              }}
            >
              TOTAL: {data?.data?.amount} Rs
            </div>

            {/* 🔹 FOOTER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "40px",
                fontSize: "13px",
              }}
            >
              <div style={{ width: "45%" }}>
                <h4 className="font-bold" style={{fontSize:"17px"}}>BILLED BY</h4>
                <p style={{fontSize:"15px"}}>{company.name}</p>
                <p style={{fontSize:"15px"}}>{company.address}</p>
                {/* <p>GST: {company.gst}</p>
                <p>Phone: {company.phone}</p> */}
              </div>

              <div style={{ width: "45%" }}>
                <h4 className="font-bold" style={{fontSize:"17px"}} >TERMS & CONDITIONS</h4>
                <p style={{fontSize:"15px"}}>1. Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments</p>
                <p style={{fontSize:"15px"}}>2. Please Quote invoice number when remitting funds</p>
              </div>
            </div>
          </div>

          {/* 🔷 BOTTOM DESIGN */}
          <div
            style={{
              height: "20px",
              background: "#1f78a8",
              marginTop: "20px",
            }}
          />
        </div>
      )}
      {searched && !data && (
        <div className="w-[800px] mx-auto bg-white border border-red-100 rounded-xl p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            No Data Found
          </h2>

          <p className="text-gray-500">No transaction found for this TXN ID.</p>

          <p className="text-sm text-gray-400 mt-2">
            Please check the ID and try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default Invoice;
