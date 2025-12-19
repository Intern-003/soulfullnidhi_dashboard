import { useState, useEffect, useRef } from "react"; 
import logo from "../images/logo.png";
import paymentGatewayBg from "../images/login-background.jpg";
import { usePost } from "../hooks/usePost";
import { useNavigate } from "react-router-dom";

const DASHBOARD_LOCK_KEY = "payment_dashboard_logged_in";

// Unique ID per tab
const TAB_ID =
  sessionStorage.getItem("tabId") ||
  (() => {
    const id = crypto.randomUUID();
    sessionStorage.setItem("tabId", id);
    return id;
  })();

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const channelRef = useRef(null);

  const { execute: login, error, loading } = usePost("/login");

  // BroadcastChannel to notify other tabs
  useEffect(() => {
    if (!window.BroadcastChannel) return;
    const channel = new BroadcastChannel("dashboard_login_channel");
    channelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data.type === "LOGIN") {
        alert("Another logged in from a different tab!");
        navigate("/");
      }
    };

    return () => channel.close();
  }, [navigate]);

  // Clear lock on tab close
  useEffect(() => {
    const handleUnload = () => {
      const lock = JSON.parse(localStorage.getItem(DASHBOARD_LOCK_KEY) || "{}");
      if (lock.tabId === TAB_ID) {
        localStorage.removeItem(DASHBOARD_LOCK_KEY);
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lock = JSON.parse(localStorage.getItem(DASHBOARD_LOCK_KEY) || "{}");
    if (lock.userId && lock.userId !== formData.email) {
      alert("Another admin is already logged in on a different tab.");
      return;
    }

    try {
      const response = await login(formData);
      if (response) {
        // Save login info
        localStorage.setItem("token", response.token);
        localStorage.setItem("email", response.user.email);
        localStorage.setItem("role", btoa(response.user.role_type));
        localStorage.setItem("user", JSON.stringify(response.user));

        // Set dashboard lock
        localStorage.setItem(
          DASHBOARD_LOCK_KEY,
          JSON.stringify({ userId: response.user.id, tabId: TAB_ID })
        );

        // Broadcast login to other tabs
        channelRef.current?.postMessage({ type: "LOGIN", userId: response.user.id });

        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.log("Login failed:", err);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-70"
        style={{ backgroundImage: `url(${paymentGatewayBg})` }}
      ></div>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200 opacity-90">
        <div className="flex justify-center mb-6">
          <img className="w-35 mr-2" src={logo} alt="logo" />
        </div>
        <h1 className="text-xl font-bold mb-6 text-center text-blue-600">
          Sign in to your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative z-0 w-full mb-5">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${error?.errors?.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-600"}`}
              placeholder=" "
              required
            />
            <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
              Email
            </label>
            {error?.errors?.email && <p className="mt-1 text-sm text-red-500">{error.errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative z-0 w-full mb-5">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${error?.errors?.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-600"}`}
              placeholder=" "
              required
            />
            <label htmlFor="password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
              Password
            </label>
            <button type="button" className="absolute right-0 top-2.5 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </button>
            {error?.errors?.password && <p className="mt-1 text-sm text-red-500">{error.errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition focus:ring-4 focus:ring-blue-300 disabled:opacity-70"
          >
            {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Signing in...</span> : "Sign in"}
          </button>
          <p className="text-center">New to Spay? <span onClick={() => navigate("/register")}>Create an account</span></p>
        </form>
      </div>
    </section>
  );
}

export default LoginForm;
