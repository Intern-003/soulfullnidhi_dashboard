import { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import { TableSkeleton } from "../components/TableSkeleton";

const LoadWallet = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [walletData, setWalletData] = useState([]);
  const [modalType, setModalType] = useState("load");

  const toast = useToast();
  const [walletFormData, setWalletFormData] = useState({
    payout_wallet: "",
    remark: "",
  });

  const { data: tableData, refetch, loading } = useGet("/get-merchants");
  const { execute: loadWallet } = usePost("/payout-load-wallet");
  const { execute: reverseTopup } = usePost("/payout-take-back");

  const initialDataOfWallet = tableData?.data;

  useEffect(() => {
    const formattedTableData = initialDataOfWallet?.map((item, index) => ({
      sqno: index + 1,
      id: item.id,
      name: item.name,
      payout_wallet: item.payout_wallet,
    }));
    setWalletData(formattedTableData);
  }, [initialDataOfWallet]);

  const handleChange = (e) => {
    setWalletFormData({ ...walletFormData, [e.target.name]: e.target.value });
  };

  const handleSubmitLoadWallet = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: selectedUser.id,
      payout_wallet: walletFormData.payout_wallet,
      remark: walletFormData.remark,
    };

    try {
      const res = await loadWallet(payload);
      if (res) {
        toast.success("Wallet loaded successfully!!");
        refetch();
        setShowModal(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!!");
    }
  };

  const handleSubmitReverseTopup = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: selectedUser.id,
      payout_wallet: walletFormData.payout_wallet,
      remark: walletFormData.remark,
    };

    try {
      const res = await reverseTopup(payload);
      if (res) {
        toast.success("Deducted balance from wallet successfully!!");
        refetch();
        setShowModal(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!!");
    }
  };

  const membercolumn = [
    { header: "SQNo", accessor: "sqno" },
    { header: "Name", accessor: "name" },
    { header: "Payout Wallet", accessor: "payout_wallet" },
    { header: "Action", accessor: "action" },
  ];

  const tableDataWithActions = walletData?.map((row) => ({
    ...row,
    action: (
      <div className="flex justify-evenly">
        <Button
          onClick={() => {
            setSelectedUser(row);
            setModalType("load");
            setShowModal(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md cursor-pointer"
        >
          Load Wallet
        </Button>
        <Button
          onClick={() => {
            setSelectedUser(row);
            setModalType("reverse");
            setShowModal(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md cursor-pointer"
        >
          Reverse Top-up
        </Button>
      </div>
    ),
  }));

  return (
    <div>
      {/* ✅ Header above table */}
      <div className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center mb-3 p-2.5">
        <h4 className="font-bold text-white text-lg py-2">Load Wallet</h4>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <Table
          columns={membercolumn}
          data={tableDataWithActions}
          showStatusFilter={false}
          showDateFilter={false}
          showDeleteColumn={false}
        />
      )}

      {/* ✅ Modal with background blur */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          onClick={() => setShowModal(false)} // click outside to close
        >
          <div
            className="bg-white border rounded-lg shadow-lg max-w-md w-full mx-2 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()} // prevent close on content click
          >
            {/* Modal Header */}
            <div
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
              font-medium rounded-t-lg text-sm px-5 py-3 flex justify-between items-center"
            >
              {modalType === "load" ? (
                <h3 className="text-lg font-semibold">
                  Wallet Topup for {selectedUser?.name}
                </h3>
              ) : (
                <h3 className="text-lg font-semibold">
                  Reverse Topup for {selectedUser?.name}
                </h3>
              )}
              <Button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            {/* Modal Body */}
            <form className="p-6" onSubmit={modalType === "load" ? handleSubmitLoadWallet : handleSubmitReverseTopup}>
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Amount</label>
                <input
                  name="payout_wallet"
                  type="number"
                  value={walletFormData.payout_wallet}
                  onChange={handleChange}
                  placeholder="Enter Amount"
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Remark</label>
                <textarea
                  rows="3"
                  name="remark"
                  value={walletFormData.remark}
                  onChange={handleChange}
                  placeholder="Enter Remark"
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <Button
                type="submit"
                onClick={modalType === "load" ? handleSubmitLoadWallet : handleSubmitReverseTopup}
                className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg w-full"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadWallet;
