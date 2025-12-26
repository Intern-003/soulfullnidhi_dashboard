import React, { useEffect, useState } from "react";
import { Stepper } from "../components/Stepper";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../components/ConfirmModal";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import { useLocation } from "react-router-dom";


export const Kyc = () => {

  const location = useLocation();
  const [errors, setErrors] = useState();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const toast = useToast();
const user = location.state?.user || {};
console.log("user data",user);
const singlemerchant = location.state?.merchant || {};
console.log("single merchant",singlemerchant);




  const [memberFormData, setMemberFormData] = useState({
    id: user.id || singlemerchant.id || "",
    name: user.name || singlemerchant.name ||"",
    mobile_no:user.mobile_no||  singlemerchant.mobile ||"",
    email: user.email ||singlemerchant.email || "",
    business_mcc: "",
    city: "",
    district: "",
    state: "",
    pin_code: "",
    address: "",
    company_pan_no: "",
    company_gst_no: "",
    cin_llpin: "",
    account_holder_name: "",
    bank_account_no: "",
    ifsc_code: "",
    website_url: "",
    company_type: "",
    date_of_incorporation: "",
    cancel_cheque_doc: null,
    company_pan_no_doc: null,
    company_gst_no_doc: null,
    director_info: [
      {
        director_name: "",
        director_pan_no: "",
        director_aadhar_no: "",
        director_gender: "",
        director_dob: "",
        user_pan_doc: null,
        user_addhar_doc: null,
      },
    ],
    video_kyc: null,
    payin_at_onboard: "",
    payout_at_onboard: "",
    scheme_id: "",

  });

// Add this useEffect near the top
useEffect(() => {
  // Restore from localStorage
  const saved = localStorage.getItem("kycFormData");
  if (saved) {
    const data = JSON.parse(saved);
    setMemberFormData(prev => ({ ...prev, ...data }));
  }

  // Warn before refresh
  const warn = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  window.addEventListener("beforeunload", warn);
  return () => window.removeEventListener("beforeunload", warn);
}, []);

// Auto-save text fields
useEffect(() => {
  const savable = { ...memberFormData };
  delete savable.video_kyc;
  delete savable.company_pan_no_doc;
  delete savable.company_gst_no_doc;
  delete savable.cancel_cheque_doc;
  savable.director_info = savable.director_info.map(d => ({
    director_name: d.director_name,
    director_pan_no: d.director_pan_no,
    director_aadhar_no: d.director_aadhar_no,
    director_gender: d.director_gender,
    director_dob: d.director_dob,
  }));

  localStorage.setItem("kycFormData", JSON.stringify(savable));
}, [memberFormData]);

const stepRequiredFields = {
  1: [
    "name",
    "mobile_no",
    "email",
    "business_mcc",
     "website_url",
    "city",
    "district",
    "state",
    "pin_code",
    "address",
  ],
  2: [
    "company_pan_no",
    "company_gst_no",
    "cin_llpin",
    "company_type",
    "date_of_incorporation",
    "company_pan_no_doc",   // add file here
    "company_gst_no_doc",   // add file here
    "cancel_cheque_doc",    // add file here
    "account_holder_name", 
    "bank_account_no",    
    "ifsc_code",
  ],
  3: [
    "director_name",
    "director_pan_no",
    "director_aadhar_no",
    "director_gender",
    "director_dob",
    "user_pan_doc",     // add director files here if required
    "user_addhar_doc",
  ],
  4:[
    "video_kyc"
  ],
};
  const navigate = useNavigate();





  const { execute: executeMember } = usePost("/kyc-merchant");



  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
const nameRegex = /^[A-Za-z ]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const textRegex = /^[A-Za-z]+$/;
const textNumberRegex = /^[A-Za-z0-9]+$/;
const numberRegex = /^[0-9]{4}$/;
const pinnumberRegex = /^[0-9]{6}$/;
const aadharRegex = /^[0-9]{12}$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const websiteRegex = /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/;
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const cinRegex = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;




const validationRules = {
  name: {
    required: true,
    pattern: nameRegex,
    message: "Name is not valid",
  },
  email: {
    required: true,
    pattern: emailRegex,
    message: "Email is not valid",
  },
  business_mcc: {
    required: true,
    pattern: numberRegex,
    message: "Business MCC must be 4 digits",
  },
city: { 
  required: true, 
  minLength: 2, 
  pattern: /^[A-Za-z ]+$/, 
  message: "Valid city name required" 
},
  state: { 
    required: true, 
    minLength: 2,
     pattern: /^[A-Za-z ]+$/,
      message: "Valid state name required"
     },
  district: { 
    required: true, 
    minLength: 2, 
    pattern: /^[A-Za-z ]+$/, 
    message: "Valid district name required"
   },
  address: { 
    required: true, 
    minLength: 10,
     message: "Address must be at least 10 characters" 
    },

  pin_code: {
    required: true,
    pattern: pinnumberRegex,
    message: "Pin code must be 6 digits",
  },
    website_url: {
      required: true,
      pattern: websiteRegex,
      message: "Website URL must be like https://example.com",
    },


  account_holder_name: {
    required: true,
    pattern: nameRegex,
    message: "Account holder name is not valid",
  },

  bank_account_no: {
    required: true,
    pattern: /^[0-9]{9,18}$/,
    message: "Bank account number must be 9–18 digits",
  },

  ifsc_code: {
    required: true,
    pattern: ifscRegex,
    message: "IFSC is not valid (e.g. HDFC0001234)",
  },

  cin_llpin: {
    required: true,
    pattern: cinRegex,
    message: "CIN is not valid (e.g. L12345MH2010PLC123456)",
  },

  company_pan_no: {
    required: true,
    pattern: panRegex,
    message: "Company PAN is not valid (e.g. ABCDE1234F)",
  },

  company_gst_no: {
    required: true,
    pattern: gstRegex,
    message: "GST is not valid (e.g. 27AAAPZ1234C1Z1)",
  },

  // 👤 Director
  director_name: {
    required: true,
    pattern: nameRegex,
    message: "Director name is not valid",
  },

  director_pan_no: {
    required: true,
    pattern: panRegex,
    message: "Director PAN is not valid (e.g. ABCDE1234F)",
  },

  director_aadhar_no: {
    required: true,
    pattern: aadharRegex,
    message: "Aadhaar must be 12 digits   ",
  },
  user_pan_doc: {
  required: true,
  message: "PAN document is required",
},

user_addhar_doc: {
  required: true,
  message: "Aadhaar document is required",
},
company_type: { 
  required: true, 
  message: "Please select company type"
 },
date_of_incorporation: {
   required: true,
    message: "Date of incorporation is required"
   },
director_gender: { 
  required: true,
   message: "Please select gender"
   },
director_dob: { 
  required: true, 
  message: "Date of birth is required" 
},

  // 🎥 Video KYC
  video_kyc: {
    required: true,
    message: "Please upload your Video KYC recording",
  },
};

  
const validateStep = () => {
  const requiredFields = stepRequiredFields[currentStep];
  const newErrors = {};

  const validateValue = (value, field) => {
    const rules = validationRules[field];

    // required check
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return "This field is required";
    }

    // regex check (only if rule exists)
    if (rules?.pattern && typeof value === "string") {
      if (!rules.pattern.test(value.trim())) {
        return rules.message || "Invalid format";
      }
    }

    return null;
  };

  // 👤 STEP 3 — Directors
  if (currentStep === 3) {
    memberFormData.director_info.forEach((director, idx) => {
      requiredFields.forEach((field) => {
        const error = validateValue(director[field], field);

        if (error) {
          if (!newErrors.director) newErrors.director = [];
          newErrors.director[idx] = {
            ...newErrors.director[idx],
            [field]: error,
          };
        }
      });
    });
  }
  // 🧾 Other steps
else {
  requiredFields.forEach((field) => {
    const value = field === "video_kyc" ? memberFormData.video_kyc : memberFormData[field];
    const error = validateValue(value, field);  // ← Use 'value', not memberFormData[field]
    if (error) {
      newErrors[field] = error;
    }
  });
}

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleNext = () => {
    if (validateStep()) {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
    } 
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert credentials_id to integer
    const newValue =
      name === "credentials_id" ? parseInt(value, 10) || "" : value;

    if (name === "payin_at_onboard" && value === "Airpay") {
      refetchCredentials();
    }

    setMemberFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

const handleDirectorChange = (index, e) => {
  const { name, value, files } = e.target;
  setMemberFormData((prev) => {
    const updatedDirectors = [...prev.director_info];
    updatedDirectors[index] = {
      ...updatedDirectors[index],
      [name]: files ? files[0] : value,
    };
    return { ...prev, director_info: updatedDirectors };
  });
  // console.log(`Director ${index} ${name}:`, files ? files[0] : value);
};


  const addDirector = () => {
    setMemberFormData((prev) => ({
      ...prev,
      director_info: [
        ...prev.director_info,
        {
          director_name: "",
          director_gender: "",
          director_pan_no: "",
         
          director_aadhar_no: "",
          user_pan_doc: null,
          user_addhar_doc: null,
          director_dob: "",
        },
      ],
    }));
  };

  const removeDirector = (index) => {
    setMemberFormData((prev) => ({
      ...prev,
      director_info: prev.director_info.filter((_, i) => i !== index),
    }));
  };
const handleCompanyFileChange = (e) => {
  const { name, files } = e.target;
  const file = files?.[0];

  if (!file) {
    setMemberFormData((prev) => ({ ...prev, [name]: null }));
    return;
  }

  // Allow only PDF
  if (file.type !== "application/pdf") {
    toast.error(`Only PDF files are allowed for ${name.replace(/_/g, " ")}`);
    e.target.value = ""; // Clear input
    return;
  }

  // Optional: Size limit (e.g., 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error("File size should be less than 5MB");
    e.target.value = "";
    return;
  }

  setMemberFormData((prev) => ({
    ...prev,
    [name]: file,
  }));
};

const handleDirectorFileChange = (index, e) => {
  const { name, files } = e.target;
  const file = files?.[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
    toast.error("Only PDF files are allowed!");
    e.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("File size must be under 5MB");
    e.target.value = "";
    return;
  }

  setMemberFormData(prev => {
    const updated = [...prev.director_info];
    updated[index][name] = file;
    return { ...prev, director_info: updated };
  });
};


const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setMemberFormData((prev) => ({ ...prev, video_kyc: file }));
      setErrors((prev) => ({ ...prev, video_kyc: null })); // Clear error
    } else {
      toast.error("Please upload a valid video file");
    }
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateStep()) return;

  try {
    const formData = new FormData();
    // Add this right after creating formData
    // if (user.id) {
    //   formData.append("id", user.id);
    // }

    const merchantId = user.id || singlemerchant.id;
    if (!merchantId) {
      toast.error("Merchant ID missing – cannot submit KYC");
      return;
    }
    formData.append("id", merchantId);

    // console.log("===== Form Submission   Start =====");

    // Append text fields (excluding files and directors)
    Object.keys(memberFormData).forEach((key) => {
      if (!["director_info", "company_pan_no_doc", "company_gst_no_doc", "cancel_cheque_doc"].includes(key)) {
        formData.append(key, memberFormData[key]);
        // console.log(`[Text] ${key}:`, memberFormData[key]);
      }
    });

    // Append company files
    ["company_pan_no_doc", "company_gst_no_doc", "cancel_cheque_doc"].forEach((fileKey) => {
      if (memberFormData[fileKey] instanceof File) {
        formData.append(fileKey, memberFormData[fileKey]);
        // console.log(`[File] ${fileKey}:`, memberFormData[fileKey].name);
      }
    });

    // Video KYC file
      if (memberFormData.video_kyc instanceof File) {
        formData.append("video_kyc", memberFormData.video_kyc);
      }

    // Append directors correctly
    memberFormData.director_info.forEach((director, idx) => {
      Object.keys(director).forEach((field) => {
        const value = director[field];
        if (value instanceof File) {
          formData.append(`director_info[${idx}][${field}]`, value);
          // console.log(`[File] director_info[${idx}][${field}]:`, value.name);
        } else {
          formData.append(`director_info[${idx}][${field}]`, value);
          // console.log(`[Text] director_info[${idx}][${field}]:`, value);
        }
      });
    });

    // console.log("===== Form Submission End =====");

    await executeMember(formData);
    toast.success("Form submitted successfully!");
    navigate("/member-list");

  } catch (err) {
    const errors = err?.response?.data?.errors;
    const msg = errors
      ? Object.values(errors)[0][0]
      : err?.response?.data?.message || "Something went wrong";
    toast.error(msg);
  }
};

