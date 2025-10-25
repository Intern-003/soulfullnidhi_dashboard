import { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { useToast } from "../contexts/ToastContext";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";

const PayinSettlement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();
  const [payinSettlementData, setPayinSettlementData] = useState([]);
  const [payinFormData, setPayinFormData] = useState({
    payin_wallet: "",
    remark: ""
  });

  const { data: tableData, refetch } = useGet("/get-merchants");
  const { execute: payinSettlement } = usePost("/payin-settlement");

  const initialDataOfPayinWallet = tableData?.data;

  useEffect(() => {
    const formattedData = initialDataOfPayinWallet?.map((item, index) => ({
      sqno: index+1,
      id: item.id,
      name: item.name,
      payin_wallet: item.payin_wallet,
    }));
    setPayinSettlementData(formattedData);
  }, [initialDataOfPayinWallet]);

  const membercolumn = [
    { header: "SQNo", accessor: "sqno" },
    { header: "Name", accessor: "name" },
    { header: "Payin Wallet", accessor: "payin_wallet" },
    { header: "Action", accessor: "action" },
  ];

  const tableDataWithActions = payinSettlementData?.map((row) => ({
    ...row,
    action: (
      <Button
        onClick={() => {
          setSelectedUser(row);
          setShowModal(true);
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md cursor-pointer"
      >
        Payin Settlement
      </Button>
    ),
  }));

  const handleChange = (e) => {
    setPayinFormData({...payinFormData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: selectedUser.id,
      payin_wallet: payinFormData.payin_wallet,
      remark: payinFormData.remark,
    };

    try {
      const res = await payinSettlement(payload);
      if(res) {
        toast.success("Settlement done successfully!!");
        refetch();
        setPayinFormData({
          payin_wallet: null,
          remark: ""
        });
        setShowModal(false);
      }
    } catch(err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div>
      <div className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center mb-3 p-2.5">
        <h4 className="font-bold text-white text-lg py-2">Payin Settlement</h4>
      </div>

      <Table columns={membercolumn} data={tableDataWithActions} showDeleteColumn={false} showDateFilter={false} showStatusFilter={false}/>

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
              <h3 className="text-lg font-semibold">
                Payin Settlement to {selectedUser?.name}
              </h3>
              <Button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>
            

            {/* Modal Body */}
            <form className="p-6" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Amount</label>
                <input
                  type="number"
                  name="payin_wallet"
                  value={payinFormData.payin_wallet}
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
                  value={payinFormData.remark}
                  onChange={handleChange}
                  placeholder="Enter Remark"
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <Button
                type="submit"
                onClick={handleSubmit}
                className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg w-full cursor-pointer"
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

export default PayinSettlement;
