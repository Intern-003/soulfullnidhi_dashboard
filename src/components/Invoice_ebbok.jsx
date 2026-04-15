    import React, { useRef, useState } from 'react';

    import logo_ebook from "../images/logo.png";
    
    const Invoice_ebbok = ({
      data,
      invoiceNo = "109743",
      invoiceRef,
      manualData: externalManualData,
      setManualData: externalSetManualData,
    }) => {
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

      // Internal state if external state not provided
      const [internalManualData, setInternalManualData] = useState({});
      
      const manualData = externalManualData || internalManualData;
      const setManualData = externalSetManualData || setInternalManualData;

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingTxn, setIsEditingTxn] = useState(false);
  const [isEditingRrn, setIsEditingRrn] = useState(false);



      const handleDoubleClick = (field, value) => {
        const newValue = prompt(`Edit ${field}:`, value);
        if (newValue !== null && newValue.trim() !== '') {
          setManualData(prev => ({ ...prev, [field]: newValue.trim() }));
        } else if (newValue === '') {
          // Remove override if empty
          setManualData(prev => {
            const newData = { ...prev };
            delete newData[field];
            return newData;
          });
        }
      };

      const getDisplayValue = (field, apiValue, fallback = '') => {
        if (manualData[field] !== undefined && manualData[field] !== '') {
          return manualData[field];
        }
        return apiValue || fallback;
      };

      const displayAmount = getDisplayValue('amount', data?.data?.amount, '1000');
      const displayDate = getDisplayValue('date', data?.data?.date, new Date().toLocaleDateString('en-IN'));
      const displayCustomerName = getDisplayValue('name', data?.data?.customerName, 'Customer');
      const displayInvoiceNo = getDisplayValue('invoiceNo', invoiceNo, '109743');

      // Editable field component for cleaner code
      const EditableField = ({ field, value, className = "" }) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            handleDoubleClick(field, value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleDoubleClick(field, value);
            }
          }}
          role="button"
          tabIndex={0}
          style={{
            cursor: 'pointer',
            borderBottom: '1px dashed #a0c4e8',
            padding: '0 2px',
            display: 'inline-block',
          }}
          className={className}
          title="Double-click to edit"
        >
          {value}
        </span>
      );

      return (


        
        <div
          ref={invoiceRef}
          style={{
            width: "750px",
            margin: "auto",
            background: "#fff",
            fontFamily: "Arial, sans-serif",
            position: "relative",
            overflow: "hidden",
            padding: "40px 35px",
            boxSizing: "border-box",
            paddingBottom: "100px", // 👈 ADD THIS

          }}
        >

    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "220px",
      height: "140px",
      background: "#0b3c6f",
      clipPath: "polygon(0 100%, 100% 100%, 0 0)",
      zIndex: 1,
      
    }} />

    <div style={{
      position: "absolute",
      bottom: 0,
      left: "60px",
      width: "140px",
      height: "100px",
      background: "#2aa7df",
      clipPath: "polygon(0 100%, 100% 100%, 0 0)",
      zIndex: 2
    }} />

    {/* HEADER DESIGN */}
    <div style={{ position: "relative", marginBottom: "20px" }}>

      {/* TOP BLUE STRIP */}
      <div style={{
        width: "100%",
        height: "70px",
        background: "#1f57a4",
      }} />

      {/* RIGHT SHAPES */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "220px",
        height: "140px",
        background: "#0b3c6f",
        clipPath: "polygon(100% 0, 30% 0, 100% 100%)",
        zIndex: 2
      }} />

      <div style={{
        position: "absolute",
        top: 0,
        right: "60px",
        width: "140px",
        height: "100px",
        background: "#2aa7df",
        clipPath: "polygon(100% 0, 30% 0, 100% 100%)",
        zIndex: 3
      }} />

      {/* HEADER CONTENT */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "15px 20px",
        marginTop: "-55px", // pulls content over blue strip
        position: "relative",
        zIndex: 4
      }}>
        
        {/* LOGO */}
        {/* <img
          src={logo_ebook} // replace with your actual logo
          alt="logo"
          style={{ height: "50px", marginRight: "12px" }}
        /> */}

        {/* COMPANY NAME */}
        <h2 style={{
          margin: 0,
          color: "#1f57a4",
          fontSize: "20px",
          fontWeight: "700",
          letterSpacing: "1px"
        }}>
          SPAY FINTECH PVT. LTD
        </h2>
      </div>

  {/* CENTER TEXT */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "10px"
    }}
  >
    {/* LOGO + COMPANY NAME (SIDE BY SIDE) */}
    <div className=""
      style={{
        display: "flex",
        alignItems: "left",
        gap: "20px",
      }}
    >
      <img
        src={logo_ebook}
        alt="logo"
        style={{ height: "85px" }}
      />

      <h3
        style={{
          marginTop: "22px",
          color: "#1f57a4",
          fontWeight: 800,
          letterSpacing: "1px",
          fontSize:"25px"
      
        }}
        className="uppercase"
      >
      spay fintech pvt ltd
      </h3>
    </div>

    {/* EBOOKSPAY */}
    <h3
      style={{
        margin: "0px 0 15px 0px",
        color: "#1f57a4",
        fontWeight: 800,
        letterSpacing: "1px",
        fontSize:"25px"
      }}
    >
      EBOOKSPAY
    </h3>

    {/* INVOICE */}
    <h1
      style={{
        margin: "10px 0",
        color: "#1f57a4",
        fontSize: "28px",
        fontWeight: "800",
        letterSpacing: "2px"
      }}
    >
      INVOICE
    </h1>
  </div>

    </div>

    {/* SUB TITLE */}
    {/* <div style={{ textAlign: "center", marginTop: "10px" }}>
      <h3 style={{
        margin: 0,
        color: "#1f57a4",
        fontWeight: 600,
        letterSpacing: "1px"
      }}>
        EBOOKSPAY
      </h3>

      <h1 style={{
        margin: "5px 0",
        color: "#1f57a4",
        fontSize: "26px",
        letterSpacing: "2px"
      }}>
        INVOICE
      </h1>
    </div> */}

      

          {/* RIGHT SIDE INFO */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "28px",
            fontSize: "13px",
            position: "relative",
            zIndex: 2
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>TO:</p>
  <p
    onDoubleClick={() => {
      if (!data?.data?.customerName) {
        setIsEditingName(true);
      }
    }}
  >
    {isEditingName ? (
      <input
        value={manualData.name || ""}
        onChange={(e) =>
          setManualData({ ...manualData, name: e.target.value })
        }
        onBlur={() => setIsEditingName(false)}
        autoFocus
      />
    ) : (
      data?.data?.customerName || manualData.name || "Customer"
    )}
  </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0 }}>
                <strong>INVOICE NO:</strong>{' '}
                <EditableField field="invoiceNo" value={displayInvoiceNo} />
              </p>
  <p
    onDoubleClick={() => {
      if (!data?.data?.date) {
        setIsEditingDate(true);
      }
    }}
  >
    <strong>DATE:</strong>{" "}
    {isEditingDate ? (
      <input
        type="date"
        value={manualData.date || ""}
        onChange={(e) =>
          setManualData({ ...manualData, date: e.target.value })
        }
        onBlur={() => setIsEditingDate(false)}
        autoFocus
      />
    ) : (
      data?.data?.created_at || manualData.date || "-"
    )}
  </p>
  <p
    onDoubleClick={() => {
      if (!data?.data?.mytxnid) setIsEditingTxn(true);
    }}
  >
    <strong>Txn ID:</strong>{" "}
    {isEditingTxn ? (
      <input
        value={manualData.txn || ""}
        onChange={(e) =>
          setManualData({ ...manualData, txn: e.target.value })
        }
        onBlur={() => setIsEditingTxn(false)}
        autoFocus
      />
    ) : (
      data?.data?.mytxnid || manualData.txn || "-"
    )}
  </p>

  <p
    onDoubleClick={() => {
      if (!data?.data?.refno) setIsEditingRrn(true);
    }}
  >
    <strong>RRN:</strong>{" "}
    {isEditingRrn ? (
      <input
        value={manualData.rrn || ""}
        onChange={(e) =>
          setManualData({ ...manualData, rrn: e.target.value })
        }
        onBlur={() => setIsEditingRrn(false)}
        autoFocus
      />
    ) : (
      data?.data?.refno || manualData.rrn || "-"
    )}
  </p>
            </div>
          </div>

          {/* LINE */}
          <div style={{
            borderBottom: "1px solid #ccc",
            margin: "18px 0 12px 0",
            position: "relative",
            zIndex: 2
          }} />

          {/* TABLE HEADER */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: "13px",
            color: "#2c3e50",
            position: "relative",
            zIndex: 2
          }}>
            <span style={{ width: "60%" }}>Product</span>
            <span style={{ width: "15%", textAlign: "center" }}>QTY</span>
            <span style={{ width: "25%", textAlign: "right" }}>TOTAL</span>
          </div>

          <div style={{
            borderBottom: "1px solid #ccc",
            margin: "8px 0 10px 0"
          }} />

          {/* ITEM ROW */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
            position: "relative",
            zIndex: 2
          }}>
            <span style={{ width: "60%" }}>{randomBook}</span>
            <span style={{ width: "15%", textAlign: "center" }}>1</span>
              <span onDoubleClick={() => {
    if (!data?.data?.amount) setIsEditingAmount(true);
  }}>
    ₹{" "}
    {isEditingAmount ? (
      <input
        type="number"
        value={manualData.amount || ""}
        onChange={(e) =>
          setManualData({ ...manualData, amount: e.target.value })
        }
        onBlur={() => setIsEditingAmount(false)}
        autoFocus
        style={{ width: "80px" }}
      />
    ) : (
      data?.data?.amount || manualData.amount || "1000"
    )}
  </span>
            
          </div>

          <div style={{
            borderBottom: "1px solid #ccc",
            margin: "15px 0 12px 0"
          }} />

          {/* TOTAL ROW */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
            fontWeight: 600,
            position: "relative",
            zIndex: 2
          }}>
            <span>TOTAL</span>
            <span></span>
            <span>₹ <EditableField field="amount" value={displayAmount} /></span>
          </div>

          {/* FINAL TOTAL */}
          <div style={{
            textAlign: "right",
            marginTop: "20px",
            fontSize: "15px",
            fontWeight: 700,
            position: "relative",
            zIndex: 2
          }}>
            Total ₹ <EditableField field="amount" value={displayAmount} />
          </div>

          {/* FOOTER */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "48px",
            fontSize: "11px",
            position: "relative",
            zIndex: 2,
            gap: "20px"
          }}>
            <div style={{ width: "48%" ,paddingLeft:"20px"}}>
              <strong className="font-bold" style={{fontSize:"18px"}}>BILLED BY</strong>
              <p  style={{ marginTop: "6px", lineHeight: 1.45 ,fontSize:"13px"}}>
                Spay Fintech Private Limited<br />
              316, Laxmi Plaza, Laxmi Industrial<br/>
    Estate, Link Road, Andheri West,
    400053<br />
                GSTIN: 2710005200124<br />
                {/* PAN: AHN55590001<br /> */}
                Phone: +91 8888000011
              </p>
            </div>

            <div style={{ width: "48%" }}>
              <strong className="font-bold" style={{fontSize:"18px"}}>TERMS &amp; CONDITIONS</strong>
              <p style={{ marginTop: "6px", lineHeight: 1.45 ,fontSize:"13px"}}>
                1. Please pay within 15 days from the date of invoice, overdue interest @ 10% will be charged on delayed payments.<br />
                2. Please quote invoice number when remitting funds.
              </p>
            </div>
          </div>
        </div>
      );
    };

    export default Invoice_ebbok;