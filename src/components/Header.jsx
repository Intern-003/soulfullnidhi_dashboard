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
    <nav class="bg-white shadow-lg shadow-indigo-500/50">
      <div class="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <div>
          <div>
            <span className="font-semibold">Payin Rolling Amount: </span>
            <span>165.08/-</span>
          </div>
          <div>
            <span className="font-semibold">Payin Total Charges: </span>
            <span>23.04/-</span>
          </div>
        </div>
        <div class="flex items-center space-x-6">
          <div>
            <div>
              <span className="font-semibold">Payout Wallet: </span>
              <span>54.40/-</span>
            </div>
            <div>
              <span className="font-semibold">Payin Wallet: </span>
              <span>365/-</span>
            </div>
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
                    <h6 className="font-semisemibold">username</h6>
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
