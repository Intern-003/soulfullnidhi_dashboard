import { useState, useEffect } from "react";
import Button from "../components/Button";
import Table from "../components/Table";
import { BankModal } from "../components/BankModal";
import { useGet } from "../hooks/useGet";
import Toggle from "../components/Toggle";

const OnboardBank = () => {
  const [activeTab, setActiveTab] = useState("payin");
  const [bankData, setBankData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { data: payinbanks, refetch: payinRefetch } = useGet("/payinbanks-List");
  const { data: payoutbanks, refetch: payoutRefetch } = useGet("/payoutbanks-List");

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleStatusToggle = (rowId, checked) => {
    setBankData((prev) =>
      prev.map((item) =>
        item.id === rowId
          ? { ...item, status: checked ? "Active" : "Inactive" }
          : item
      )
    );
  };

  // Map columns dynamically based on active tab
  const bankColumn = [
    { header: "No", accessor: "id" },
    {
      header: "Bank Name",
      accessor:
        activeTab === "payin" ? "onboard_payin_bank" : "onboard_payout_bank",
    },
    {
      header: "Status",
      accessor:
        activeTab === "payin"
          ? "onboarded_payin_bank_status"
          : "onboarded_payout_bank_status",
      Cell: ({ value, row }) => (
        <Toggle
          defaultChecked={value === "Active"}
          onChange={(checked) => handleStatusToggle(row.id, checked)}
        />
      ),
    },
  ];

  useEffect(() => {
    if (activeTab === "payin") {
      const mapped =
        payinbanks?.data?.map((item) => ({
          ...item,
          onboarded_payin_bank_status:
            item.onboarded_payin_bank_status === 1 ? "Active" : "Inactive",
        })) || [];
      setBankData(mapped);
    } else {
      const mapped =
        payoutbanks?.data?.map((item) => ({
          ...item,
          onboarded_payout_bank_status:
            item.onboarded_payout_bank_status === 1 ? "Active" : "Inactive",
        })) || [];
      setBankData(mapped);
    }
  }, [activeTab, payinbanks, payoutbanks]);

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
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          {activeTab === "payin" ? "Payin Bank List" : "Payout Bank List"}
        </h3>

        <Table
          columns={bankColumn}
          data={bankData}
          showPagination={true}
          showStatusFilter={false}
          showExport={false}
          showSearch={false}
        />
      </div>

      <BankModal
        showModal={showModal}
        handleModal={handleModal}
        activeTab={activeTab}
        refreshTable={activeTab === "payin" ? payinRefetch : payoutRefetch}
      />
    </div>
  );
};

export default OnboardBank;
