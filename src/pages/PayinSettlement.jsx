import React, { useState } from "react";

const PayinSettlement = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6">
      {/* Button to open modal */}
      <button
        onClick={() => setShowModal(true)}
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
        hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
        dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg 
        dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Payin Settlement
      </button>

      {/* Modal inside page */}
      {showModal && (
        <div className="bg-white border rounded-lg shadow-md p-0 max-w-md mx-auto">
          {/* Header with gradient */}
          <div className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
            hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
            dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg 
            dark:shadow-blue-800/80 font-medium rounded-t-lg text-sm px-5 py-2.5 text-center flex justify-between items-center">
            <h3 className="text-lg font-semibold">Payin Settlement</h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-white hover:text-gray-200 font-bold"
            >
              ✖
            </button>
          </div>

          {/* Modal Body */}
          <form className="p-6">
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">Amount</label>
              <input
                type="number"
                placeholder="Enter Amount"
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">Remark</label>
              <textarea
                rows="3"
                placeholder="Enter Remark"
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PayinSettlement;

