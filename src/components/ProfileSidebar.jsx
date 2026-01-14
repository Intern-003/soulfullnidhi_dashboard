import { Link, useNavigate } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import { useState } from "react";

export const ProfileSidebar = ({
  open,
  onClose,
  data,
  role,
  payingAmount,
  Payoutwallet,
}) => {
  console.log("user data", data);
  const [PayAmount, setPayAmount] = useState(false);
  const navigate = useNavigate();
  const { execute: logout } = usePost("/logout");

  const DASHBOARD_LOCK_KEY = "payment_dashboard_logged_in";

  const handleLogout = async () => {
    try {
      await logout(); // optional backend logout
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      // 🔐 ALWAYS clear dashboard lock
      localStorage.removeItem("payment_dashboard_logged_in");

      // 🧹 clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      // 🧹 clear tab id
      sessionStorage.removeItem("tabId");

      // 📢 notify other tabs
      if (window.BroadcastChannel) {
        const channel = new BroadcastChannel("dashboard_login_channel");
        channel.postMessage({ type: "LOGOUT" });
        channel.close();
      }

      onClose();
      navigate("/", { replace: true });
    }
  };

  //     try {
  //       await logout();
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("role");
  //       onClose();
  //       navigate("/");
  //     } catch (err) {
  //       console.error("Logout failed:", err);
  //     }
  //   };

  // const handleLogout = async () => {
  //   try {
  //     await logout(); // optional backend cleanup
  //   } catch (err) {
  //     console.error("Logout API failed:", err);
  //   } finally {
  //     // ALWAYS logout frontend
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("role");

  //     onClose(); // close sidebar
  //     navigate("/", { replace: true });
  //   }
  // };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/20 z-40" />
      )}

      {/* Drawer */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed top-0 right-0 w-64 h-full z-50
          bg-[#dce8ff] shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
          flex flex-col
        `}
      >
        {/* Identity */}
        <div className="px-5 py-6 border-b border-gray-400">
          <div className="flex flex-col items-center text-center gap-2">
            <div
              className="w-14 h-14 rounded-full text-white flex items-center justify-center font-semibold text-xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(250deg, #083657ff 0%, #648cbbff 100%)",
              }}
            >
              {data?.profile_image ? (
                <img
                  src={data.profile_image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                data?.name?.charAt(0) || "A"
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {data?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                {data?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Wallets (for non-admins) */}
        {role !== "admin" && (
          <div className="px-5 py-4 border-b border-gray-400">
            <p className="text-[11px] font-semibold text-gray-400 uppercase mb-3">
              Wallets
            </p>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Payin Wallet</span>
              <span className="font-semibold text-indigo-600">
                {PayAmount ? `₹${payingAmount}` : `******`}
              </span>
              <button
                type="button"
                onClick={() => setPayAmount((prev) => !prev)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i
                  className={`fa-solid ${
                    PayAmount ? "fa-eye-slash" : "fa-eye"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Account */}
        <div className="px-5 py-4 flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-gray-400 uppercase mb-3">
            Account
          </p>
          {role !== "admin" && (
            <Link
              to="/profile"
              className="flex items-center gap-3 text-sm text-gray-700 py-2 hover:text-indigo-600 transition"
            >
              <i className="fa-solid fa-user text-gray-400"></i>
              <span>Profile</span>
            </Link>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm text-red-600 py-2 hover:text-red-700 transition"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
