import React from "react";
import logo from "../images/logo.png";
import { useState, useEffect, useRef } from "react";

export const Header = () => {

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <nav class="bg-white border-red-100 h-20 shadow-lg shadow-indigo-500/50">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} class="h-12" alt="Spay Logo" />
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span class="sr-only"></span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div class="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white ">
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
              >
                <img
                  className="w-15 h-15"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRduYoJopcD2_WmDjt978P3pjTLl-oQX-ZsTOaof805POhNgFzpYEy5LnA&s"
                  alt="profile image"
                />
                {/* <i class="fa-solid fa-user"></i> */}
              </button>
              {open && (
                <ul className="absolute right-0 mt-3 w-68 shadow-xl/30 z-50  px-4 py-4 rounded-lg"  style={{ backgroundColor: "#A7B7F1" }}>
                  <div className="bg-gray-100 rounded-lg">
                  <div className="text-center text-gray-700">
                    <h6>username</h6>
                     <h6>username@gmail.com</h6><hr />
                  </div>
                  <li>
                    <a
                      href="#profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                  </li>
                  
                  
                  <li>
                    <a
                      href="#logout"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </a>
                  </li>
                  </div>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
