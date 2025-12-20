import React, { useState } from "react";
import logo from "../images/logo.png";
import paymentGatewayBg from "../images/login-background.jpg";
import { usePost } from "../hooks/usePost";
import { useGet } from "../hooks/useGet";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const navigate = useNavigate();

const {execute: register,error ,loading} = usePost('/create-merchant');

// send otp
const { execute: EmailSendOtp, loading: emailOtpLoading } =usePost('/send-otp-mail');

// verify otp
const { execute: verifyEmailOtpApi } = usePost('/verify-email-otp'); 

// send mobile otp
const { execute: sendMobileOtpApi } = usePost('/send-otp-mail');

// verify mobile otp
const { execute: verifyMobileOtpApi } = usePost('/verify-email-otp');



  // temp otp for testing
  const [devOtp, setDevOtp] = useState("");


// console.log("merchnt registerd" ,register);

  // mobile otp
const [otpSent, setOtpSent] = useState(false);
const [otp, setOtp] = useState("");
const [otpVerified, setOtpVerified] = useState(false);


// email otp
const [emailOtpSent, setEmailOtpSent] = useState(false);
const [emailOtp, setEmailOtp] = useState("");
const [emailOtpVerified, setEmailOtpVerified] = useState(false);




  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    mobile: "",
    password: "",
  });

  // mobile verification
const isValidMobile = formData.mobile.length === 10;


const sendOtp = async () => {
  if (!isValidMobile) return;

  try {
    const res = await sendMobileOtpApi({
      mobile: formData.mobile,
      email: formData.email, // required to check email verified
    });

    setDevOtp(res.otp); // DEV only
    setOtpSent(true);
    alert(`DEV MOBILE OTP: ${res.otp}`);
  } catch (err) {
    alert(err?.response?.data?.message || "Failed to send OTP");
  }
};


const verifyOtp = async () => {
  if (otp.length !== 6) {
    alert("Enter valid OTP");
    return;
  }

  try {
    await verifyMobileOtpApi({
      mobile: formData.mobile,
      otp: otp,
    });

    setOtpVerified(true);
    alert("Mobile verified");
  } catch (err) {
    alert(err?.response?.data?.message || "Invalid OTP");
  }
};


// email verification
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const sendEmailOtpHandler = async () => {
  if (!isValidEmail(formData.email)) {
    alert("Enter valid email"); 
    return;
  }

  try {
    const res = await EmailSendOtp({ email: formData.email });
     setDevOtp(res.otp);
    setEmailOtpSent(true);
     alert(`DEV OTP: ${res.otp}`);
  } catch (err) {
    console.error("Email OTP failed", err);
  }
};


const verifyEmailOtp = async () => {
  if (emailOtp.length !== 6) {
    alert("Enter valid OTP");
    return;
  }

  try {
    await verifyEmailOtpApi({
      email: formData.email,
      otp: emailOtp,
    });

    setEmailOtpVerified(true);
    alert("Email verified");
  } catch (err) {
    alert("Invalid or expired OTP");
  }
};




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
        if (!otpVerified) {
          alert("Please verify mobile number");
          return;
        }

        if (!emailOtpVerified) {
          alert("Please verify email address");
          return;
        }

    try{
      const paylaod ={
        name:formData.companyName,
        email:formData.email,
        mobile_no:formData.mobile,
      };
     await register(paylaod);
     console.log("merchant created");
     alert("merchant created");
    }catch(err){
      console.error("Registration failed", err);
    }
  };

