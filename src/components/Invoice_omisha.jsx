import React, { useState } from "react";
import logo_omisha from "../images/logo_omisha.png";

const Invoice_omisha = ({ data, company, invoiceNo, invoiceRef, manualData,
  setManualData  }) => {

    const [isEditingTxn, setIsEditingTxn] = useState(false);
    
    
    const [isEditingRrn, setIsEditingRrn] = useState(false);
    
    
    const [isEditingAmount, setIsEditingAmount] = useState(false);
    
    
    const [isEditingName, setIsEditingName] = useState(false);
    
    const [isEditingDate, setIsEditingDate] = useState(false);
    
    const finalAmount = data?.data?.amount || manualData.amount || 0;


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
  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        
        @media print {
          body * { visibility: hidden; }
          #invoice-print, #invoice-print * { visibility: visible; }
          #invoice-print { position: absolute; left: 0; top: 0; }
          @page { size: A4; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }

        .gold-corner-shape {
            position: absolute;
            bottom: -1px;
            left: -1px;
            width: 320px;
            height: 200px;
            overflow: hidden;
            pointer-events: none;
        }

        /* The overlapping geometric shapes from the image */
        .shape-1 {
            position: absolute;
            bottom: 0; left: 0;
            width: 100%; height: 50%;
            background: linear-gradient(135deg, #e6d5a7 0%, #ffffff 60%);
            clip-path: polygon(0 0, 80% 100%, 0 100%);
        }
        .shape-2 {
            position: absolute;
            bottom: 0; left: 0;
            width: 90%; height: 40%;
            background: linear-gradient(135deg, #d4af37 0%, #c59c33 100%);
            clip-path: polygon(0 20%, 100% 100%, 0 100%);
            opacity: 0.8;
        }
        `}
      </style>

      <div
        id="invoice-print"
        ref={invoiceRef}
        style={{
          width: "210mm",
          height: "297mm",
          background: "#fff", // Dark grey background like your preview
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10mm",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            background: "#fff",
            width: "100%",
            height: "100%",
            padding: "50px",
            boxSizing: "border-box",
            position: "relative",
            fontFamily: "'Inter', sans-serif",
            color: "#333",
          }}
        >
          {/* GOLD BORDER FRAME */}
          <div style={{
            position: 'absolute',
            top: '25px', left: '25px', right: '25px', bottom: '25px',
            border: '1px solid #d4af37',
            pointerEvents: 'none'
          }} />

{/* 🔶 HEADER */}
<div style={{ marginTop: "0px" }}>
  
  {/* TOP ROW: Company Name and Logo side-by-side */}
  <div 
    style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", // Vertically centers name and logo relative to each other
    //   marginBottom: "15px"
     
    }}
  >
    <h2 
      style={{ 
        color: "#c9a13b", 
        fontSize: "20px", 
        margin: 0, 
        fontWeight: "700", 
        letterSpacing: "1px",
        textTransform: "uppercase"
      }}
    >
      OMISHA JEWELS OPC PVT. LTD
    </h2>

    <img 
      src={logo_omisha} 
      alt="logo" 
      style={{ 
        height: "100px", // Smaller height to sit nicely next to the name
        width: "auto",
        objectFit: "contain"
      }} 
    />
  </div>

  {/* BOTTOM ROW: Invoice and Line */}
  <div style={{ display: "flex", alignItems: "center" }}>
    <h1 
      style={{ 
        fontSize: "42px", 
        color: "#c59c33", 
        margin: 0, 
        fontWeight: "700",
        lineHeight: "1" 
      }}
    >
      INVOICE
    </h1>
    
    {/* The decorative line extending to the right edge */}
    <div 
      style={{ 
        flex: 1, 
        height: "1px", 
        background: "#d4af37", 
        marginLeft: "20px",
        opacity: "0.6"
      }} 
    />
  </div>

</div>

          {/* BILLING INFO */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "60px", fontSize: "14px" }}>
            <div>
              <b style={{ fontSize: "16px" }}>BILLED TO:</b>
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
</p>              {/* <p style={{ margin: "5px 0", fontSize: "16px" }}>Customer</p> */}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ marginBottom: "5px" }}><b style={{ fontSize: "16px" }}>Invoice No. {invoiceNo || '10363'}</b></div>
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
</p> <p
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
</p>            </div>
          </div>

          {/* TABLE */}
          <table style={{ width: "100%", marginTop: "50px", borderCollapse: "collapse", fontSize: "15px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #333" }}>
                <th style={{ textAlign: "left", padding: "12px 0" }}>Description</th>
                <th style={{ textAlign: "center" }}>Quantity</th>
                <th style={{ textAlign: "center" }}>Rate (₹)</th>
                <th style={{ textAlign: "right" }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "15px 0 5px 0", fontWeight: "500" }}>  {randomBook}
</td>
                <td style={{ textAlign: "center" }}>1</td>
                <td style={{ textAlign: "center" }}> {data?.data?.amount || "-"}</td>
                <td style={{ textAlign: "right" }}> {data?.data?.amount || "-"}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                {/* <td style={{ padding: "0 0 15px 0", color: "#666", fontSize: "13px" }}>(The art of Focus)</td> */}
                <td></td><td></td><td></td>
              </tr>
              <tr>
                <td colSpan="3" style={{ textAlign: "right", padding: "20px 40px 0 0", fontWeight: "700" }}>Total</td>
                <td style={{ textAlign: "right", padding: "20px 0 0 0", fontWeight: "700" }}> {data?.data?.amount || "-"}</td>
              </tr>
            </tbody>
          </table>

          {/* FOOTER SECTION */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "100px", fontSize: "12px", lineHeight: "1.6" }}>
            <div style={{ width: "45%" }}>
              <h4 style={{ color: "#c59c33", margin: "0 0 10px 0", fontSize: "14px" }}>BILLED BY</h4>
              <p style={{ margin: 0 }}><b>{company?.name || 'Omisha Jewels OPC Pvt. Ltd'}</b></p>
              <p style={{ margin: 0 }}>{company?.address || 'Shop No 27 Prestige tower Nawlakha, Indore, Madhya Pradesh, India - 452001'}</p>
              <p style={{ margin: 0 }}>GSTIN: {company?.gst || '23AADCO1523C1Z7'}</p>
              <p style={{ margin: 0 }}>Email: omishajewels.opc@gmail.com</p>
              {/* <p style={{ margin: 0 }}>PAN: AADCO1523C</p> */}
              {/* <p style={{ margin: 0 }}>Phone: {company?.phone || '+91 93000 98007'}</p> */}
            </div>

            <div style={{ width: "45%" }}>
              <h4 style={{ color: "#c59c33", margin: "0 0 10px 0", fontSize: "14px" }}>TERMS & CONDITIONS</h4>
              <p style={{ margin: 0 }}>1. Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.</p>
              <p style={{ margin: "5px 0 0 0" }}>2. Please quote invoice number when remitting funds.</p>
            </div>
          </div>

          {/* GOLD CORNER DESIGN ELEMENTS */}
          <div className="gold-corner-shape">
              <div className="shape-1"></div>
              <div className="shape-2"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice_omisha;