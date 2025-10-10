import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import Toggle from "../components/Toggle";
import Button from "../components/Button";
import { SchemeModal } from "../components/SchemeModal";

export const Member = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleModal = () => {
    setShowModal(!showModal);
  };
  const membercolumn = [
    { header: "User Id", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Payin", accessor: "payin" },
    { header: "Payout", accessor: "payout" },
    { header: "Payin Wallet", accessor: "walletpayin" },
    { header: "Payout Wallet", accessor: "walletpayout" },
    { header: "Total Transacts", accessor: "total" },
    { header: "Action", accessor: "action" },
  ];
  const memberdata = [
    {
      id: "1",
      name: "yuvraj",
      payin: false,
      payout: false,
      walletpayin: "Rs.200",
      walletpayout: "Rs.1000",
      total: "Rs.800",
    },
  ];
  // ✅ Attach toggle + button per row
  const tableDataWithActions = memberdata.map((row) => ({
    ...row,
    payin: (
      <Toggle
        defaultChecked={row.payin}
        onChange={(v) => console.log(row.name, "Payin:", v)}
      />
    ),
    payout: (
      <Toggle
        defaultChecked={row.payout}
        onChange={(v) => console.log(row.name, "Payout:", v)}
      />
    ),
    action: (
      <select
        className="border border-sky-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-sky-400 focus:outline-none hover:border-sky-400 transition"
        onChange={(e) => {
          const value = e.target.value;
          if (value === "manage") {
            window.location.href = "#profile";
          } else if (value === "scheme") {
            handleModal();
          }
          e.target.value = "actions";
        }}
      >
        <option value="actions">Actions</option>
        <option value="manage">Manage Profile</option>
        <option value="scheme">View Scheme</option>
      </select>
    ),
  }));

  return (
    <div>
      <div className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center mb-3 p-2.5">
        <h4 className="font-bold text-white text-lg py-2">Member List</h4>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-white">All Payin ON/OFF</span>
          <Toggle
            defaultChecked={true}
            onChange={(v) => console.log("All Payin:", v)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-white">All Payout ON/OFF</span>
          <Toggle
            defaultChecked={true}
            onChange={(v) => console.log("All Payout:", v)}
          />
        </div>

        <Button
          onClick={() => navigate("/member-create")}
          className="cursor-pointer"
          variant="AddNewBtn"
        >
          + Create New
        </Button>
      </div>

      <Table columns={membercolumn} data={tableDataWithActions} />

      <SchemeModal showModal={showModal} handleModal={handleModal} />
    </div>
  );
};