const stepHeadings = {
  1: {
    title: "Merchant Details",
    subtitle: "Basic business information"
  },
  2: {
    title: "Company & Bank Details",
    subtitle: "Legal and banking information"
  },
  3: {
    title: "Director Details",
    subtitle: "Director KYC information"
  },
  4: {
    title: "Video KYC",
    subtitle: "video kyc information"
  }
};



  return (
    <>
   <div className="min-h-screen bg-slate-100 flex justify-center">
  <div className="w-full px-6 py-8">
      <div className="rounded-2xl overflow-hidden">

        {/* HEADER */}
        <div
          className="px-6 py-4"
          style={{ background:"linear-gradient(275deg, #7ea1d8ff, #1d2f61ff)" }}
        >
          <h4 className="font-bold text-white text-lg">
            Complete Your KYC
          </h4>
        </div>
<div
  className="flex items-start gap-6 p-8 shadow-xl/30"
  style={{ background:"linear-gradient(175deg, #e8f8ffff, #e3e4e7ff)" }}
>
  {/* STEPPER — 1/4 */}
  <div className="w-1/4 shrink-0">
    <Stepper currentStep={currentStep} />
  </div>

  {/* FORM — 3/4 */}
  <div className="w-3/4 rounded-2xl shadow-xl/10 bg-white  p-8">


        {/* Dynamic Step Heading */}
    {/* <div className="mb-6 border-b pb-4">
      <h2 className="text-xl font-semibold text-gray-800">
        {stepHeadings[currentStep].title}
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        {stepHeadings[currentStep].subtitle}
      </p>
    </div> */}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {currentStep === 1 && (
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div className="relative">
              <input
              readOnly
                type="text"
                name="name"
                id="floating_outlined_name"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-md text-black bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0  ${
                  errors?.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={memberFormData.name}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_name"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.name
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                Business Name <span className="text-red-600">*</span>
              </label>
              {errors?.name && (
                <span className="mt-1 text-sm text-red-500">
                  {errors?.name}
                </span>
              )}
            </div>
            <div className="relative">
              <input
              readOnly
                type="number"
                name="mobile_no"
                id="floating_outlined_mobile"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.mobile_no ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={memberFormData.mobile_no}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_mobile"
                className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.mobile_no
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                Business Mobile <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
              readOnly
                type="email"
                name="email"
                id="floating_outlined_email"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={memberFormData.email}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_email"
                className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.email
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                Business Email <span className="text-red-600">*</span>
              </label>
              {errors?.email && (
                <span className="text-sm text-red-500">{errors?.email}</span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                name="business_mcc"
                id="floating_outlined_mcc"
                className={`block mt-7 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.business_mcc ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={memberFormData.business_mcc}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_mcc"
                className={`absolute mt-3 text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.business_mcc
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                Business MCC <span className="text-red-600">*</span>
              </label>
              {errors?.business_mcc && (
                <span className="text-sm text-red-500">
                  {errors?.business_mcc}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="city"
                id="floating_outlined_city"
                className={`block mt-4 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.city ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={memberFormData.city}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_city"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.city
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                City <span className="text-red-600">*</span>
              </label>
              {errors?.city && (
                <span className="text-sm text-red-500">{errors?.city}</span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="state"
                id="floating_outlined_state"
                className={`block mt-5 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.state ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={memberFormData.state}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_state"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.state
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                State <span className="text-red-600">*</span>
              </label>
              {errors?.state && (
                <span className="text-sm text-red-500">{errors?.state}</span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="district"
                id="floating_outlined_district"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.district ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={memberFormData.district}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_district"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.district
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                District <span className="text-red-600">*</span>
              </label>
              {errors?.district && (
                <span className="text-sm text-red-500">{errors?.district}</span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                name="pin_code"
                id="floating_outlined_pin"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.pin_code ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={memberFormData.pin_code}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_pin"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.pin_code
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                Pincode <span className="text-red-600">*</span>
              </label>
              {errors?.pin_code && (
                <span className="text-sm text-red-500">{errors?.pin_code}</span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="address"
                id="floating_outlined_address"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.address ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
                value={memberFormData.address}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_address"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.address
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                Address <span className="text-red-600">*</span>
              </label>
              {errors?.address && (
                <span className="text-sm text-red-500">{errors?.address}</span>
              )}
            </div>
             <div className="relative">
              <input
                type="text"
                name="website_url"
                id="floating_outlined_web"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.website_url ? "border-red-500" : "border-gray-300"
                }`}
                value={memberFormData.website_url}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_web"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.website_url
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                Website Url <span className="text-red-600">*</span>
              </label>
              {errors?.website_url && (
                <span className="text-sm text-red-500">
                  {errors?.website_url}
                </span>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid gap-6 mb-5 md:grid-cols-2">
<div className="relative">
  <input
    type="text"
    name="company_pan_no"
    id="floating_outlined_pan"
    className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg 
      border appearance-none peer focus:outline-none focus:ring-0
      border-t-transparent peer-placeholder-shown:border-t-gray-300
      ${errors?.company_pan_no ? "border-red-500" : "border-gray-300"}
    `}
    placeholder=" "
    value={memberFormData.company_pan_no}
    onChange={handleChange}
  />
  <label
    htmlFor="floating_outlined_pan"
    className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 bg-white
      ${errors?.company_pan_no
        ? "text-red-600 peer-focus:text-red-600"
        : "text-gray-500 peer-focus:text-blue-600"
      }
      peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
      peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
    `}
  >
    Company Pan Number <span className="text-red-600">*</span>
  </label>
  {/* Error Message */}
  {errors?.company_pan_no && (
    <span className="mt-1 text-sm text-red-500 block">
      {errors.company_pan_no}
    </span>
  )}
</div>
      <div className="relative">
 <input type="file" name="company_pan_no_doc" className="block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0" onChange={handleCompanyFileChange} />

  <label
    htmlFor="floating_outlined_pan_doc"
    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
  >
    Document Of Pan Card <span className="text-red-600">*</span>
  </label>
  {errors?.company_pan_no_doc && (
  <span className="text-sm text-red-500">
    {errors.company_pan_no_doc}
  </span>
)}

  </div>
            <div className="relative">
              <input
                type="text"
                name="company_gst_no"
                id="floating_outlined_gst"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.company_gst_no ? "border-red-500" : "border-gray-300"
                }`}
                value={memberFormData.company_gst_no}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_gst"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.company_gst_no
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                GST Number <span className="text-red-600">*</span>
              </label>
              {errors?.company_gst_no && (
                <span className="text-sm text-red-500">
                  {errors?.company_gst_no}
                </span>
              )}
            </div>
            <div className="relative">
<input type="file" name="company_gst_no_doc" className="block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0" onChange={handleCompanyFileChange} />



              <label
                for="floating_outlined_gst_doc"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Document Of GST Number <span className="text-red-600">*</span>
              </label>
              {errors?.company_gst_no_doc && (
  <span className="text-sm text-red-500">
    {errors.company_gst_no_doc}
  </span>
)}

            </div>
            <div className="relative">
              <input
                type="text"
                name="cin_llpin"
                id="floating_outlined_cin"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.cin_llpin ? "border-red-500" : "border-gray-300"
                }`}
                value={memberFormData.cin_llpin}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_cin"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.cin_llpin
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                CIN Number <span className="text-red-600">*</span>
              </label>
              {errors?.cin_llpin && (
                <span className="text-sm text-red-500">
                  {errors?.cin_llpin}
                </span>
              )}
            </div>
            <div className="relative">
              <label
                for="company_type"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.company_type
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                Company Type <span className="text-red-600">*</span>
              </label>
              <select
                id="company_type"
                name="company_type"
                onChange={handleChange}
                value={memberFormData.company_type}
                className={`bg-gray-50 border mt-5 text-gray-900 text-sm rounded-lg w-full p-2.5 ${
                  errors?.company_type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option selected>Choose company type</option>
                <option value="proprietary">Proprietary</option>
                <option value="partnership">Partnership</option>
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="llp">LLP</option>
                <option value="society">Society</option>
                <option value="trust">Trust</option>
                <option value="government">Government</option>
                <option value="huf">HUF</option>
                <option value="boi">BOI</option>
                <option value="aop">AOP</option>
                <option value="ajp">AJP</option>
              </select>
              {errors?.company_type && (
                <span className="text-sm text-red-500">
                  {errors?.company_type}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="date"
                name="date_of_incorporation"
                id="floating_outlined_date"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.date_of_incorporation
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={memberFormData.date_of_incorporation}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_date"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.date_of_incorporation
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                Date Of Incorporation <span className="text-red-600">*</span>
              </label>
              {errors?.date_of_incorporation && (
                <span className="text-sm text-red-500">
                  {errors?.date_of_incorporation}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="account_holder_name"
                id="floating_outlined_account_holder_name"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.account_holder_name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={memberFormData.account_holder_name}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_account_holder_name"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.account_holder_name
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                Account Holder Name <span className="text-red-600">*</span>
              </label>
              {errors?.account_holder_name && (
                <span className="text-sm text-red-500">
                  {errors?.account_holder_name}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                name="bank_account_no"
                id="floating_outlined_account_number"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.bank_account_no ? "border-red-500" : "border-gray-300"
                }`}
                value={memberFormData.bank_account_no}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_account_number"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.bank_account_no
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                Bank Account Number <span className="text-red-600">*</span>
              </label>
              {errors?.bank_account_no && (
                <span className="text-sm text-red-500">
                  {errors?.bank_account_no}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="ifsc_code"
                id="floating_outlined_ifsc"
                className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                  errors?.ifsc_code ? "border-red-500" : "border-gray-300"
                }`}
                value={memberFormData.ifsc_code}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_ifsc"
                className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                  errors?.ifsc_code
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                }`}
              >
                IFSC Code <span className="text-red-600">*</span>
              </label>
              {errors?.ifsc_code && (
                <span className="text-sm text-red-500">
                  {errors?.ifsc_code}
                </span>
              )}
            </div>
            <div className="relative">
<input type="file" name="cancel_cheque_doc" className="block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0" onChange={handleCompanyFileChange} />


              <label
                for="floating_outlined_cancel_doc"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Document Of Cancel Cheque{" "}
                <span className="text-red-600">*</span>
              </label>
              {errors?.cancel_cheque_doc && (
                <span className="text-sm text-red-500">
                  {errors.cancel_cheque_doc}
                </span>
              )}

            </div>

          </div>
        )}

        {currentStep === 3 &&
          memberFormData.director_info.map((director, index) => (
            <div key={index} className="grid gap-6 mb-6 md:grid-cols-2">
              <div className="relative">
                <input
                  type="text"
                  id="floating_outlined_director_name"
                  name="director_name"
                  className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                    errors?.director?.[index]?.director_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={director.director_name}
                  onChange={(e) => handleDirectorChange(index, e)}
                  placeholder=""
                  required
                />
                <label
                  for="floating_outlined_director_name"
                  className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                    errors?.director?.[index]?.director_name
                      ? "peer-focus:text-red-600"
                      : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  }`}
                >
                  Name <span className="text-red-600">*</span>
                </label>
                {errors?.director?.[index]?.director_name && (
                  <span className="text-sm text-red-500">
                    {errors?.director?.[index]?.director_name}
                  </span>
                )}
              </div>
<div className="relative">
  <label
    className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 px-2 ${
      errors?.director?.[index]?.director_gender
        ? "text-red-600"
        : "text-gray-500"
    }`}
  >
    Gender <span className="text-red-600">*</span>
  </label>

  <select
    name="director_gender"
    value={director.director_gender || ""}
    onChange={(e) => handleDirectorChange(index, e)}
    className={`bg-gray-50 mt-4 border text-sm rounded-lg w-full p-2.5 ${
      errors?.director?.[index]?.director_gender
        ? "border-red-500"
        : "border-gray-300"
    }`}
  >
    <option value="">Select Gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
  </select>

  {errors?.director?.[index]?.director_gender && (
    <span className="text-sm text-red-500">
      {errors.director[index].director_gender}
    </span>
  )}
</div>

              <div className="relative">
                <input
                  type="text"
                  id="floating_outlined_director_pan"
                  name="director_pan_no"
                  value={director.director_pan_no}
                  onChange={(e) => handleDirectorChange(index, e)}
                  className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                    errors?.director?.[index]?.director_pan_no
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder=""
                  required
                />
                <label
                  for="floating_outlined_director_pan"
                  className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                    errors?.director?.[index]?.director_pan_no
                      ? "peer-focus:text-red-600"
                      : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  }`}
                >
                  Pan Number <span className="text-red-600">*</span>
                </label>
                {errors?.director?.[index]?.director_pan_no && (
                  <span className="text-sm text-red-500">
                    {errors?.director?.[index]?.director_pan_no}
                  </span>
                )}
              </div>
<div className="relative">
  <input
    type="file"
    name="user_pan_doc"
    onChange={(e) => handleDirectorFileChange(index, e)}
    className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0
      ${errors?.director?.[index]?.user_pan_doc
        ? "border border-red-500"
        : "border border-gray-300"
      }`}
  />

  <label className="absolute text-sm text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 px-2">
    Document Of PAN Card <span className="text-red-600">*</span>
  </label>

  {errors?.director?.[index]?.user_pan_doc && (
    <span className="text-sm text-red-500">
      {errors.director[index].user_pan_doc}
    </span>
  )}
</div>

              <div className="relative">
                <input
                  type="number"
                  id="floating_outlined_director_aadhar_no"
                  name="director_aadhar_no"
                  value={director.director_aadhar_no}
                  onChange={(e) => handleDirectorChange(index, e)}
                  className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                    errors?.director?.[index]?.director_aadhar_no
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder=""
                  required
                />
                <label
                  for="floating_outlined_director_aadhar_no"
                  className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                    errors?.director?.[index]?.director_aadhar_no
                      ? "peer-focus:text-red-600"
                      : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  }`}
                >
                  Aadhar Number <span className="text-red-600">*</span>
                </label>
                {errors?.director?.[index]?.director_aadhar_no && (
                  <span className="text-sm text-red-500">
                    {errors?.director?.[index]?.director_aadhar_no}
                  </span>
                )}
              </div>
  <div className="relative">
  <input
    type="file"
    name="user_addhar_doc"
    onChange={(e) => handleDirectorFileChange(index, e)}
    className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0
      ${errors?.director?.[index]?.user_addhar_doc
        ? "border border-red-500"
        : "border border-gray-300"
      }`}
  />

  <label
    className="absolute text-sm text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 px-2"
  >
    Document Of Aadhaar Card <span className="text-red-600">*</span>
  </label>

  {errors?.director?.[index]?.user_addhar_doc && (
    <span className="text-sm text-red-500">
      {errors.director[index].user_addhar_doc}
    </span>
  )}
</div>

              <div className="relative">
                <input
                  type="date"
                  id="floating_outlined_director_dob"
                  name="director_dob"
                  value={director.director_dob}
                  onChange={(e) => handleDirectorChange(index, e)}
                  className={`block mt-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none peer
focus:outline-none focus:ring-0 ${
                    errors?.director?.[index]?.director_dob
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder=""
                  required
                />
                <label
                  for="floating_outlined_director_dob"
                  className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 ${
                    errors?.director?.[index]?.director_dob
                      ? "peer-focus:text-red-600"
                      : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  }`}
                >
                  DOB <span className="text-red-600">*</span>
                </label>
                {errors?.director?.[index]?.director_dob && (
                  <span className="text-sm text-red-500">
                    {errors?.director?.[index]?.director_dob}
                  </span>
                )}
              </div>
              <div>
                <Button
                  type="button"
                  onClick={() => removeDirector(index)}
                  className="text-red-800 p-3 rounded-xl cursor-pointer"
                >
                  <i class="fa-solid fa-trash fa-lg"></i>
                </Button>
              </div>
            </div>
          ))}
{currentStep === 4 && (
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-white border-l-4 border-[#4b669a] p-6 rounded-r-lg mb-8">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <i className="fa-solid fa-video text-2xl text-[#4b669a]"></i>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-bold text-[#4b669a] mb-4">Video KYC</h3>
                            <p className="text-black-500 mb-4">
                              Please record a short video following these steps:
                            </p>
                            <ol className="list-decimal list-inside text-black space-y-3">
                              <li>Hold your face in front of the camera and clearly say your full name.</li>
                              <li>Show your PAN card to the camera so it is clearly visible.</li>
                              <li>Optionally, show any other required documents if prompted.</li>
                              <li>Ensure good lighting and no obstructions for clear verification.</li>
                            </ol>
                          </div>
                        </div>
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="hidden   "
                          id="video_kyc_upload"
                        />
                        <label
                          htmlFor="video_kyc_upload"
                          className="cursor-pointer block w-full py-4 px-6 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          <div className="text-lg font-medium text-gray-700">
                            {memberFormData.video_kyc ? memberFormData.video_kyc.name : "Choose file"}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {memberFormData.video_kyc ? "Click to change" : "No file chosen"}
                          </div>
                        </label>

                        {errors?.video_kyc && (
                          <p className="mt-3 text-sm text-red-600">{errors.video_kyc}</p>
                        )}

                        {memberFormData.video_kyc && (
                          <div className="mt-6">
                            <video
                              src={URL.createObjectURL(memberFormData.video_kyc)}
                              controls
                              className="max-w-full h-auto rounded-lg shadow-md mx-auto max-h-96"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
 

        <div className="flex justify-between">
          <div>
            <button
              type="button"
              className={`text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mr-3 ${
                currentStep === 1
                  ? "disabled bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-800 cursor-pointer"
              }`}
              onClick={handlePrev}
            >
              &lt; Prev
            </button>

            {currentStep < 4 && (
              <button
              type="button"
              className="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
              onClick={handleNext}
            >
              Next &gt;
            </button>

            )}

            {currentStep === 4 && (
              <button
                type="submit"
                className="cursor-pointer text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Submit
              </button>
            )}
          </div>
          <div className="flex justify-between">
            {currentStep === 3 && (
              <Button
                type="button"
                onClick={addDirector}
                className="cursor-pointer px-4 py-2 mr-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
              >
                + Add Director
              </Button>
            )}
        <Button
          onClick={() => setShowConfirmModal(!showConfirmModal)}
          type="button"
          className="cursor-pointer text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Cancel KYC
        </Button>

          </div>
        </div>
      </form>

 </div>
 </div>
      </div>
      </div>
      </div>
            <ConfirmModal
              showConfirmModal={showConfirmModal}
              heading={"Are you sure you want to go back?"}
              body={"If you go back then you will lose your filled data in form."}
              handleConfirmModal={setShowConfirmModal}
              action={() => navigate("/")}
            />
    </>
  );
};
