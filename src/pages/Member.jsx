import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../components/Table";
import Toggle from "../components/Toggle";


export const Member = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
    { id: "1", name: "yuvraj", payin: false, payout: false, walletpayin: "Rs.200", walletpayout: "Rs.1000", total: "Rs.800"},
  ];
   // ✅ Attach toggle + button per row
  const tableDataWithActions = memberdata.map((row) => ({
    ...row,
    payin: (<Toggle defaultChecked={row.payin} onChange={(v) => console.log(row.name, "Payin:", v)} />),
    payout: <Toggle defaultChecked={row.payout} onChange={(v) => console.log(row.name, "Payout:", v)} />,
    action: (
      <button
        onClick={() => {
          setSelectedUser(row);
          setShowModal(true);
        }}
        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-sm"
      >
        Actions
      </button>
    ),
  }));

  return (
    <div>
      <div className="bg-blue-500 flex justify-between items-center p-2 mb-4">
        <h4 className="font-bold text-white text-lg py-2">Member List</h4>

         <div className="flex items-center space-x-2">
          <span className="font-bold text-white">All Payin ON/OFF</span>
          <Toggle defaultChecked={true} onChange={(v) => console.log("All Payin:", v)} />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-white">All Payout ON/OFF</span>
          <Toggle defaultChecked={true} onChange={(v) => console.log("All Payout:", v)} />
        </div>

        <Link
          to={"/member-create"}
          type="button"
          className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br shadow-lg shadow-cyan-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          + Create New
        </Link>
      </div>
      
      <Table columns={membercolumn} data={tableDataWithActions} />
    </div>
  );
};
