import React, { useState } from 'react';
import logo1 from "../images/soulful_logo.png";


const Invoice_soulful = ({ data, company, invoiceNo, invoiceRef,  manualData,
  setManualData }) => {

        const bookNames = [
  "Code Smarter",
  "The Startup Playbook",
  "Introduction to Programming",
  "Web Development Bootcamp",
  "Thinking, Fast and Slow",
  "Theory of Fun for Game Design",
  "The Psychology of Investing"
];
const randomBook =
  bookNames[Math.floor(Math.random() * bookNames.length)];
const [isEditingTxn, setIsEditingTxn] = useState(false);


const [isEditingRrn, setIsEditingRrn] = useState(false);


const [isEditingAmount, setIsEditingAmount] = useState(false);


const [isEditingName, setIsEditingName] = useState(false);

const [isEditingDate, setIsEditingDate] = useState(false);

const finalAmount = data?.data?.amount || manualData.amount || 0;
  return (
    <>
      <style>
        {`
        @media print {
          body * { visibility: hidden; }
          #invoice-print, #invoice-print * { visibility: visible; }
          #invoice-print { position: absolute; left: 0; top: 0; width: 210mm; }
          @page { size: A4; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        `}
      </style>

      <div
        id="invoice-print"
        ref={invoiceRef}
        style={{
          width: "210mm",
          minHeight: "297mm",
          background: "#fff",
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          position: "relative",
          margin: "auto",
          boxSizing: "border-box",
          paddingBottom: "60px"
        }}
      >
        {/* --- BLUE HEADER SECTION --- */}
        <div style={{ background: "#0078bd", height: "160px", position: "relative", color: "#fff", padding: "30px 50px", overflow: "hidden" }}>
          {/* Geometric Overlay Background */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.2 }}>
             {/* This replicates the diagonal light blue stripes */}
            <div style={{ position: "absolute", width: "80px", height: "300px", background: "#fff", transform: "rotate(45deg)", top: "-50px", left: "10%" }}></div>
            <div style={{ position: "absolute", width: "60px", height: "300px", background: "#fff", transform: "rotate(45deg)", top: "-50px", left: "20%" }}></div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
               {/* Simplified Logo Box */}
              {/* <div style={{ width: "50px", height: "50px", border: "4px solid #fff", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>✓</span>
              </div> */}
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", textTransform: "uppercase" }}>
                {company.name || "Soulful Overseas Pvt. Ltd."}
              </h2>
            </div>
                <div style={{ textAlign: "right", fontSize: "14px" }}>              
                    <img 
                        src={logo1} 
                        alt="logo" 
                        style={{ 
                        height: "100px", // Smaller height to sit nicely next to the name
                        width: "auto",
                        objectFit: "contain",
                        filter: "brightness(0) invert(1)" 
                        }}/>
                </div>
          </div>
        </div>

        {/* --- MAIN TITLE --- */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h1 style={{ fontSize: "70px", color: "#006aa6", margin: 0, letterSpacing: "2px", fontWeight: "900" }}>INVOICE</h1>
        </div>

        {/* --- ISSUED TO & DATES --- */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "40px 60px", color: "#445a73" }}>
          <div>
            <b style={{ color: "#006aa6" }}>ISSUED TO:</b>
            {/* <p style={{ margin: "5px 0", fontSize: "18px" }}> {customerName || "Customer"}</p> */}
 <p
  onDoubleClick={() => {
    if (!data?.data?.name) {
      setIsEditingName(true);
    }
  }}
>
  {isEditingName ? (
    <input
      value={manualData.name}
      onChange={(e) =>
        setManualData({ ...manualData, name: e.target.value })
      }
      onBlur={() => setIsEditingName(false)}
    />
  ) : (
    data?.data?.name || manualData.name || "Customer"
  )}
</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "5px 0" }}><b style={{ color: "#006aa6" }}>INVOICE NO:</b> {invoiceNo || "03964"}</p>
            {/* <p style={{ margin: "5px 0" }}><b style={{ color: "#006aa6" }}>DATE:</b> {data?.data?.created_at || " - "}</p> */}
<p
  onDoubleClick={() => {
    if (!data?.data?.created_at) {
      setIsEditingDate(true);
    }
  }}
>
  <b>DATE:</b>{" "}

  {isEditingDate ? (
    <input
      type="date"
      value={manualData.date}
      onChange={(e) =>
        setManualData({ ...manualData, date: e.target.value })
      }
      onBlur={() => setIsEditingDate(false)}
    />
  ) : (
    data?.data?.created_at || manualData.date || "-"
  )}
</p>


<p
  style={{ margin: "5px 0", cursor: "pointer" }}
  onDoubleClick={() => {
    if (!data?.data?.mytxnid) {
      setIsEditingTxn(true);
    }
  }}
