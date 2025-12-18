import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ✅ add useLocation
import { usePost } from "../hooks/usePost";
import useAutoFetch from "../hooks/useAutoFetch";
import { useGet } from "../hooks/useGet";

export const Header = ({ onMenuClick }) => {
  
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current route
  const { execute: logout } = usePost("/logout");
  const { data } = useAutoFetch("/collection-record");
  const { data: merchantData } = useGet("/show-merchant");
  // console.log(data);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [activeStat, setActiveStat] = useState(null);

  // State for role
  const [role, setRole] = useState(atob(localStorage.getItem("role"))); // admin / user / crypto
  const email = localStorage.getItem("email");

  // ✅ Show button only for specific email AND only on dashboard page
  const showButton = email === "saad.sayyed@example.com" && location.pathname === "/dashboard";


  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userStats = [
    { id: 1, icon: "fa-solid fa-arrow-trend-up text-green-400", label: "Payin Rolling Amount", value: `${Number(data?.PayinRollingAmount ?? 0).toFixed(2)}` },
    { id: 2, icon: "fa-solid fa-arrow-trend-up text-green-400", label: "Payin Total Charges", value: `${Number(data?.PayinProfitAmount ?? 0).toFixed(2)}` },
    { id: 3, icon: "fa-solid fa-wallet text-red-400", label: "Payout Wallet", value: `${Number(data?.payout_wallet ?? 0).toFixed(2)}` },
    { id: 4, icon: "fa-solid fa-wallet text-green-400", label: "Payin Wallet", value: `${Number(data?.PayingAmount ?? 0).toFixed(2)}` },
  ];

  const cryptoStats = [
    { id: 101, icon: "fa-brands fa-bitcoin text-yellow-400", label: "Crypto Wallet", value: `${Number(data?.total_crypto ?? 0).toFixed(2)}` },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      localStorage.removeItem(DASHBOARD_LOCK_KEY);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="flex items-center justify-between w-full px-4 py-3 bg-white shadow-lg shadow-indigo-500/50">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-2xl text-blue-600">☰</button>

        {/* Role Toggle button: ✅ only on dashboard page */}
   

        {/* Stats */}
        {role !== "admin" && (
          <>
            <div className="hidden md:flex items-center gap-6">
              {(role === "crypto" ? cryptoStats : userStats).map((item) => (
                <div key={item.id}>
                  <i className={`${item.icon} me-2 fa-lg`}></i>
                  <span>{item.label}: </span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 md:hidden relative">
              {(role === "crypto" ? cryptoStats : userStats).map((item) => (
                <div key={item.id} className="relative"
                  onMouseEnter={() => setActiveStat(item.id)}
                  onMouseLeave={() => setActiveStat(null)}
                >
                  <button onClick={() => setActiveStat(activeStat === item.id ? null : item.id)}
                          className="flex flex-col items-center">
                    <i className={`${item.icon} fa-xl`}></i>
                  </button>

                  {activeStat === item.id && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg p-2 text-sm text-gray-700 w-40 text-center z-50">
                      <div>{item.label}</div>
                      <div className="font-semibold">{item.value}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
<div className="flex items-center justify-end gap-4">
  {/* Payout Wallet - only for admin */}
  {role === "admin" && (
    <div className="text-gray-800 font-semibold flex items-center gap-1">
          <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9h14z"
        />
      </svg>
      <span>Payout Wallet: </span>
      <span>₹{Number(data?.cashfree_balance ?? 0).toFixed(2)}</span>
      {/* Optional: Add wallet icon */}
  
    </div>
  )}

  {/* Profile Dropdown */}
  <div className="relative" ref={dropdownRef}>
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center focus:outline-none"
    >
      <img
        className="w-10 h-10 rounded-full border"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRduYoJopcD2_WmDjt978P3pjTLl-oQX-ZsTOaof805POhNgFzpYEy5LnA&s"
        alt="profile"
      />
    </button>

    {open && (
      <ul
        className="absolute right-0 mt-3 w-60 shadow-xl/30 z-50 px-4 py-4 rounded-lg"
        style={{ backgroundColor: "#A7B7F1" }}
      >
        <div className="bg-gray-100 rounded-lg">
          <div className="text-center text-gray-700 py-2">
            <h6 className="font-semibold">{merchantData?.data?.name || "Admin"}</h6>
            <h6 className="text-sm">{merchantData?.data?.email}</h6>
            <hr className="my-2" />
          </div>
          {role !== "admin" && (
            <li>
              <Link
                to={"/profile"}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
              >
                Profile
              </Link>
            </li>
          )}
          <li>
            <a
              onClick={handleLogout}
              className="cursor-pointer block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
            >
              Logout
            </a>
          </li>
        </div>
      </ul>
    )}
  </div>
</div>

    </nav>
  );
};
