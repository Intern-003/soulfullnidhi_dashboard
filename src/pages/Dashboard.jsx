import { DonutChart } from "../components/DonutChart";
import { LineChart } from "../components/LineChart";
import Table from "../components/Table";

export const Dashboard = () => {
  const transactioncolumn = [
    { header: "User Id", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Payin", accessor: "payin" },
    { header: "Payout", accessor: "payout" },
    { header: "Payin Wallet", accessor: "walletpayin" },
    { header: "Payout Wallet", accessor: "walletpayout" },
    { header: "Total Transacts", accessor: "total" },
    { header: "Action", accessor: "action" },
  ];
  const transactiondata = [
    {
      id: "1",
      name: "yuvraj",
      payin: "active",
      payout: "active",
      walletpayin: "Rs.200",
      walletpayout: "Rs.1000",
      total: "Rs.800",
      action: "action",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
          <div className="m-5 relative bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center p-6 bg-blue-500 text-white relative z-10 rounded-b-xl">
              <div className="bg-white rounded-full p-3">
                <i className="fa-solid fa-wallet text-blue-500 fa-lg"></i>
              </div>
              <h5 className="text-lg font-semibold tracking-tight">Total Pay-IN Collection</h5>
            </div>

            <svg
              className="absolute bottom-0 w-full"
              viewBox="0 0 500 50"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C250,50 250,50 500,0 L500,50 L0,50 Z"
                className="fill-gray-400"
              />
            </svg>

            <div className="flex justify-between items-center p-6 relative z-10">
              <h6 className="text-2xl font-bold text-gray-800">
                ₹ 2,430,317.10
              </h6>
              <div className="bg-green-100 outline outline-green-500 font-small text-xs rounded-full px-1 py-1 text-green-500 flex items-center">
                <i className="fa-solid fa-arrow-up fa-sm mr-1"></i>
                3.2%
              </div>
            </div>
          </div>

          <div className="m-5 relative bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center p-6 bg-blue-500 text-white relative z-10 rounded-b-xl">
              <div className="bg-white rounded-full p-3">
                <i className="fa-solid fa-wallet text-blue-500 fa-lg"></i>
              </div>
              <h5 className="text-lg font-semibold tracking-tight">Total Pay-OUT</h5>
            </div>

            <svg
              className="absolute bottom-0 w-full"
              viewBox="0 0 500 50"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C250,50 250,50 500,0 L500,50 L0,50 Z"
                className="fill-gray-400"
              />
            </svg>

            <div className="flex justify-between items-center p-6 relative z-10">
              <h6 className="text-2xl font-bold text-gray-800">
                ₹ 4,961,286.02
              </h6>
              <div className="bg-green-100 outline outline-green-500 font-small text-xs rounded-full px-1 py-1 text-green-500 flex items-center">
                <i className="fa-solid fa-arrow-up fa-sm mr-1"></i>
                3.2%
              </div>
            </div>
          </div>

          <div className="m-5 relative bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center p-6 bg-blue-500 text-white relative z-10 rounded-b-xl">
              <div className="bg-white rounded-full p-3">
                <i className="fa-solid fa-wallet text-blue-500 fa-lg"></i>
              </div>
              <h5 className="text-lg font-semibold tracking-tight">Today Pay-IN Collection</h5>
            </div>

            <svg
              className="absolute bottom-0 w-full"
              viewBox="0 0 500 50"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C250,50 250,50 500,0 L500,50 L0,50 Z"
                className="fill-gray-400"
              />
            </svg>

            <div className="flex justify-between items-center p-6 relative z-10">
              <h6 className="text-2xl font-bold text-gray-800">
                ₹ 00.0
              </h6>
              <div className="bg-green-100 outline outline-green-500 font-small text-xs rounded-full px-1 py-1 text-green-500 flex items-center">
                <i className="fa-solid fa-arrow-up fa-sm mr-1"></i>
                3.2%
              </div>
            </div>
          </div>

          <div className="m-5 relative bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center p-6 bg-blue-500 text-white relative z-10 rounded-b-xl">
              <div className="bg-white rounded-full p-3">
                <i className="fa-solid fa-wallet text-blue-500 fa-lg"></i>
              </div>
              <h5 className="text-lg font-semibold tracking-tight">Today Pay-OUT</h5>
            </div>

            <svg
              className="absolute bottom-0 w-full"
              viewBox="0 0 500 50"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C250,50 250,50 500,0 L500,50 L0,50 Z"
                className="fill-gray-400"
              />
            </svg>

            <div className="flex justify-between items-center p-6 relative z-10">
              <h6 className="text-2xl font-bold text-gray-800">
                ₹ 00.0
              </h6>
              <div className="bg-green-100 outline outline-green-500 font-small text-xs rounded-full px-1 py-1 text-green-500 flex items-center">
                <i className="fa-solid fa-arrow-up fa-sm mr-1"></i>
                3.2%
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full">
            <DonutChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-5">
        <div className="lg:col-span-7">
          <LineChart />
        </div>

        <div className="lg:col-span-3 flex justify-center">
          <div className="w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-bold leading-none text-gray-900">
                Large Transactions
              </h5>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all
              </a>
            </div>

            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200">
                <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Neil Sims
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      ₹32000
                    </div>
                  </div>
                </li>

                <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Bonnie Green
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      ₹346720
                    </div>
                  </div>
                </li>

                <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Michael Gough
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      ₹67000
                    </div>
                  </div>
                </li>

                <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Lana Byrd
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      ₹367250
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Table columns={transactioncolumn} data={transactiondata} />
    </>
  );
};
