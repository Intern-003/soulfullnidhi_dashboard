import React, { useState } from "react";
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
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === "payin"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-blue-600"
                            }`}
                        onClick={() => setActiveTab("payin")}
                    >
                        Payin Bank List
                    </button>

                    <button
                        className={`py-2 px-4 font-medium ${activeTab === "payout"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-blue-600"
                            }`}
                        onClick={() => setActiveTab("payout")}
                    >
                        Payout Bank List
                    </button>
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
                <Button type="button" variant="AddNewBtn" onClick={() => setShowModal(true)} >ADD BANK</Button>

            </div>

            {/* Tab Content */}
            <div className="bg-white shadow rounded-lg p-4">
                {activeTab === "payin" && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">
                            Payin Bank List
                        </h3>
                        <Table columns={bankColumn} data={banksToDisplay} showPagination={false} showStatusFilter={false} showExport={false} showSearch={false} />
                    </div>
                )}

                {activeTab === "payout" && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">
                            Payout Bank List
                        </h3>
                        <Table columns={bankColumn} data={banksToDisplay} showPagination={false} showStatusFilter={false} showExport={false} showSearch={false} />
                    </div>
                )}
            </div>


            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Add New Bank</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-red-500 text-lg font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                                    placeholder="Enter bank name"
                                />
                            </div>

                            {/* Payin / Payout Select */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bank Type
                                </label>
                                <div className="w-full border rounded-md p-2 text-sm bg-gray-100 text-gray-700">
                                    {activeTab === "payin" ? "Payin" : "Payout"}
                                </div>
                            </div>  

                            {/* Modal Footer */}
                            <div className="flex justify-end space-x-3 border-t pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



        </div>
    );
};

export default OnboardBank;
