import { useState } from "react";
export const Sidebar = () => {
  const [schemeDropDown, setSchemeDropDown] = useState(false);
  const [memberDropDown, setMemberDropDown] = useState(false);
  const [fundDropDown, setFundDropDown] = useState(false);
  const [payoutDropDown, setPayoutDropDown] = useState(false);
  const [transactionDropDown, setTransactionDropDown] = useState(false);
  const [accountDropDown, setAccountDropDown] = useState(false);
  const [rolesDropDown, setRolesDropDown] = useState(false);
  const [ticketsDropDown, setTicketsDropDown] = useState(false);
  const [payinDropDown, setPayinDropDown] = useState(false);

  return (
    <>
      <div
        id="drawer-navigation"
        className={`fixed top-20 left-0 z-40 w-60 h-screen p-4 overflow-y-auto transition-transform bg-sky-600 translate-x-0 bg-linear-to-t from-sky-300 to-blue-500`}
        tabindex="-1"
        aria-labelledby="drawer-navigation-label"
      >
        <div class="py-4">
          <ul class="space-y-2 font-medium">
            <li>
              <a
                href="#"
                class="flex items-center p-2 text-white rounded-lg hover:bg-blue-200 group hover:text-blue-900"
              >
                <svg
                  class="w-5 h-5 text-white transition duration-75 group-hover:text-blue-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span class="ms-3">Dashboard</span>
              </a>
            </li>

            {/** Dropdown button of scheme */}
            <li>
              <a
                class="flex justify-between items-center p-2 text-white rounded-lg hover:bg-blue-200 group hover:text-blue-900"
                type="button"
                onClick={() => setSchemeDropDown(!schemeDropDown)}
              >
                <span className="ms-3">Scheme Manager</span>
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </a>
            </li>

            {/*
            Dropdown body of scheme
            */}
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                schemeDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <a href="">Scheme</a>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of member
             */}  
            <li>
              <a
                class="flex justify-between items-center p-2 text-white rounded-lg hover:bg-blue-200 group hover:text-blue-900"
                type="button"
                onClick={() => setMemberDropDown(!memberDropDown)}
              >
                <span className="ms-3">Member</span>
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </a>
            </li>

            {/**
             * Dropdown body of member
             */
            }
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                memberDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <a href="">Merchant Onboarding</a>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of fund
             */}  
            <li>
              <a
                class="flex justify-between items-center p-2 text-white rounded-lg hover:bg-blue-200 group hover:text-blue-900"
                type="button"
                onClick={() => setFundDropDown(!fundDropDown)}
              >
                <span className="ms-3">Fund</span>
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </a>
            </li>

            {/**
             * Dropdown body of fund
             */
            }
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                fundDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <a href="">Load Wallet</a>
                </li>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <a href="">Payin Settlement</a>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of payout
             */}  
            <li>
              <a
                class="flex justify-between items-center p-2 text-white rounded-lg hover:bg-blue-200 group hover:text-blue-900"
                type="button"
                onClick={() => setPayoutDropDown(!payoutDropDown)}
              >
                <span className="ms-3">Payout</span>
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </a>
            </li>

            {/**
             * Dropdown body of payout
             */
            }
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                payoutDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <a href="">Request</a>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of payin
             */}  
            <li>
              <a
                class="flex justify-between items-center p-2 text-white rounded-lg hover:bg-blue-200 group hover:text-blue-900"
                type="button"
                onClick={() => setPayinDropDown(!payinDropDown)}
              >
                <span className="ms-3">Payin</span>
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </a>
            </li>

            {/**
             * Dropdown body of payin
             */
            }
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                payinDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <a href="">Request</a>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of transaction
             */}  
            <li>
              <a
                class="flex justify-between items-center p-2 text-white rounded-lg hover:bg-blue-200 group hover:text-blue-900"
                type="button"
                onClick={() => setTransactionDropDown(!transactionDropDown)}
              >
                <span className="ms-3">Transaction History</span>
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </a>
            </li>

            {/**
             * Dropdown body of transaction
             */
            }
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                transactionDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 mb-1 p-1">
                  <a href="">UPI Statement</a>
                </li>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 mb-1 p-1">
                  <a href="">Payout Statement</a>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of account
             */}  
            <li>
              <a
                class="flex justify-between items-center p-2 text-white rounded-lg hover:bg-blue-200 group hover:text-blue-900"
                type="button"
                onClick={() => setAccountDropDown(!accountDropDown)}
              >
                <span className="ms-3">Account Statement</span>
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </a>
            </li>

            {/**
             * Dropdown body of account
             */
            }
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                accountDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 mb-1 p-1">
                  <a href="">Topup Statement</a>
                </li>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 mb-1 p-1">
                  <a href="">Settlement Payin Statement</a>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of roles
             */}  
            <li>
              <a
                class="flex justify-between items-center p-2 text-white rounded-lg hover:bg-blue-200 group hover:text-blue-900"
                type="button"
                onClick={() => setRolesDropDown(!rolesDropDown)}
              >
                <span className="ms-3">Roles & Permissions</span>
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </a>
            </li>

            {/**
             * Dropdown body of roles
             */
            }
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                rolesDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 mb-1 p-1">
                  <a href="">Roles</a>
                </li>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 mb-1 p-1">
                  <a href="">Permissions</a>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of tickets
             */}  
            <li>
              <a
                class="flex justify-between items-center p-2 text-white rounded-lg hover:bg-blue-200 group hover:text-blue-900"
                type="button"
                onClick={() => setTicketsDropDown(!ticketsDropDown)}
              >
                <span className="ms-3">Complaints</span>
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </a>
            </li>

            {/**
             * Dropdown body of tickets
             */
            }
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                ticketsDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <a href="">Register Complain</a>
                </li>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <a href="">View Complain</a>
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};
