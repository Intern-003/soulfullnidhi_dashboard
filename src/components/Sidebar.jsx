import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/sidebar.css";
import Logo from "../images/logo.png";

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
     {/* <div
  id="drawer-navigation"
  className={`w-62 h-screen flex flex-col p-4 transition-transform translate-x-0 
  bg-blue-500 bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/53/Designsz.png')] 
  bg-cover bg-no-repeat bg-center bg-blend-multiply`}
  tabIndex="-1"
  aria-labelledby="drawer-navigation-label"
> */}

 <div
  id="drawer-navigation"
 className={`w-62 h-screen flex flex-col p-4 transition-all duration-500 translate-x-0 
  bg-blue-500 bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/53/Designsz.png')] 
  bg-cover bg-no-repeat bg-center bg-blend-soft-light 
  shadow-[10px_0_25px_rgba(0,0,0,0.3)] hover:shadow-[22px_0_35px_rgba(0,0,0,0.4)] hover:-translate-x-0.6 transition-all duration-500 ease-in-out`}
  tabIndex="-1"
  aria-labelledby="drawer-navigation-label"
>

        <div className="flex-shrink-0 p-4 justify-center items-center">
          <div className="ml-6 rounded-full h-24 w-24 bg-white flex items-center justify-center">
            <a href="#">
              <img src={Logo} className="w-20" alt="Spay Logo" />
            </a>
          </div>
        </div>
        
        <div class="sidebar flex-1 overflow-y-auto py-4 custom-scrollbar ">
          <ul class="space-y-2 font-medium">
            <li>
              <a
                href="#"
                onMouseDown={(e) => e.currentTarget.classList.add("scale-95")}
                onMouseUp={(e) => e.currentTarget.classList.remove("scale-95")}
                className="flex items-center p-2 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 hover:bg-blue-200 hover:text-blue-900 group cursor-pointer"
              >
                <i className="fa-solid fa-chart-pie fa-lg text-white transition-all duration-300 ease-in-out group-hover:text-blue-900 group-hover:scale-125"></i>
                <span className="ms-3 transition-colors duration-300 group-hover:text-blue-900 group-hover:text-sm">
                  Dashboard 
                </span>
              </a>
            </li>

            {/** Dropdown button of scheme */}
            <li>
              <a
                onMouseDown={(e) => e.currentTarget.classList.add("scale-95")}
                onMouseUp={(e) => e.currentTarget.classList.remove("scale-95")}
                className="flex items-center p-2 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 hover:bg-blue-200 hover:text-blue-900 group cursor-pointer"
                type="button"
                onClick={() => setSchemeDropDown(!schemeDropDown)}
              >
                <div>
                  <i class="fa-solid fa-money-check fa-lg text-white transition duration-75 group-hover:text-blue-900"></i>
                  <span className="ms-3 group-hover:text-sm">Scheme Manager</span>
                </div>

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
                  <Link to={"/scheme"}>
                    <span className="ms-3">Scheme</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of member
             */}
            <li>
              <a
                onMouseDown={(e) => e.currentTarget.classList.add("scale-95")}
                onMouseUp={(e) => e.currentTarget.classList.remove("scale-95")}
                className="flex items-center p-2 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 hover:bg-blue-200 hover:text-blue-900 group cursor-pointer"
                type="button"
                onClick={() => setMemberDropDown(!memberDropDown)}
              >
                <div>
                  <i class="fa-solid fa-user-group fa-lg text-white transition duration-75 group-hover:text-blue-900"></i>
                  <span className="ms-3 group-hover:text-sm">Member</span>
                </div>

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
             */}
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                memberDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <Link to={"/member-list"}>Merchant Onboarding</Link>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of fund
             */}
            <li>
              <a
                onMouseDown={(e) => e.currentTarget.classList.add("scale-95")}
                onMouseUp={(e) => e.currentTarget.classList.remove("scale-95")}
                className="flex items-center p-2 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 hover:bg-blue-200 hover:text-blue-900 group cursor-pointer"
                type="button"
                onClick={() => setFundDropDown(!fundDropDown)}
              >
                <div>
                  <i class="fa-solid fa-piggy-bank fa-lg text-white transition duration-75 group-hover:text-blue-900"></i>
                  <span className="ms-3 group-hover:text-sm">Fund</span>
                </div>
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
             */}
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                fundDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <Link to="/load-wallet"> Load Wallet</Link>
                </li>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <Link to="/payin-settlement">Payin Settlement</Link>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of payout
             */}
            <li>
              <a
                onMouseDown={(e) => e.currentTarget.classList.add("scale-95")}
                onMouseUp={(e) => e.currentTarget.classList.remove("scale-95")}
                className="flex items-center p-2 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 hover:bg-blue-200 hover:text-blue-900 group cursor-pointer"
                type="button"
                onClick={() => setPayoutDropDown(!payoutDropDown)}
              >
                <div>
                  <i class="fa-solid fa-credit-card fa-lg text-white transition duration-75 group-hover:text-blue-900"></i>
                  <span className="ms-3 group-hover:text-sm">Payout</span>
                </div>
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
             */}
            <div
              className={`divide-y rounded-lg p-2 ml-3 bg-blue-200 ${
                payoutDropDown ? "" : "hidden"
              }`}
            >
              <ul>
                <li class="text-gray-900 hover:text-white hover:bg-blue-900 p-1">
                  <Link to="/payout-request">Request</Link>
                </li>
              </ul>
            </div>

            {/**
             * Dropdown button of payin
             */}
            <li>
              <a
                onMouseDown={(e) => e.currentTarget.classList.add("scale-95")}
                onMouseUp={(e) => e.currentTarget.classList.remove("scale-95")}
                className="flex items-center p-2 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 hover:bg-blue-200 hover:text-blue-900 group cursor-pointer"
                type="button"
                onClick={() => setPayinDropDown(!payinDropDown)}
              >
                <div>
                  <i class="fa-solid fa-money-bill-transfer fa-lg text-white transition duration-75 group-hover:text-blue-900"></i>
                  <span className="ms-3 group-hover:text-sm">Payin</span>
                </div>
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
             */}
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
                onMouseDown={(e) => e.currentTarget.classList.add("scale-95")}
                onMouseUp={(e) => e.currentTarget.classList.remove("scale-95")}
                className="flex items-center p-2 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 hover:bg-blue-200 hover:text-blue-900 group cursor-pointer"
                type="button"
                onClick={() => setTransactionDropDown(!transactionDropDown)}
              >
                <div>
                  <i class="fa-solid fa-clock-rotate-left fa-lg text-white transition duration-75 group-hover:text-blue-900"></i>
                  <span className="ms-3 group-hover:text-sm">Transaction History</span>
                </div>
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
             */}
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
                onMouseDown={(e) => e.currentTarget.classList.add("scale-95")}
                onMouseUp={(e) => e.currentTarget.classList.remove("scale-95")}
                className="flex items-center p-2 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 hover:bg-blue-200 hover:text-blue-900 group cursor-pointer"
                type="button"
                onClick={() => setAccountDropDown(!accountDropDown)}
              >
                <div>
                  <i class="fa-solid fa-layer-group fa-lg text-white transition duration-75 group-hover:text-blue-900"></i>
                  <span className="ms-3">Account Statement</span>
                </div>
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
             */}
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
                onMouseDown={(e) => e.currentTarget.classList.add("scale-95")}
                onMouseUp={(e) => e.currentTarget.classList.remove("scale-95")}
                className="flex items-center p-2 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 hover:bg-blue-200 hover:text-blue-900 group cursor-pointer"
                type="button"
                onClick={() => setRolesDropDown(!rolesDropDown)}
              >
                <div>
                  <i class="fa-solid fa-gears fa-lg text-white transition duration-75 group-hover:text-blue-900"></i>
                  <span className="ms-2 group-hover:text-sm">Roles & Permissions</span>
                </div>
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
             */}
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
                class="flex justify-between items-center p-2 text-white rounded-lg hover:bg-blue-200 group hover:text-blue-900 cursor-pointer"
                type="button"
                onClick={() => setTicketsDropDown(!ticketsDropDown)}
              >
                <div>
                  <i class="fa-solid fa-comment fa-lg text-white transition duration-75 group-hover:text-blue-900"></i>
                  <span className="ms-3 group-hover:text-sm " >Complaints</span>
                </div>
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
             */}
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
