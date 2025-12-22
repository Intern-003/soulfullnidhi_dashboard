// src/components/PendingVerificationModal.jsx
import React from "react";
import Button from "./Button";

export const PendingVerificationModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center p-8 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <i className="fa-solid fa-check text-4xl text-green-600"></i>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Merchant Created Successfully!
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-2">
          Your merchant account has been created and KYC details submitted.
        </p>
        <p className="text-orange-600 font-semibold mb-8">
          Verification is pending. Our team will review your details and approve within 24-48 hours.
        </p>

        {/* Action Button */}
        <Button
          onClick={onClose}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          Okay, Got it
        </Button>

        {/* Optional: Small note */}
        <p className="text-sm text-gray-500 mt-6">
          You will be notified via email once verified.
        </p>
      </div>
    </div>
  );
};