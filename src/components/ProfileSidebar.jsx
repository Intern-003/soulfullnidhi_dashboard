import { Link, useNavigate } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import { useState, useEffect, useRef } from "react";

export const ProfileSidebar = ({
  open,
  onClose,
  data,
  role,
  payingAmount,
  Payoutwallet,
}) => {
  // console.log("user data received:", data);

  const [PayAmountVisible, setPayAmountVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { execute: logoutApi } = usePost("/logout");
  const sidebarRef = useRef(null);

  const DASHBOARD_LOCK_KEY = "payment_dashboard_logged_in";

  const handleLogout = async () => {
    if (!showLogoutConfirm) {
      setShowLogoutConfirm(true);
      return;
    }

    setIsLoggingOut(true);
    try {
      await logoutApi();
      // console.log("Logout successful");
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      localStorage.removeItem(DASHBOARD_LOCK_KEY);
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      sessionStorage.removeItem("tabId");

      if (window.BroadcastChannel) {
        const channel = new BroadcastChannel("dashboard_login_channel");
        channel.postMessage({ type: "LOGOUT" });
        channel.close();
      }

      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      onClose();
      navigate("/", { replace: true });
      window.location.reload();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setPayAmountVisible(false);
  }, [open]);

const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

// Prefer prop data, fallback to stored user (admin case)
const effectiveUser = data && Object.keys(data).length ? data : storedUser;

const userName =
  effectiveUser?.name?.trim() ||
  (effectiveUser?.email ? effectiveUser.email.split("@")[0] : "User");

const displayName = userName
  .split(" ")
  .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
  .join(" ");

const displayEmail = effectiveUser?.email?.trim() || "No email available";
const displayInitial = displayName.charAt(0).toUpperCase() || "U";


  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Sidebar - Blue theme */}
      <div
        ref={sidebarRef}
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed top-0 right-0 w-72 md:w-80 h-full z-50
          bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200
          shadow-2xl shadow-blue-600/30
          transform overflow-y-auto transition-all duration-400 ease-out
          ${open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}
          flex flex-col rounded-l-2xl border-l border-blue-300/40
        `}
        role="dialog"
        aria-modal="true"
        aria-label="User Profile Sidebar"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-blue-700 hover:text-blue-900 transition-colors duration-200 z-10"
          aria-label="Close sidebar"
        >
          <i className="fa-solid fa-xmark text-2xl" />
        </button>

        {/* Profile Header - Blue accent */}
        <div className="px-7 py-10 border-b border-blue-300/40 bg-gradient-to-r from-blue-600/5 to-transparent">
          <div className="flex flex-col items-center text-center gap-4">
            <div
              className="w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-blue-500/40 ring-2 ring-blue-400/60 transition-all duration-300 hover:ring-blue-500 hover:shadow-blue-600/50"
              style={{
                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              }}
            >
              {data?.profile_image ? (
                <img
                  src={data.profile_image}
                  alt={`Profile of ${displayName}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl tracking-wide">
                  {displayInitial}
                </div>
              )}
            </div>

            <div>
              <p className="text-xl font-bold text-blue-900 tracking-tight">
                {displayName}
              </p>
              <p className="text-sm text-blue-700 mt-1 opacity-90 truncate max-w-[240px]">
                {displayEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Section */}
        {role !== "admin" && (
          <div className="px-7 py-7 border-b border-blue-300/40">
            <p className="text-xs font-semibold text-blue-600 uppercase mb-5 tracking-wider">
              Wallet Balance
            </p>
            <div className="flex items-center justify-between text-base text-blue-900">
              <span className="font-medium">Payin Wallet</span>
              <div className="flex items-center gap-4">
                <span className={`font-bold transition-all duration-300 ${PayAmountVisible ? "text-emerald-600 scale-105" : "text-blue-800 blur-sm"}`}>
                  {PayAmountVisible ? `₹${payingAmount || "0.00"}` : "•••••••"}
                </span>
                <button
                  onClick={() => setPayAmountVisible(!PayAmountVisible)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label={PayAmountVisible ? "Hide amount" : "Show amount"}
                >
                  <i className={`fa-solid ${PayAmountVisible ? "fa-eye-slash" : "fa-eye"} text-lg`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-7 py-8 flex flex-col gap-4 flex-grow">
          {role !== "admin" && (
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/60 hover:bg-white/80 border border-blue-200 hover:border-blue-400 text-blue-800 hover:text-blue-900 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <i className="fa-solid fa-user text-blue-600 text-xl" />
              <span className="font-medium">My Profile</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-auto flex items-center justify-center gap-4 px-5 py-4 rounded-xl bg-red-50/80 hover:bg-red-100 border border-red-200 hover:border-red-400 text-red-700 hover:text-red-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <i className="fa-solid fa-right-from-bracket text-red-600 text-xl" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        {/* Logout Confirmation */}
        {showLogoutConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-11/12 max-w-sm shadow-2xl border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Sign Out?</h3>
              <p className="text-blue-700 mb-6">You will be logged out of your account.</p>
              <div className="flex gap-4">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? <i className="fa-solid fa-spinner fa-spin" /> : null}
                  {isLoggingOut ? "Signing out..." : "Yes, Sign Out"}
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 bg-blue-100 text-blue-900 rounded-xl hover:bg-blue-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-7 py-5 text-center text-xs text-blue-600/70 border-t border-blue-300/40 mt-auto">
          SPay Fintech Pvt Ltd Dashboard • © 2026
        </div>
      </div>
    </>
  );
};