import { useState } from "react";
import Button from "../components/Button";
import Table from "../components/Table";

const OnboardBank = () => {
  const [activeTab, setActiveTab] = useState("payin");
  const [showModal, setShowModal] = useState(false);
  const bankColumn = [
    { header: "No", accessor: "sq_no" },
    { header: "Bank Name", accessor: "bank" },
    { header: "Type", accessor: "type" },
  ];
  const payinBanks = [
    { sq_no: 1, bank: "HDFC Bank", type: "Payin" },
    { sq_no: 2, bank: "ICICI Bank", type: "Payin" },
    { sq_no: 3, bank: "SBI", type: "Payin" },
  ];

  const payoutBanks = [
    { sq_no: 1, bank: "Axis Bank", type: "Payout" },
    { sq_no: 2, bank: "Kotak Bank", type: "Payout" },
    { sq_no: 3, bank: "Yes Bank", type: "Payout" },
  ];

  // Select which data to show based on active tab
  const banksToDisplay = activeTab === "payin" ? payinBanks : payoutBanks;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Onboard Bank</h2>

      {/* Tabs + Button Row */}
      <div className="flex justify-between items-center border-b border-gray-300 mb-4">
        {/* Tabs */}
        <div className="flex space-x-4">
          <Button
            className={`cursor-pointer py-2 px-4 font-medium ${
              activeTab === "payin"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("payin")}
          >
            Payin Bank List
          </Button>

          <Button
            className={`cursor-pointer py-2 px-4 font-medium ${
              activeTab === "payout"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("payout")}
          >
            Payout Bank List
          </Button>
        </div>

        {/* Add Button */}
        {/* <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
                     hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
                     font-medium rounded-lg text-sm px-4 py-2 text-center shadow"
          onClick={() => alert("Add Bank clicked!")}
        >
          + Add Bank
        </button> */}
        <Button
          type="button"
          className="cursor-pointer"
          variant="AddNewBtn"
          onClick={() => setShowModal(true)}
        >
          ADD BANK
        </Button>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg p-4">
        {activeTab === "payin" && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Payin Bank List
            </h3>
            <Table
              columns={bankColumn}
              data={banksToDisplay}
              showPagination={false}
              showStatusFilter={false}
              showExport={false}
              showSearch={false}
            />
          </div>
        )}

        {activeTab === "payout" && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Payout Bank List
            </h3>
            <Table
              columns={bankColumn}
              data={banksToDisplay}
              showPagination={false}
              showStatusFilter={false}
              showExport={false}
              showSearch={false}
            />
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white border rounded-lg shadow-lg max-w-3xl w-full mx-2 p-6 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
              font-medium rounded-t-lg text-sm px-5 py-3 flex justify-between items-center"
            >
              <h4 className="font-bold text-white text-lg py-2">Add Bank</h4>
              <Button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            <form className="p-6">
              <div className="grid md:grid-cols-1 md:gap-6 px-4">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="bankname"
                    id="floating_bank"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    for="floating_bank"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Bank Name
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Bank Type
                  </label>
                  <div className="w-full border rounded-md p-2 text-sm bg-gray-100 text-gray-900">
                    {activeTab === "payin" ? "Payin" : "Payout"}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardBank;
