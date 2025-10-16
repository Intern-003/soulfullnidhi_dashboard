import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import Toggle from "../components/Toggle";
import Button from "../components/Button";
import { SchemeModal } from "../components/SchemeModal";
import { useGet } from "../hooks/useGet";
import { usePut } from "../hooks/usePut";

export const Member = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [merchantData, setMerchantData] = useState([]);
  const { executePut } = usePut("/update-user-statuses");

  const { data: dataOfMerchants, refetch: refetchMerchantsData } =
    useGet("/get-merchants");

  const initialDataOfMerchants = useMemo(
    () => dataOfMerchants?.data ?? [],
    [dataOfMerchants]
  );

  const handlePayinToggle = async (v, rowId, accountStatus) => {
    try {
      if (accountStatus) {
        await executePut({ user_id: rowId, payin_status: v });
      }
    } catch (err) {
      console.log("Payin Toggle Failed: ", err);
    }
  };

  const handlePayoutToggle = async (v, rowId, accountStatus) => {
    try {
      if (accountStatus) {
        await executePut({ user_id: rowId, payout_status: v });
      }
    } catch (err) {
      console.log("Payout Toggle Failed: ", err);
    }
  };

  const handleAccountToggle = async (v, rowId) => {
    try {
      const response = await executePut({
        user_id: rowId,
        payin_status: false,
        payout_status: false,
        account_status: v,
      });

      if (response) refetchMerchantsData();  
    } catch (err) {
      console.log("Account Toggle Failed: ", err);
    }
  };

  useEffect(() => {
    const formattedMerchantData = initialDataOfMerchants.map((item, index) => ({
      sqno: index + 1,
      id: item.id,
      name: item.name,
      payin: item.payin_status,
      payout: item.payout_status,
      account: item.account_status,
      walletpayin: item.payin_wallet,
      walletpayout: item.payout_wallet,
    }));
    setMerchantData(formattedMerchantData);
  }, [initialDataOfMerchants]);

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const membercolumn = [
    { header: "SQ No.", accessor: "sqno" },
    { header: "Name", accessor: "name" },
    { header: "Payin", accessor: "payin" },
    { header: "Payout", accessor: "payout" },
    { header: "Account", accessor: "account" },
    { header: "Payin Wallet", accessor: "walletpayin" },
    { header: "Payout Wallet", accessor: "walletpayout" },
    { header: "Action", accessor: "action" },
  ];

  // ✅ Attach toggle + button per row
  const tableDataWithActions = merchantData?.map((row) => ({
    ...row,
    payin: (
      <Toggle
        defaultChecked={row.payin}
        onChange={(v) => handlePayinToggle(v, row.id, row.account)}
        disabled={!row.account ? true : false}
      />
    ),
    payout: (
      <Toggle
        defaultChecked={row.payout}
        onChange={(v) => handlePayoutToggle(v, row.id, row.account)}
        disabled={!row.account ? true : false}
      />
    ),
    account: (
      <Toggle
        defaultChecked={row.account}
        onChange={(v) => handleAccountToggle(v, row.id)}
      />
    ),
    action: (
      <select
        className="border border-sky-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-sky-400 focus:outline-none hover:border-sky-400 transition cursor-pointer"
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
