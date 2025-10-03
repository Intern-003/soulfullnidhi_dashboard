import React from "react";
import { Link } from "react-router-dom";
import Table from "../components/Table";

export const Member = () => {
  const membercolumn = [
    { header: "User Id", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Payin", accessor: "payin" },
    { header: "Payout", accessor: "payout" },
    { header: "Payin Wallet", accessor: "walletpayin" },
    { header: "Payout Wallet", accessor: "walletpayout" },
    { header: "Total Transacts", accessor: "total" },
    { header: "Action", accessor: "action" }
  ];
  const memberdata = [
    { id: "1", name: "yuvraj", payin: "active", payout: "active", walletpayin: "Rs.200", walletpayout: "Rs.1000", total: "Rs.800", action: "action"},
  ];

  return (
    <div>
      <div className="bg-blue-500 flex justify-between item-center p-2 mb-4">
        <h4 className="font-bold text-white text-lg py-2">Member List</h4>
        <Link
          to={"/member-create"}
          type="button"
          class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br shadow-lg shadow-cyan-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          + Create New
        </Link>
      </div>
      <Table columns={membercolumn} data={memberdata} />
    </div>
  );
};
