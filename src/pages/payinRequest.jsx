import { useEffect, useRef, useState } from "react";

import Button from "../components/Button";
import { usePost } from "../hooks/usePost";

export const PayinRequest = () => {
  const [payerName, setPayerName] = useState("");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [payerEmailError, setPayerEmailError] = useState("");
  const [payerphoneError, setpayerphoneError] = useState("");

  const [payerMobile, setPayerMobile] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [payerorderid, setPayerOrderId] = useState("");
  const [orderid, setTxnId] = useState("");
  const intervalRef = useRef(null);

  const [qrUrl, setQrUrl] = useState(""); // to store QR image URL
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);

  useEffect(() => {
    let autoFailTimer;
    if (qrUrl) {
      autoFailTimer = setTimeout(() => {
        // After 5 minutes: if still no success => fail
        setShowFailed(true);
        setShowSuccess(false);
        setQrUrl("");
      }, 300000); // 5 min = 300000 ms
    }

    return () => clearTimeout(autoFailTimer);
  }, [qrUrl]);

  useEffect(() => {
    const uniqueorderid = `DSB${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setPayerOrderId(uniqueorderid);
  }, []);

  useEffect(() => {
    if (orderid) {
      intervalRef.current = setInterval(checkpaymentstatus, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [orderid]);

  // ✅ Add this after all the above useEffects
  useEffect(() => {
    let resetTimer;
    if (showSuccess || showFailed) {
      resetTimer = setTimeout(() => {
        setShowSuccess(false);
        setShowFailed(false);
        setQrUrl("");
        setAmount("");
        setPayerName("");
        setPayerMobile("");
        setPayerEmail("");
        const uniqueorderid = `DSB${Date.now()}${Math.floor(
          Math.random() * 1000
        )}`;
        setPayerOrderId(uniqueorderid);
      }, 5000);
    }

    return () => clearTimeout(resetTimer);
  }, [showSuccess, showFailed]);

  const { execute: executePayin } = usePost("/Airpay/request");
  // console.log(execute);
  const handlePayinSubmit = async () => {
    try {
      const payload = {
        buyer_name: payerName,
        buyer_phone: payerMobile,
        buyer_email: payerEmail,
        amount: amount,
        orderid: payerorderid,
      };
      console.log("api clicked");
      const data = await executePayin(payload);
      console.log("api called", data);
      if (data.status === "success") {
        const upiString = data.data.qrcode_string;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
          upiString
        )}`;
        setQrUrl(qrUrl);
        setTxnId(data.data.orderid);
        setShowFailed(false);
        setShowSuccess(false);
      } else {
        setShowFailed(true);
        setShowSuccess(false);
        setQrUrl("");
      }
    } catch (error) {
      console.error("apyin request failed", error);
      setShowFailed(true);
      setShowSuccess(false);
      setQrUrl("");
    }
  };
  const { execute: executecheckstatus } = usePost("/AP/payin/checkstatus");
  const checkpaymentstatus = async () => {
    try {
      if (!orderid) return;
      const formData = new FormData();
      formData.append("orderid", orderid);

      const statusData = await executecheckstatus(formData);
      console.log("statuscheck", statusData);

      if (statusData?.status === "SUCCESS") {
        clearInterval(intervalRef.current);
        setShowSuccess(true);
        setShowFailed(false);
        setQrUrl("");
      } else if (statusData?.status === "FAILED") {
        clearInterval(intervalRef.current);
        setShowFailed(true);
        setShowSuccess(false);
        setQrUrl("");
      }
    } catch (err) {
      console.error("status check failed", err);
    }
  };
  return (
    <>
      <div className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center mb-3 p-2.5">
        <h4 className="font-bold text-white text-lg py-2">
          Create New Payment
        </h4>
      </div>
      {!qrUrl && !showSuccess && !showFailed && (
        <div className="p-5 border border-gray-200 shadow-md m-5">
          <div class="grid md:grid-cols-2 md:gap-6 px-4">
            <div class="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="payer_name"
                id="payer_name"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                for="payer_name"
                class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Payer Name
              </label>
            </div>
            <div class="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="amount"
                id="amount"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  setAmount(value);
                  if (Number(value) < 10) {
                    setAmountError("Amount must be at least ₹10");
                  } else {
                    setAmountError("");
                  }
                }}
                required
              />
              {amountError && (
                <p className="text-red-600 text-sm mt-1">{amountError}</p>
              )}
              <label
                for="amount"
                class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Amount
              </label>
            </div>
          </div>
          <div class="grid md:grid-cols-2 md:gap-6 px-4">
            <div class="relative z-0 w-full mb-5 group">
              <input
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                name="payer_mobile"
                id="payer_mobile"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={payerMobile}
                // onChange={(e) => setPayerMobile(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  setPayerMobile(value);

                  // Simple email validation regex
                  const numberPattern =/^[1-9]\d{9}$/;
                  if (!numberPattern.test(value)) {
                    setpayerphoneError("Enter a valid 10-digit mobile number");
                  } else {
                    setpayerphoneError("");
                  }
                }}
                required
              />
              <label
                for="payer_mobile"
                class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Payer Mobile Number
              </label>
               {payerphoneError && (
                <p className="text-red-600 text-sm mt-1">{payerphoneError}</p>
              )}
            </div>
            <div class="relative z-0 w-full mb-5 group">
              <input
                type="email"
                name="payer_email"
                id="payer_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={payerEmail}
                onChange={(e) => {
                  const value = e.target.value;
                  setPayerEmail(value);

                  // Simple email validation regex
                  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailPattern.test(value)) {
                    setPayerEmailError("Enter a valid email address");
                  } else {
                    setPayerEmailError("");
                  }
                }}
                required
              />
              <label
                htmlFor="payer_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Payer Email Id
              </label>
              {payerEmailError && (
                <p className="text-red-600 text-sm mt-1">{payerEmailError}</p>
              )}
            </div>
          </div>

          <div class="flex justify-center mt-2 py-2">
            <Button
              type="button"
              // onClick={() =>
              //   (window.location.href = "https://live.spay.live/payment")
              // }
              onClick={handlePayinSubmit}
              className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Submit
            </Button>
          </div>
        </div>
      )}
      {qrUrl && !showSuccess && !showFailed && (
        <div className="flex justify-center mt-10">
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Scan to Pay
            </h3>
            <img src={qrUrl} alt="UPI QR Code" className="w-64 h-64 mb-4" />
            <p className="text-gray-600 text-center text-sm">
              Open your UPI app and scan this QR code to complete the payment.
            </p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setQrUrl("")} // optional: go back to form
            >
              Back
            </button>
          </div>
        </div>
      )}
      {showSuccess && !showFailed && (
        <div className="flex justify-center items-center mt-10 w-full">
          <div className="bg-green-100 w-72 h-72 text-green-800 mb-10  rounded-full shadow-xl flex flex-col justify-center items-center animate-fade-in border border-green-300 relative">
            <div className="success-tick flex justify-center items-center mb-2">
              <svg
                className="w-20 h-20 animate-scale-in"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h2 className="text-xl font-bold mt-2">Payment Successful!</h2>
            <p className="text-sm mt-1"></p>
          </div>
        </div>
      )}
      {showFailed && (
        <div className="flex justify-center items-center mt-10 w-full">
          <div className="bg-red-100 w-72 h-72 text-red-700 mb-10 rounded-full shadow-xl flex flex-col justify-center items-center animate-fade-in border border-red-300 relative">
            <div className="failed-tick flex justify-center items-center mb-2">
              <svg
                className="w-20 h-20 animate-scale-in"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </div>

            <h2 className="text-xl font-bold mt-2">Payment Failed!</h2>
            <p className="text-sm mt-1">Please Try Again</p>
          </div>
        </div>
      )}
      <style>
        {`
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(40px) }
  to { opacity: 1; transform: translateY(0) }
}

@keyframes scaleIn {
  0% { transform: scale(0) }
  60% { transform: scale(1.25) }
  100% { transform: scale(1) }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.8s ease-out forwards;
}
`}
      </style>
    </>
  );
};
