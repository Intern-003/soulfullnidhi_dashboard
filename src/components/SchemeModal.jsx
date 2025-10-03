export const SchemeModal = ({ showModal, handleModal }) => {
  return (
    <>
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-75 z-40"
            onClick={handleModal}
          ></div>
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 bg-white border rounded-lg max-w-md w-full">
            <div className="text-white bg-blue-500 font-medium rounded-t-lg text-sm px-5 py-2.5 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Add New Scheme</h3>
              <button
                onClick={handleModal}
                className="text-white hover:text-gray-200 font-bold"
              >
                ✖
              </button>
            </div>

            <form className="p-2">
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div className="mb-3 col-span-2">
                  <label className="block mb-1 text-sm font-medium">
                    Scheme Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Scheme Name"
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">
                    Payin Commission Type
                  </label>
                  <select className="w-full border rounded-lg p-2 text-sm">
                    <option selected>Select type</option>
                    <option value="flat">Flat</option>
                    <option value="percent">Percent</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">
                    Payin Commission Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Payin Amount"
                    className="w-full border rounded-lg p-2 text-sm"
                    step="0.01"
                  />
                </div>

                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">
                    Payout Commission Type Below
                  </label>
                  <select className="w-full border rounded-lg p-2 text-sm">
                    <option selected>Select type</option>
                    <option value="flat">Flat</option>
                    <option value="percent">Percent</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">
                    Payout Commission Amount Below
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Payin Amount"
                    className="w-full border rounded-lg p-2 text-sm"
                    step="0.01"
                  />
                </div>

                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">
                    Payout Commission Type Above
                  </label>
                  <select className="w-full border rounded-lg p-2 text-sm">
                    <option selected>Select type</option>
                    <option value="flat">Flat</option>
                    <option value="percent">Percent</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">
                    Payout Commission Amount Above
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Payin Amount"
                    className="w-full border rounded-lg p-2 text-sm"
                    step="0.01"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
              >
                Submit
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};
