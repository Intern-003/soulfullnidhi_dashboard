import { useState } from "react";
import Button from "./Button";

export const SchemeModal = ({ showModal, handleModal }) => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [percentage, setPercentage] = useState(18);

  return (
    <>
      {showModal && (
        <>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
            onClick={handleModal}
          ></div>
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 bg-white border rounded-lg w-full max-w-xl">
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-medium rounded-t-lg px-5 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Add New Scheme</h3>
              <Button
                onClick={handleModal}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
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
                        activeTab === "tab1" ? "text-blue-500" : "text-gray-500"
                      }`}
                    >
                      <Button
                        type="button"
                        onClick={() => setActiveTab("tab1")}
                        class="cursor-pointer inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:border-blue-900 group"
                      >
                        <i class="fa-solid fa-money-bill-transfer fa-lg me-2 transition duration-75"></i>
                        Payin
                      </Button>
                    </li>
                    <li
                      className={`me-2 hover:text-blue-900 ${
                        activeTab === "tab2" ? "text-blue-500" : "text-gray-500"
                      }`}
                    >
                      <Button
                        type="button"
                        onClick={() => setActiveTab("tab2")}
                        class="cursor-pointer inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:border-blue-900 group"
                      >
                        <i class="fa-solid fa-credit-card fa-lg me-2 transition duration-75"></i>
                        Payout
                      </Button>
                    </li>
                    <li
                      className={`me-2 hover:text-blue-900 ${
                        activeTab === "tab3" ? "text-blue-500" : "text-gray-500"
                      }`}
                    >
                      <Button
                        type="button"
                        onClick={() => setActiveTab("tab3")}
                        class="cursor-pointer inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:border-blue-900 group"
                      >
                        <i class="fa-solid fa-rotate fa-lg me-2 transition duration-75"></i>
                        Rolling Amount
                      </Button>
                    </li>
                    <li
                      className={`me-2 hover:text-blue-900 ${
                        activeTab === "tab4" ? "text-blue-500" : "text-gray-500"
                      }`}
                    >
                      <Button
                        type="button"
                        onClick={() => setActiveTab("tab4")}
                        class="cursor-pointer inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:border-blue-900 group"
                      >
                        <i class="fa-solid fa-percent fa-lg me-2 transition duration-75"></i>
                        GST
                      </Button>
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
                          Amount/Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab === "tab1" && (
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
                              <option selected value="percent">
                                Percent
                              </option>
                            </select>
                          </td>
                          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <input
                              type="number"
                              className="w-full border rounded-lg p-2 text-sm"
                              step="0.01"
                            />
                          </td>
                        </tr>
                      )}

                      {activeTab === "tab2" && (
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
                                <option selected value="percent">
                                  Percent
                                </option>
                              </select>
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <input
                                type="number"
                                className="w-full border rounded-lg p-2 text-sm"
                                step="0.01"
                              />
                            </td>
                          </tr>
                        </>
                      )}

                      {activeTab === "tab3" && (
                        <>
                          {/* Row 1 */}
                          <tr className="border-b border-gray-500">
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="rollingOption"
                                  value="payin"
                                  className="accent-blue-600"
                                  defaultChecked
                                />
                                <span>Rolling Payin Amount</span>
                              </label>
                            </th>

                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <select>
                                <option value="flat">Flat</option>
                                <option selected value="percent">
                                  Percent
                                </option>
                              </select>
                            </td>

                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <input
                                type="number"
                                className="w-full border rounded-lg p-2 text-md"
                                step="0.01"
                              />
                            </td>
                          </tr>

                          {/* Row 2 */}
                          <tr className="border-b border-gray-500 bg-blue-100">
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="rollingOption"
                                  value="fixed"
                                  className="accent-blue-600"
                                />
                                <span>Rolling Fixed Amount</span>
                              </label>
                            </th>

                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <select>
                                <option selected value="flat">
                                  Flat
                                </option>
                                <option value="percent">Percent</option>
                              </select>
                            </td>

                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <input
                                type="number"
                                className="w-full border rounded-lg p-2 text-sm"
                                step="0.01"
                              />
                            </td>
                          </tr>
                        </>
                      )}

                      {activeTab === "tab4" && (
                        <tr class="border-b border-gray-500">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            Goods And Service Tax
                          </th>
                          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <select>
                              <option value="percent" selected>
                                Percent
                              </option>
                            </select>
                          </td>
                          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <input
                              type="number"
                              value={percentage}
                              onChange={(e) => setPercentage(e.target.value)}
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

              <Button
                type="submit"
                onClick={handleModal}
                className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
              >
                Submit
              </Button>
            </form>
          </div>
        </>
      )}
    </>
  );
};
