import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ✅ add useLocation
import { usePost } from "../hooks/usePost";
import useAutoFetch from "../hooks/useAutoFetch";
import { useGet } from "../hooks/useGet";
import { ProfileSidebar } from "./ProfileSidebar";


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

// payin wallet

const payingAmount = data?.PayingAmount ?? "0.00";

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
      {/* left side buttons */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-2xl text-blue-600">☰</button>
      </div>

      {/* right side */}
      <div className="flex items-center justify-end gap-4">
        {/* Profile Icon */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setOpen(!open)} className="flex items-center focus:outline-none">
            <img
              className="w-10 h-10 rounded-full border"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRduYoJopcD2_WmDjt978P3pjTLl-oQX-ZsTOaof805POhNgFzpYEy5LnA&s"
              alt="profile"
            />
          </button>
        </div>
      </div>

      {/* Profile Sidebar */}
      <ProfileSidebar
        open={open}
        onClose={() => setOpen(false)}
        data={merchantData?.data}
        role={role}
        payingAmount={payingAmount}
      />
    </nav>
  );
};

