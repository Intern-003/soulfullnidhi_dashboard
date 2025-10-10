import Button from './Button'

export const BankModal = ({showModal, handleModal, activeTab}) => {
  return (
    <>
        {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          onClick={() => handleModal(false)}
        >
          <div
            className="bg-white border rounded-lg shadow-lg max-w-3xl w-full mx-2 p-6 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
              font-medium rounded-t-lg text-sm px-5 py-3 flex justify-between items-center"
            >
              <h4 className="font-bold text-white text-lg py-2">Add Bank</h4>
              <Button
                onClick={() => handleModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            <form className="p-6">
              <div className="grid md:grid-cols-1 md:gap-6 px-4">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="bankname"
                    id="floating_bank"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    for="floating_bank"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Bank Name
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Bank Type
                  </label>
                  <div className="w-full border rounded-md p-2 text-sm bg-gray-100 text-gray-900">
                    {activeTab === "payin" ? "Payin" : "Payout"}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