return (
  <div
    className=" flex items-center justify-center bg-white"
    // style={{ background: "linear-gradient(275deg, #c2d1e9ff, #9db4f3ff)" }}
  >
<div className="w-full bg-white/95 overflow-hidden  rounded-2xl">

  {/* 3/4 + 1/4 GRID */}
  <div className="grid grid-cols-1 md:grid-cols-4">

    {/* LEFT: IMAGE (1/4) */}
    <div
      className="hidden md:block md:col-span-1 bg-cover bg-center"
      style={{ backgroundImage: `url(${paymentGatewayBg})` }}
      // style={{backgroundImage: `url("https://www.freepik.com/free-ai-image/mobile-payment-illustration_415578054.htm#fromView=search&page=1&position=12&uuid=26e5ec46-36d6-47ba-aa43-d12969d51c69&query=payment+gateway+image")`}}
    />

    {/* RIGHT: FORM (3/4) */}
    <div className="md:col-span-3 p-6 "
    style={{background: "linear-gradient(275deg, #dde6fcff, #dde6fcff)"}}>

      {/* LOGO */}
      <div className="flex justify-center mb-4">  
        <img
          src={logo}
          alt="SPay Logo"
          className="w-32 object-contain"
        />
      </div>

      <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 2 COLUMN INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} />
{/* Email + OTP */}
<div className="md:col-span-2 space-y-3">
  <div className="flex gap-3">
    <div className="flex-1">
      <FloatingInput
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
      />
    </div>

    {!emailOtpSent && (
      <button
        type="button"
        onClick={sendEmailOtpHandler}
        disabled={!isValidEmail(formData.email) ||  emailOtpLoading}
        className="px-4 py-2 text-sm font-semibold rounded-lg
          bg-blue-600 text-white disabled:bg-gray-300"
      >
       {emailOtpLoading ? "Sending..." : "Send OTP"}
      </button>
    )}
  </div>
{devOtp && (
  <p className="text-sm text-red-600">
    DEV OTP: {devOtp}
  </p>
)}
  {emailOtpSent && !emailOtpVerified && (
    <div className="flex gap-3">
      <input
        type="text"
        value={emailOtp}
        onChange={(e) => setEmailOtp(e.target.value)}
        placeholder="Enter Email OTP"
        maxLength={6}
        className="
          w-full h-12 px-4 border-b border-gray-300
          bg-transparent focus:outline-none focus:border-blue-600
        "
      />

      <button
        type="button"
        onClick={verifyEmailOtp}
        className="px-4 py-2 text-sm font-semibold rounded-lg
          bg-green-600 text-white"
      >
        Verify
      </button>
    </div>
  )}

  {emailOtpVerified && (
    <p className="text-sm text-green-600 font-medium">
      ✔ Email verified
    </p>
  )}
</div>
          {/* Mobile + OTP */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <FloatingInput
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>

                {!otpSent && (
            <button
              type="button"
              disabled={!isValidMobile || !emailOtpVerified}
              onClick={sendOtp}
              className="px-4 py-2 text-sm font-semibold rounded-lg
                bg-blue-600 text-white disabled:bg-gray-300"
            >
              Send OTP
            </button>

                )}
              </div>
        {devOtp && (
          <p className="text-sm text-red-600">
            DEV OTP: {devOtp}
          </p>
        )}
              {otpSent && !otpVerified && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    maxLength={6}
                    className="
                      w-full h-12 px-4 border-b border-gray-300
                      bg-transparent focus:outline-none focus:border-blue-600
                    "
                  />

                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="px-4 py-2 text-sm font-semibold rounded-lg
                      bg-green-600 text-white"
                  >
                    Verify
                  </button>
                </div>
              )}

              {otpVerified && (
                <p className="text-sm text-green-600 font-medium">
                  ✔ Mobile number verified
                </p>
              )}
            </div>

         
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-3 bg-gradient-to-r from-[#062f70] to-[#0d3dc4]
          text-white font-semibold rounded-xl shadow-md hover:shadow-xl
          hover:-translate-y-0.5 transition-all"
          
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-5">
        Already have an account?{" "}
        <span onClick={() => navigate("/")} className="text-blue-700 font-semibold hover:underline">
          Sign in
        </span>
      </p>
    </div>

  </div>
</div>

  </div>
);



};

/* 🔹 Floating Input */
const FloatingInput = ({ placeholder, ...props }) => {
  return (
    <div className="relative">
      <input
        {...props}
        required
        placeholder=" "
        className="
          peer w-full h-12 px-4 text-gray-900
          border-0 border-b border-gray-300
          bg-transparent
          focus:outline-none
          focus:border-b-1 focus:border-blue-300
          transition
        "
      />
      <span
        className="
          absolute left-4 top-1/2 -translate-y-1/2
          text-gray-800 text-sm pointer-events-none
          transition-all
          peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600
          peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs
        "
      >
        {placeholder}
      </span>
    </div>
  );
};

export default Register;
