import { useState } from "react";

export const SchemeModal = ({ showModal, handleModal }) => {
  const [tab, setTab] = useState(false);

  return (
    <>
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-75 z-40"
            onClick={handleModal}
          ></div>
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 bg-white border rounded-lg w-full max-w-xl">
            <div className="text-white bg-blue-500 font-medium rounded-t-lg text-sm px-5 py-2.5 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Add New Scheme</h3>
              <button
                onClick={handleModal}
                className="text-red-600 hover:text-red-900 font-bold"
              >
                <i class="fa-solid fa-xmark fa-xl"></i>
              </button>
            </div>

            <form className="p-5">
              <div className="mb-6">
                <div className="mb-5">
                  <label className="block mb-1 text-sm font-medium">
                    Scheme Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Scheme Name"
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                <div class="border-b border-gray-200 mb-2">
                  <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
                    <li
                      className={`me-2 hover:text-blue-900 ${
                        tab ? "text-blue-500" : "text-gray-500"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setTab(true)}
                        class="cursor-pointer inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:border-blue-900 group"
                      >
                        <i class="fa-solid fa-money-bill-transfer fa-lg me-2 transition duration-75"></i>
                        Payin
                      </button>
                    </li>
                    <li
                      className={`me-2 hover:text-blue-900 ${
                        !tab ? "text-blue-500" : "text-gray-500"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setTab(false)}
                        class="cursor-pointer inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:border-blue-900 group"
                      >
                        <i class="fa-solid fa-credit-card fa-lg me-2 transition duration-75"></i>
                        Payout
                      </button>
                    </li>
                  </ul>
                </div>

                <div class="relative">
                  <table class="text-sm text-left rtl:text-right text-gray-500">
                    <thead class="text-md text-white uppercase bg-linear-to-r from-blue-400 to-blue-700">
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          Operator
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Type
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {!tab && (
                        <>
                          <tr class="border-b border-gray-500">
                            <th
                              scope="row"
                              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
                              Payout Below 700
                            </th>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <select>
                                <option selected value="flat">
                                  Flat
                                </option>
                                <option value="percent">Percent</option>
                              </select>
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <input
                                type="number"
                                placeholder="Enter Amount"
                                className="w-full border rounded-lg p-2 text-md"
                                step="0.01"
                              />
                            </td>
                          </tr>
                          <tr class="border-b border-gray-500 bg-blue-300">
                            <th
                              scope="row"
                              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
                              Payout Above 700
                            </th>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <select>
                                <option value="flat">Flat</option>
                                <option selected value="percent">Percent</option>
                              </select>
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <input
                                type="number"
                                placeholder="Enter Amount"
                                className="w-full border rounded-lg p-2 text-sm"
                                step="0.01"
                              />
                            </td>
                          </tr>
                        </>
                      )}

                      {tab && (
                        <tr class="border-b border-gray-500">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            Payin Commission Slab
                          </th>
                          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <select>
                              <option value="flat">Flat</option>
                              <option selected value="percent">Percent</option>
                            </select>
                          </td>
                          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <input
                              type="number"
                              placeholder="Enter Amount"
                              className="w-full border rounded-lg p-2 text-sm"
                              step="0.01"
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleModal}
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
