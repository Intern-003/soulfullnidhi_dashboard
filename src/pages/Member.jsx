  import { useEffect, useMemo, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Table from "../components/Table";
  import Toggle from "../components/Toggle";
  import Button from "../components/Button";
  import { SchemeModal } from "../components/SchemeModal";
  import useAutoFetch from "../hooks/useAutoFetch";
  import { usePut } from "../hooks/usePut";
  import { MONTH_NAMES } from "../constants/Constants";
  import { TableSkeleton } from "../components/TableSkeleton";
  import { useGet } from "../hooks/useGet";
  import { usePost } from "../hooks/usePost";
  import { useToast } from "../contexts/ToastContext";
  import { VerifyModal } from "../components/VerifyModal";
import ActionDropdown from "../components/actionDropdown";
import WalletModal from "../components/WalletModal";
import PayinSettlementModal from "../components/PayinSettlementModal";
  






  export const Member = () => {
    const toast = useToast();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const memberDetails = useNavigate();
    const memberVerify = useNavigate();
    const [merchantData, setMerchantData] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true);
    
const [showWalletModal, setShowWalletModal] = useState(false);  
const [showPayinModal, setShowPayinModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [selectedMerchant, setSelectedMerchant] = useState(null);
const [modalType, setModalType] = useState("load");

const [walletFormData, setWalletFormData] = useState({
  payout_wallet: "",
  remark: "",
});
const { execute: loadWallet } = usePost("/payout-load-wallet");
const { execute: reverseTopup } = usePost("/payout-take-back");
    // const [showVerifyModal, setShowVerifyModal] = useState(false);
    //   const handleVerifyConfirm = () => {
    // // Your verify/onboard logic here
    //     toast.success("Merchant onboarded and verified successfully!");
    //     // Optionally call API or update state
    //     navigate("/member-list");
    //   };

const [currentPage, setCurrentPage] = useState(1);
// const ITEMS_PER_PAGE = 10; // change if needed
const [itemsPerPage, setItemsPerPage] = useState(50);


    const { executePut: updateSingle } = usePut("/update-user-statuses");
    const { executePut: updateAll } = usePut("/payin-payout-statuses");
    const { execute: updateCredential } = usePost("/update-credential");
      const { data: summaryData, loading: summaryLoading } = useAutoFetch("/collection-summary");
      const {data:Bank_payin} = useGet("/payinbanks-List");
      // console.log(Bank_payin);
         const { executePut: updatepayinbank } = usePut("/update-user-payin-bank");


         const handleChange = (e) => {
  setWalletFormData({
    ...walletFormData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmitWallet = async (e) => {
  e.preventDefault();

  const payload = {
    user_id: selectedUser.id,
    payout_wallet: walletFormData.payout_wallet,
    remark: walletFormData.remark,
  };

  try {
    const res =
      modalType === "load"
        ? await loadWallet(payload)
        : await reverseTopup(payload);

    if (res) {
      toast.success("Wallet updated successfully");
      setShowWalletModal(false);
    }
  } catch (err) {
    toast.error("Something went wrong");
  }
};
// console.log("Bank_payin data",Bank_payin);
    const handleCredentialChange = async (merchantId, credentialId) => {
      try {
        const res = await updateCredential({
          id: merchantId,
          credentials_id: Number(credentialId),
        });
        toast.success("MID Updated Successfully!");
        refetchOfMerchants();
      } catch (err) {
        console.error(err);
        toast.error("Error updating MID");
      }
    };
const bankList = Bank_payin?.data?.data || [];
    const { data: dataOfMerchants, refetch: refetchOfMerchants, loading: merchantLoading } =
      useAutoFetch("/get-merchants", 20000);
      // console.log(dataOfMerchants);

      // console.log("payoutdata", dataOfMerchants);
    const { data: credentialsData } = useGet("/credentials");


    const initialDataOfMerchants = useMemo(() => dataOfMerchants?.data ?? [], [dataOfMerchants]);

    useEffect(() => {
      if (!merchantLoading && dataOfMerchants) setInitialLoad(false);
    }, [merchantLoading, dataOfMerchants]);
const handlePayinBankChange = async (userId, bankId) => {
  try {

    await updatepayinbank({
      user_id: userId,
      payin_bank: Number(bankId),
    });

    toast.success("Payin bank updated");

    refetchOfMerchants(); // reload data

  } catch (err) {
    console.log(err);
    toast.error("Failed to update bank");
  }
};


    const handlePayinToggle = async (v, rowId, accountStatus) => {
      try {
        if (accountStatus) await updateSingle({ user_id: rowId, payin_status: v });
      } catch (err) {
        console.log("Payin Toggle Failed: ", err);
      }
    };

    const handlePayoutToggle = async (v, rowId, accountStatus) => {
      try {
        if (accountStatus) await updateSingle({ user_id: rowId, payout_status: v });
      } catch (err) {
        console.log("Payout Toggle Failed: ", err);
      }
    };

    const handleAccountToggle = async (v, rowId) => {
      try {
        const response = await updateSingle({
          user_id: rowId,
          payin_status: false,
          payout_status: false,
          account_status: v,
        });
        if (response) refetchOfMerchants();
      } catch (err) {
        console.log("Account Toggle Failed: ", err);
      }
    };

    const handleAllPayinToggle = async (v) => {

      try {
        const x = v ? 1 : 0;
        const response = await updateAll({ payin_status: x });

        if (response) {
          setMerchantData((prev) =>
            prev.map((item) => ({ ...item, payin: item.account ? v : false }))
          );
        }
      } catch (err) {
        console.log("All Payin Toggle Failed: ", err);
      }
    };

    const handleAllPayoutToggle = async (v) => {

      try {
        const x = v ? 1 : 0;
        const response = await updateAll({ payout_status: x });

        if (response) {
          setMerchantData((prev) =>
            prev.map((item) => ({ ...item, payout: item.account ? v : false }))
          );
        }
      } catch (err) {
        console.log("All Payout Toggle Failed: ", err);
      }
    };



    useEffect(() => {
      if (!initialDataOfMerchants || !credentialsData) return;

      const credentialsList = Array.isArray(credentialsData) ? credentialsData : credentialsData.data || [];

      const formattedMerchantData = initialDataOfMerchants.map((item, index) => {
        const credential = credentialsList.find((cred) => cred.id === item.credentials_id);

        // const payinBank =

          // item.payin_at_onboard === "Airpay" ? (
          // item.payin_bank?.onboard_payin_bank === "Airpay" ? (
          //   <div className="flex items-center space-x-2">
          //     <span className="font-medium text-gray-700">Airpay</span>
          //     <select
          //       value={item.credentials_id || ""}
          //       onChange={(e) => handleCredentialChange(item.id, e.target.value)}
          //       className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
          //     >
          //       <option value="">Select MID</option>
          //       {credentialsData?.data?.map((cred) => (
          //         <option key={cred.id} value={cred.id}>
          //           {cred.name}
          //         </option>
          //       ))}
          //     </select>
          //   </div>
          // ) : (
          //   // item.payin_at_onboard
          //   item.payin_bank?.onboard_payin_bank
          // );


  //       const payinBank = (
  // <div className="flex items-center space-x-2">

  //   {/* ✅ PAYIN BANK DROPDOWN */}
  //   <select
  //     value={item.payin_bank?.id || ""}
  //     onChange={(e) =>
  //       handlePayinBankChange(item.id, e.target.value)
  //     }
  //     className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
  //   >
  //     <option value="">Select Bank</option>

  //     {Bank_payin?.data?.data?.map((bank) => (
  //       <option key={bank.id} value={bank.id}>
  //         {bank.onboard_payin_bank}
  //       </option>
  //     ))}
  //   </select>


  //   {/* ✅ SHOW CREDENTIAL ONLY FOR AIRPAY */}
  //   {item.payin_bank?.onboard_payin_bank === "Airpay" && (
  //     <select
  //       value={item.credentials_id || ""}
  //       onChange={(e) =>
  //         handleCredentialChange(item.id, e.target.value)
  //       }
  //       className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
  //     >
  //       <option value="">Select MID</option>

  //       {credentialsData?.data?.map((cred) => (
  //         <option key={cred.id} value={cred.id}>
  //           {cred.name}
  //         </option>
  //       ))}
  //     </select>
  //   )}

  // </div>
// );

const filteredCredentials = credentialsData?.data?.filter(
  (cred) => cred.bank_id === item.payin_bank?.id
);

const payinBank = (
  <div className="flex items-center space-x-2">

    {/* BANK DROPDOWN */}
    <select
      value={item.payin_bank?.id || ""}
      onChange={(e) => handlePayinBankChange(item.id, e.target.value)}
      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-sky-400"
    >
      <option value="">Select Bank</option>

      {bankList.map((bank) => (
        <option key={bank.id} value={bank.id}>
          {bank.onboard_payin_bank}
        </option>
      ))}
    </select>

    {/* CREDENTIAL DROPDOWN */}
    {filteredCredentials?.length > 0 && (
      <select
        value={item.credentials_id || ""}
        onChange={(e) => handleCredentialChange(item.id, e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-sky-400"
      >
        <option value="">Select Credential</option>

        {filteredCredentials.map((cred) => (
          <option key={cred.id} value={cred.id}>
            {cred.name}
          </option>
        ))}
      </select>
    )}
  </div>
);
        return {
          sqno: item.id,
          id: item.id,
          // name: item.name,
          name:(
          <span className="text-blue-600 cursor-pointer w-100" 
          onClick={() => {
            localStorage.setItem("merchantId", item.id);
            memberDetails(`/MerchantDetails/${item.id}`) 
          }}>
            {item.name}
          </span>
          ),
          kyc:item.kyc === 1 ? (
          <span className="py-2 mb-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
            Verified
          </span>
        ) : item.kyc_rejected === 1 ? (
          <span className="py-2 mb-1 text-sm font-semibold text-red-700 bg-red-100 rounded-full">
            Rejected
          </span>
        ) : (
          <button
            className=" py-2 mb-1 text-sm font-semibold text-orange-700 rounded-full hover:bg-orange-200 cursor-pointer transition"
            onClick={() => {
              localStorage.setItem("merchantId", item.id);
              memberVerify(`/VerifyMerchant/${item.id}`);
            }}
          >
            Verify
          </button>
        ),
          payin_bank: payinBank,
          payin: item.payin_status,
        
          payout: item.payout_status,
      // payincharge: Number(item.total_charge?.UPI || 0).toFixed(2),
  // payoutcharge: Number(item.total_charge?.payout || 0).toFixed(2),
  // cryptocharge: Number(item.total_charge?.CRYPTO || 0).toFixed(2),

    // totalwalletpayin: Number(item.total_amount?.UPI || 0).toFixed(2),
  // totalwalletpayout: Number(item.total_amount?.payout || 0).toFixed(2),
  // totalwallet: Number(item.total_payout || 0).toFixed(2),
          account: item.account_status,
          
      walletpayin : (
        <div  style={{width:"200px"}}>
        <span>payin wallet:<b>{Number(item.payin_wallet || 0).toFixed(2)}</b></span><br/>
        <span>Payin Rolling Amount:<b>{Number(item.rolling_amount || 0).toFixed(2)}</b></span><br/>
        <span>Payin Total Charges:<b>{Number(item.total_charge?.UPI || 0).toFixed(2)}</b></span><br/>
        <span>Today Payin Amount:<b>{summaryData?.today_payin}</b></span><br/>
        </div>
      ),
         
          walletpayout:(
            <div  style={{width:"200px"}}>
               <span>payout wallet:<b>{Number(item.payout_wallet || 0).toFixed(2)}</b></span><br/>
                 <span>payout Bank:<b>{item.payout_at_onboard}</b></span><br/>
            </div>
          ),
          date:
            new Date(item.created_at).getDate() +
            " " +
            MONTH_NAMES[new Date(item.created_at).getMonth()] +
            " " +
            new Date(item.created_at).getFullYear(),
        };
      });

      setMerchantData(formattedMerchantData);
    }, [initialDataOfMerchants, credentialsData,summaryData]);

    const memberColumns = [
      { header: "User id", accessor: "sqno"},
      { header: "Name", accessor: "name" },
      // {header: "KYC", accessor:"kyc"},
      { header: "Payin", accessor: "payin" },
  
      { header: "Payout", accessor: "payout" },
      
      { header: "Payin Wallet", accessor: "walletpayin" },
      { header: "Payout Wallet", accessor: "walletpayout" },
      // { header: "Total Payin", accessor: "totalwalletpayin" },
          // { header: "Payin Charge", accessor: "payincharge" },
        // { header: "Total Payout", accessor: "totalwalletpayout" },
          // { header: "Payout Charge", accessor: "payoutcharge" },
        // { header: "Total Wallet", accessor: "totalwallet" },


      { header: "Payin Onboarded Bank", accessor: "payin_bank" },
       { header: "Action", accessor: "action",width: "220px"   },

    ];

    const tableDataWithActions = merchantData?.map((row) => ({
      ...row,
      payin: (
        <Toggle
          defaultChecked={row.payin}
          onChange={(v) => handlePayinToggle(v, row.id, row.account)}
          disabled={!row.account}
        />
      ),
      payout: (
        <Toggle
          defaultChecked={row.payout}
          onChange={(v) => handlePayoutToggle(v, row.id, row.account)}
          disabled={!row.account}
        />
      ),
      sqno: (
        <div className="flex flex-col" style={{width:"100px"}}>
            <div className="flex items-left gap-3">
          <span className="text-sm font-semibold">{row.sqno}</span>
          <Toggle
            defaultChecked={row.account}
            onChange={(v) => handleAccountToggle(v, row.id)}
            className="mt-1"
          /></div>
          <span className="text-xs text-blue-400 font-semibold mt-2">{row.date}</span>
          <span className="text-xs text-blue-400 font-semibold mt-1">{row.kyc}</span>
        </div>
      ),

  //     action: <ActionDropdown
  //      merchantId={row.id}  
  // onFundReturn={() => {
  //   setSelectedUser(row);
  //   setModalType("reverse");
  //   setShowWalletModal(true);
  // }}/>

  action: (
  <ActionDropdown
    merchantId={row.id}
    merchant={row}                           // ← important: pass full object
    onFundReturn={(merchant) => {
      setSelectedMerchant(merchant);
      setShowWalletModal(true);
      // You can set default mode here if you want
      // setModalType("load");   // or leave it to modal default
    }}
     onPayinSettlement={(merchant) => {
      setSelectedMerchant(merchant);
      setShowPayinModal(true);
      // You can set default mode here if you want
      // setModalType("load");   // or leave it to modal default
    }}
         onScheme={(merchant) => {
      setSelectedMerchant(merchant);
      setShowModal(true);
      // You can set default mode here if you want
      // setModalType("load");   // or leave it to modal default
    }}
  />
),
    }
  ));

const totalPages = Math.ceil(tableDataWithActions.length / itemsPerPage);

const paginatedData = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return tableDataWithActions.slice(start, end);
}, [tableDataWithActions, currentPage, itemsPerPage]);



useEffect(() => {
  setCurrentPage(1);
}, [merchantData.length,itemsPerPage]);


    return (
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className=" rounded-lg flex justify-between items-center p-4 shadow-md"
        style={{ background: "linear-gradient(275deg, #062f70ff, #0d3dc4ff)" }}>
          <h4 className="font-bold text-white text-xl">Member List</h4>
     <div className="flex items-center space-x-2">
  <span className="font-bold text-white">All Payin ON/OFF</span>
  <Toggle
    key={merchantData.map(m => m.payin).join("")} // force re-render when data changes
    defaultChecked={
      merchantData.length > 0 &&
      merchantData.every(item => item.account && item.payin)
    }
    onChange={handleAllPayinToggle}
  />
</div>

<div className="flex items-center space-x-2">
  <span className="font-bold text-white">All Payout ON/OFF</span>
  <Toggle
    key={merchantData.map(m => m.payout).join("")} // force re-render when data changes
    defaultChecked={
      merchantData.length > 0 &&
      merchantData.every(item => item.account && item.payout)
    }
    onChange={handleAllPayoutToggle}
  />
</div>


          <Button
            onClick={() => navigate("/member-create")}
            className="bg-white border border-sky-200 text-sky-800 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-sky-50 hover:border-sky-300 transition-all duration-200"
          >
            + Create New
          </Button>

        </div>

        {/* Table */}
        {initialLoad ? (
          <TableSkeleton />
        ) : (
          <Table
            columns={memberColumns}
            // data={tableDataWithActions}
            data={paginatedData}
            className="shadow-lg rounded-lg overflow-hidden border border-gray-200"
            rowClassName={(rowIndex) =>
              rowIndex % 2 === 0 ? "bg-white hover:bg-blue-50" : "bg-gray-50 hover:bg-blue-50"
            }
            // paginationClassName="flex justify-end gap-2 mt-4"
            // previousClassName="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-sm cursor-pointer transition"
            // nextClassName="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-sm cursor-pointer transition"
            endPoint="/delete-merchant"
            setData={setMerchantData}
            showStatusFilter={false}
             showDateFilter={false}
             showExport={false}
             showPagination={false}
             showSearch = {false}
             showSelectUserFilter   = {true}

          />
        )}

{tableDataWithActions.length > 0 && (
  <div className="flex justify-between items-center mt-4">
    
    {/* Page size selector */}
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Show</span>
      <select
        value={itemsPerPage}
        onChange={(e) => setItemsPerPage(Number(e.target.value))}
        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={150}>150</option>
      </select>
      <span className="text-sm font-medium">entries</span>
    </div>

    {/* Pagination buttons */}
    {totalPages > 1 && (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm font-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}
  </div>
)}


  
        <SchemeModal showModal={showModal} 
        handleModal={() => setShowModal(!showModal)} 
          merchant={selectedMerchant}
      refreshTable={refetchOfMerchants} />
<WalletModal
  isOpen={showWalletModal}
  onClose={() => setShowWalletModal(false)}
  merchant={selectedMerchant}
  defaultMode="load"                     // or "reverse" — your choice
  onSuccess={refetchOfMerchants}         // refresh list after success
/>
<PayinSettlementModal
  isOpen={showPayinModal}
  onClose={() => setShowPayinModal(false)}
  merchant={selectedMerchant}              
  onSuccess={refetchOfMerchants}         // refresh list after success
/>
      </div>
    );
  };
