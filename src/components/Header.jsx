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
 <nav class="bg-white shadow-lg shadow-indigo-500/50 ">
  <div class="max-w-screen-xl flex items-center justify-between mx-auto p-4">
    
    <div class="flex items-center space-x-6"> 
      <div class="flex items-center space-x-2">
      {/* <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src={logo} class="h-12 w-20" alt="Spay Logo" />
      </a> */}
    <button type="button" class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 " style={{margin:"0px 10px 0px 50px"}}>Load Wallet</button>
    {/* <button class=" px-2 py-2 fill-red drop-shadow-xl" style={{margin:"0px 10px 0px 50px"}}>Load Wallet</button> */}
    {/* <button class="border-2 px-2 py-2">Online</button> */}
    <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white ">
<span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white ">
Online</span>
</button>


      </div>
    </div>
  
    <div class="flex items-center space-x-6">
      
   
      <div class="flex items-center space-x-2">
        <h6 class="font-medium">Wallet :</h6>
        <p class="text-gray-700 font-semibold">200/-</p>
      </div>

     
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          class="flex items-center focus:outline-none"
        >
          <img
            className="w-12 h-12 rounded-full border"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRduYoJopcD2_WmDjt978P3pjTLl-oQX-ZsTOaof805POhNgFzpYEy5LnA&s"
            alt="profile image"
          />
        </button>

        {open && (
          <ul
            className="absolute right-0 mt-3 w-60 shadow-xl/30 z-50 px-4 py-4 rounded-lg"
            style={{ backgroundColor: "#A7B7F1" }}
          >
            <div className="bg-gray-100 rounded-lg">
              <div className="text-center text-gray-700 py-2">
                <h6 className="font-semibold">username</h6>
                <h6 className="text-sm">username@gmail.com</h6>
                <hr className="my-2" />
              </div>
              <li>
                <a
                  href="#profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#logout"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                >
                  Logout
                </a>
              </li>
            </div>
          </ul>
        )}
      </div>
    </div>
  </div>
</nav>

  );
};