>
  <b style={{ color: "#006aa6" }}>Txn no.:</b>{" "}

 {isEditingTxn ? (
  <input
    value={manualData.txn}
    onChange={(e) =>
      setManualData({ ...manualData, txn: e.target.value })
    }
    onBlur={() => setIsEditingTxn(false)}
  />
) : (
  data?.data?.mytxnid || manualData.txn || "-"
)}
</p>   
         {/* <p style={{ margin: "5px 0" }}><b style={{ color: "#006aa6" }}>RRN.</b> {data?.data?.refno || " - "}</p> */}


    <p
  style={{ margin: "5px 0", cursor: "pointer" }}
  onDoubleClick={() => {
    if (!data?.data?.refno) {
      setIsEditingRrn(true);
    }
  }}
>
  <b style={{ color: "#006aa6" }}>RRN:</b>{" "}

{isEditingRrn ? (
  <input
    value={manualData.rrn}
    onChange={(e) =>
      setManualData({ ...manualData, rrn: e.target.value })
    }
    onBlur={() => setIsEditingRrn(false)}
  />
) : (
  data?.data?.refno || manualData.rrn || "-"
)}
</p>    
          </div>
        </div>

        {/* --- TABLE SECTION --- */}
        <div style={{ padding: "0 60px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0078bd", color: "#fff" }}>
                <th style={{ textAlign: "left", padding: "12px 15px", textTransform: "uppercase" }}>Description</th>
                <th style={{ padding: "12px 15px", textTransform: "uppercase" }}>MRP</th>
                <th style={{ padding: "12px 15px", textTransform: "uppercase" }}>Qty</th>
                <th style={{ textAlign: "right", padding: "12px 15px", textTransform: "uppercase" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "20px 15px", borderBottom: "2px solid #0078bd", fontWeight: "500" }}>
                  {randomBook}
                </td>
<td
  style={{ textAlign: "center", padding: "20px 15px", borderBottom: "2px solid #0078bd", cursor: "pointer" }}
  onDoubleClick={() => {
    if (!data?.data?.amount) {
      setIsEditingAmount(true);
    }
  }}
>
{isEditingAmount ? (
  <input
    type="number"
    value={manualData.amount}
    onChange={(e) =>
      setManualData({ ...manualData, amount: e.target.value })
    }
    onBlur={() => setIsEditingAmount(false)}
  />
) : (
  finalAmount
)}
</td>                <td style={{ textAlign: "center", padding: "20px 15px", borderBottom: "2px solid #0078bd" }}>1</td>
                <td style={{ textAlign: "right", padding: "20px 15px", borderBottom: "2px solid #0078bd" }}>{finalAmount} Rs</td>
              </tr>
            </tbody>
          </table>

          {/* TOTALS */}
          <div style={{ marginLeft: "auto", width: "100%", marginTop: "20px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 15px", fontWeight: "bold", fontSize: "18px" }}>
                <span>SUBTOTAL</span>
                <span>{finalAmount} Rs</span>
             </div>
             <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 15px", color: "#006aa6" }}>
                <span style={{ marginLeft: "auto", marginRight: "60px" }}>Tax</span>
                <span>0%</span>
             </div>
             <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "#0078bd", color: "#fff", marginTop: "10px", fontWeight: "bold" }}>
                <span>TOTAL</span>
                <span>{finalAmount} Rs</span>
             </div>
          </div>
        </div>

        {/* --- FOOTER INFO --- */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "60px", fontSize: "12px", lineHeight: "1.5" }}>
          <div style={{ width: "45%" }}>
            <b style={{ fontSize: "14px" }}>BILLED BY</b>
            <p style={{ marginTop: "10px" }}>
              {company.name}<br />
             Shop No 27 Prestige tower Nawlakha,
Indore, Madhya Pradesh, India -
452001<br />
              GSTIN: 23AAXCS9961L1ZA<br />
              {/* PAN: {company.pan || "AAXCS996IL"}<br /> */}
              Phone: +91 98260 98007
            </p>
          </div>
          <div style={{ width: "45%" }}>
            <b style={{ fontSize: "14px" }}>TERMS & CONDITIONS</b>
            <p style={{ marginTop: "10px" }}>
              1. Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.<br />
              2. Please quote invoice number when remitting funds.
            </p>
          </div>
        </div>

        {/* --- BOTTOM STRIPE DESIGN --- */}
        <div style={{ position: "absolute", bottom: 0, width: "100%", height: "40px", background: "#0078bd", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", boxSizing: "border-box", color: "#fff", fontSize: "10px" }}>
           <span>This is an electronically generated document, no signature is required.</span>
           <span>Powered By: {company.name}</span>
        </div>
      </div>
    </>
  );
};

export default Invoice_soulful;