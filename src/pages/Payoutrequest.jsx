import React, { useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";

const Payoutrequest = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const membercolumn = [
    { header: "Beneficiary Id", accessor: "beneficiaryid" },
    { header: "Bank Details", accessor: "bankdetails" },
    { header: "Beneficiary Details", accessor: "beneficiarydetails" },
    { header: "Action", accessor: "action" },
  ];

  const memberdata = [
    {
      beneficiaryid: "1",
      bankdetails: "Yuvraj",
      beneficiarydetails: "Rs.1000",
    },
    {
      beneficiaryid: "2",
      bankdetails: "Aakash",
      beneficiarydetails: "Rs.4000",
    },
  ];

  const tableDataWithActions = memberdata.map((row) => ({
    ...row,
    action: (
      <Button
        onClick={() => {
          setSelectedUser(row);
          setShowModal(true);
        }}
        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-sm cursor-pointer"
      >
        Send
      </Button>
    ),
  }));

  return (
    <>
      <div className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center mb-3 p-2.5">
        <h4 className="font-bold text-white text-lg py-2">Beneficiary List</h4>
        <Button
          type="button"
          className="cursor-pointer"
          variant="AddNewBtn"
          onClick={() => setShowFormModal(true)}
        >
          + Add New Beneficiary
        </Button>
      </div>
      <Table
        columns={membercolumn}
        data={tableDataWithActions}
        showExport={false}
        showStatusFilter={false}
      />

      {/* ✅ Modal with background blur */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✅ Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-medium rounded-t-lg px-5 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payout to Beneficiary</h3>
              <Button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            {/* Beneficiary Table */}
            <div className="overflow-x-auto p-4">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr
                    style={{ backgroundColor: "#bec3ceff" }}
                    className="font-medium"
                  >
                    <th className="p-2 border border-white text-gray-500">
                      NAME
                    </th>
                    <th className="p-2 border border-white text-gray-500">
                      ACCOUNT
                    </th>
                    <th className="p-2 border border-white text-gray-500">
                      IFSC
                    </th>
                    <th className="p-2 border border-white text-gray-500">
                      BANK
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    style={{ backgroundColor: "#68f3b9ff" }}
                    className="font-medium text-white"
                  >
                    <td className="p-2 border">YUVRAJ</td>
                    <td className="p-2 border">1122334455667788</td>
                    <td className="p-2 border">PUNB0413800</td>
                    <td className="p-2 border">Punjab National Bank</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Scroll bar (if table overflows) */}
            {/* <div className="overflow-x-scroll px-4 mb-2">
              <div className="h-1"></div>
            </div> */}

            {/* Divider Line */}
            <div className="border-t border-gray-300 mx-4 mb-1"></div>

            {/* ✅ Modal Body */}
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    placeholder="Enter Amount"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Payment Mode */}
                <div>
                  <label
                    htmlFor="paymentMode"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    {" "}
                    Payment Mode{" "}
                  </label>
                  <select
                    id="paymentMode"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option>IMPS</option>
                    <option>NEFT</option>
                    <option>UPI</option>
                    <option>RTGS</option>
                  </select>
                </div>
              </div>

              {/* ✅ Buttons aligned to right */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-white bg-gray-500 hover:bg-gray-100 transition"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Beneficiary Modal */}
      {showFormModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          onClick={() => setShowFormModal(false)}
        >
          <div
            className="bg-white border rounded-lg shadow-lg max-w-3xl w-full mx-2 p-6 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
              font-medium rounded-t-lg text-sm px-5 py-3 flex justify-between items-center"
            >
              <h4 className="font-bold text-white text-lg py-2">
                Add Beneficiary Details
              </h4>
              <Button
                onClick={() => setShowFormModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            {/* Modal Body */}
            <form className="p-6">
              <div class="grid md:grid-cols-2 md:gap-6 px-4">
                <div class="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_first_name"
                    id="floating_first_name"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    for="floating_first_name"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Account No.
                  </label>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_last_name"
                    id="floating_last_name"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    for="floating_last_name"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    IFSC Code
                  </label>
                </div>
              </div>
              <div class="grid md:grid-cols-2 md:gap-6 px-4">
                <div class="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_last_name"
                    id="floating_last_name"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    for="floating_last_name"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    UPI Number
                  </label>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_last_name"
                    id="floating_last_name"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    for="floating_last_name"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Beneficiary Name
                  </label>
                </div>
              </div>
              <div class="grid md:grid-cols-2 md:gap-6 px-4">
                <div class="relative z-0 w-full mb-5 group">
                  <input
                    type="tel"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    name="floating_phone"
                    id="floating_phone"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    for="floating_phone"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Beneficiary Mobile Number
                  </label>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_last_name"
                    id="floating_last_name"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    for="floating_last_name"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Beneficiary Email ID
                  </label>
                </div>
              </div>
              <div class="flex justify-center mt-6">
                <Button
                  type="submit"
                  className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form Section */}
      {/* <div className="bg-white shadow-md rounded-lg shadow-lg shadow-gray-900/100"> 
        <div className=" flex justify-between items-center p-2 mb-4 rounded-t-lg">
          <h4 className="font-bold text-blue-500 text-lg py-2">New Beneficiary Details</h4>
        </div>      */}
      {/* <div className="bg-white shadow-md rounded-lg shadow-lg shadow-gray-900/50 m-4">
        <div className="bg-blue-500 text-white font-bold text-lg px-4 py-2 rounded mb-4" style={{
              background: "linear-gradient(90deg, #007BFF, #00C8FF)",
              color: "white",
            }}>
            Add Beneficiary Details
        </div>
    
        
        <div class="grid md:grid-cols-3 md:gap-6 px-4">
          <div class="relative z-0 w-full mb-5 group">
              <input type="text" name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Account No.</label>
          </div>       
          <div class="relative z-0 w-full mb-5 group">
             <input type="text" name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
             <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">IFSC Code</label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
              <input type="text" name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">UPI Number</label>
          </div>
        </div>
        <div class="grid md:grid-cols-3 md:gap-6 px-4">
          <div class="relative z-0 w-full mb-5 group">
              <input type="text" name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Beneficiary Name</label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
              <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="floating_phone" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Beneficiary Mobile Number</label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
              <input type="text" name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Beneficiary Email ID</label>
          </div>                 
        </div >
        
        <div class="flex justify-center mt-6">
            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </div>
        </div> */}
      {/* </div> */}
    </>
  );
};

export default Payoutrequest;
