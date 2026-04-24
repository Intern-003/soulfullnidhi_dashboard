import React, { useState } from "react";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";

const FundRequest = () => {
  const [formData, setFormData] = useState({
    utr: "",
    referenceNumber: "",
    remark: "",
  });
  const { execute: formrequest } = usePost("/create-fund-request");
  const user_id = localStorage.getItem("user_id");
  const toast = useToast();
  const [loading, setloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    const payload = {
      user_id: user_id,
      amount: formData.amount,
      utr: formData.utr,
      orderid: formData.referenceNumber,
      remark: formData.remark,
    };

    try {
      const res = await formrequest(payload);

      if (res) {
        toast.success("Transaction Initiated");
        setFormData({
          utr: "",
          referenceNumber: "",
          amount: "",
          remark: "",
        });
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.data?.message ||
        err?.message ||
        "Something went wrong!";

      toast.error(errorMessage);
    } finally {
      setloading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const bankDetails = [
    {
      bankName: "HDFC BANK",
      ifsc: "HDFC0003704",
      accountNumber: "99910026071984",
    },
  ];
  return (
    <div style={{ padding: "20px", background: "#f5f6fa", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(90deg, #b4902d, #8A6D1F)",
          color: "#fff",
          padding: "15px 20px",
          borderRadius: "8px",
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "20px",
        }}
      >
        Fund Request
      </div>

      {/* Card */}
      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Row */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            {/* UTR */}
            <div style={{ flex: 1 }}>
              <label style={label}>UTR</label>
              <input
                type="text"
                name="utr"
                value={formData.utr}
                onChange={handleChange}
                placeholder="Enter UTR"
                style={inputStyle}
                required
              />
            </div>

            {/* Reference Number */}
            <div style={{ flex: 1 }}>
              <label style={label}>Reference Number</label>
              <input
                type="text"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                placeholder="Enter Reference Number"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            {/* UTR */}
            <div style={{ flex: 1 }}>
              <label style={label}>amount</label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter Amount"
                style={inputStyle}
                required
              />
            </div>

            {/* Reference Number */}
            <div style={{ flex: 1 }}>
              <label style={label}>Remark</label>
              <input
                type="text"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                placeholder="Enter Remark"
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* Button */}
          <div style={{ textAlign: "center" }}>
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? "submitting..." : "submit"}
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          marginTop: "20px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "15px 20px",
            borderBottom: "1px solid #eee",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Bank Details
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f4f8", textAlign: "left" }}>
              <th style={thStyle}>Bank Name</th>
              <th style={thStyle}>Account Number</th>
              <th style={thStyle}>IFSC</th>
            </tr>
          </thead>

          <tbody>
            {bankDetails.map((bank, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{bank.bankName}</td>
                <td style={tdStyle}>{bank.accountNumber}</td>
                <td style={tdStyle}>{bank.ifsc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const thStyle = {
  padding: "12px",
  fontSize: "13px",
  color: "#333",
};

const tdStyle = {
  padding: "12px",
  fontSize: "13px",
  color: "#555",
};

// Common styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "none",
  borderBottom: "1px solid #ccc",
  outline: "none",
  fontSize: "12px",
  marginTop: "5px",
};

const label = {
  fontSize: "14px",
};

const buttonStyle = {
  background: "linear-gradient(90deg, #8A6D1F, #b4902d)",
  color: "#fff",
  border: "none",
  padding: "10px 25px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
};

export default FundRequest;
