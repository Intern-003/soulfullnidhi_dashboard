export const SchemeModal = ({showModal, handleModal}) => {
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

            <form className="p-6">
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">
                  Scheme Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Scheme Name"
                  className="w-full border rounded-lg p-2 text-sm"
                />
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
