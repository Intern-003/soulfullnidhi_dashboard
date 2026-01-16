import React, { useEffect, useState } from "react";
import { Stepper } from "../components/Stepper";
import Button from "../components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmModal } from "../components/ConfirmModal";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import paymentGatewayBg from "../images/login-background.jpg";

export const Kyc = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const merchant = location.state?.merchant || null;

  // Debug log (you can remove in production)
  console.log("Merchant data received in KYC:", merchant);

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Company documents state (you were using setCompanyDocs without declaration)
  const [companyDocs, setCompanyDocs] = useState({
    company_pan_no_doc: null,
    company_gst_no_doc: null,
    cancel_cheque_doc: null,
  });

  const [memberFormData, setMemberFormData] = useState(() => {
    const defaults = {
      id: "",
      name: "",
      mobile_no: "",
      email: "",
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
    };

    if (!merchant || !merchant.id) {
      return defaults;
    }

    return {
      ...defaults,
      id: merchant.id || "",
      name: merchant.name || "",
      mobile_no: merchant.mobile || merchant.mobile_no || "",
      email: merchant.email || "",
    };
  });

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("kycFormData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setMemberFormData((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to parse saved KYC data:", err);
      }
    }

    // Warn before leaving/refreshing
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  // Auto-save text fields to localStorage
  useEffect(() => {
    const savable = { ...memberFormData };
    delete savable.video_kyc;
    delete savable.company_pan_no_doc;
    delete savable.company_gst_no_doc;
    delete savable.cancel_cheque_doc;

    savable.director_info = savable.director_info.map((d) => ({
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
      "company_pan_no_doc",
      "company_gst_no_doc",
      "cancel_cheque_doc",
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
      "user_pan_doc",
      "user_addhar_doc",
    ],
    4: ["video_kyc"],
  };

  const { execute: executeMember } = usePost("/kyc-merchant");

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ──────────────────────────────────────────────
  // Regex patterns (unchanged)
  // ──────────────────────────────────────────────
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
    name: { required: true, pattern: nameRegex, message: "Name is not valid" },
    email: { required: true, pattern: emailRegex, message: "Email is not valid" },
    business_mcc: { required: true, pattern: numberRegex, message: "Business MCC must be 4 digits" },
    city: { required: true, minLength: 2, pattern: /^[A-Za-z ]+$/, message: "Valid city name required" },
    state: { required: true, minLength: 2, pattern: /^[A-Za-z ]+$/, message: "Valid state name required" },
    district: { required: true, minLength: 2, pattern: /^[A-Za-z ]+$/, message: "Valid district name required" },
    address: { required: true, minLength: 10, message: "Address must be at least 10 characters" },
    pin_code: { required: true, pattern: pinnumberRegex, message: "Pin code must be 6 digits" },
    website_url: { required: true, pattern: websiteRegex, message: "Website URL must be like https://example.com" },
    account_holder_name: { required: true, pattern: nameRegex, message: "Account holder name is not valid" },
    bank_account_no: { required: true, pattern: /^[0-9]{9,18}$/, message: "Bank account number must be 9–18 digits" },
    ifsc_code: { required: true, pattern: ifscRegex, message: "IFSC is not valid (e.g. HDFC0001234)" },
    cin_llpin: { required: true, pattern: cinRegex, message: "CIN is not valid (e.g. L12345MH2010PLC123456)" },
    company_pan_no: { required: true, pattern: panRegex, message: "Company PAN is not valid (e.g. ABCDE1234F)" },
    company_gst_no: { required: true, pattern: gstRegex, message: "GST is not valid (e.g. 27AAAPZ1234C1Z1)" },
    director_name: { required: true, pattern: nameRegex, message: "Director name is not valid" },
    director_pan_no: { required: true, pattern: panRegex, message: "Director PAN is not valid (e.g. ABCDE1234F)" },
    director_aadhar_no: { required: true, pattern: aadharRegex, message: "Aadhaar must be 12 digits" },
    user_pan_doc: { required: true, message: "PAN document is required" },
    user_addhar_doc: { required: true, message: "Aadhaar document is required" },
    company_type: { required: true, message: "Please select company type" },
    date_of_incorporation: { required: true, message: "Date of incorporation is required" },
    director_gender: { required: true, message: "Please select gender" },
    director_dob: { required: true, message: "Date of birth is required" },
    video_kyc: { required: true, message: "Please upload your Video KYC recording" },
  };

  const validateStep = () => {
    const requiredFields = stepRequiredFields[currentStep];
    const newErrors = {};

    const validateValue = (value, field) => {
      const rules = validationRules[field];
      if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
        return "This field is required";
      }
      if (rules?.pattern && typeof value === "string") {
        if (!rules.pattern.test(value.trim())) {
          return rules.message || "Invalid format";
        }
      }
      return null;
    };

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
    } else {
      requiredFields.forEach((field) => {
        const value = field === "video_kyc" ? memberFormData.video_kyc : memberFormData[field];
        const error = validateValue(value, field);
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
    const newValue = name === "credentials_id" ? parseInt(value, 10) || "" : value;

    // if (name === "payin_at_onboard" && value === "Airpay") {
    //   refetchCredentials(); // ← uncomment if you have this function
    // }

    setMemberFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFileChange = (key, file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [key]: "Only JPG, PNG, WEBP images or PDF files are allowed",
      }));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        [key]: "File size must be under 5MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, [key]: null }));
    setCompanyDocs((prev) => ({ ...prev, [key]: file }));

    // Also update memberFormData
    setMemberFormData((prev) => ({ ...prev, [key]: file }));
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
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error(`Only PDF files are allowed for ${name.replace(/_/g, " ")}`);
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      e.target.value = "";
      return;
    }

    setMemberFormData((prev) => ({ ...prev, [name]: file }));
    setCompanyDocs((prev) => ({ ...prev, [name]: file }));
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

    setMemberFormData((prev) => {
      const updated = [...prev.director_info];
      updated[index][name] = file;
      return { ...prev, director_info: updated };
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setMemberFormData((prev) => ({ ...prev, video_kyc: file }));
      setErrors((prev) => ({ ...prev, video_kyc: null }));
    } else {
      toast.error("Please upload a valid video file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    const merchantId = memberFormData.id;

    if (!merchantId) {
      toast.error("Merchant ID is missing. Please complete registration first.");
      navigate("/register");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", merchantId);

      // Append text fields (excluding files and directors)
      Object.keys(memberFormData).forEach((key) => {
        if (
          ![
            "director_info",
            "company_pan_no_doc",
            "company_gst_no_doc",
            "cancel_cheque_doc",
            "video_kyc",
          ].includes(key)
        ) {
          formData.append(key, memberFormData[key]);
        }
      });

      // Append company files
      ["company_pan_no_doc", "company_gst_no_doc", "cancel_cheque_doc"].forEach((fileKey) => {
        if (memberFormData[fileKey] instanceof File) {
          formData.append(fileKey, memberFormData[fileKey]);
        }
      });

      // Video KYC file
      if (memberFormData.video_kyc instanceof File) {
        formData.append("video_kyc", memberFormData.video_kyc);
      }

      // Append directors
      memberFormData.director_info.forEach((director, idx) => {
        Object.keys(director).forEach((field) => {
          const value = director[field];
          if (value instanceof File) {
            formData.append(`director_info[${idx}][${field}]`, value);
          } else {
            formData.append(`director_info[${idx}][${field}]`, value || "");
          }
        });
      });

      await executeMember(formData);
      toast.success("KYC submitted successfully!");

      // Clear localStorage after successful submit
      localStorage.removeItem("kycFormData");

      navigate("/member-list");
    } catch (err) {
      console.error("KYC submission error:", err);
      const serverErrors = err?.response?.data?.errors;
      const msg = serverErrors
        ? Object.values(serverErrors)[0]?.[0] || "Validation failed"
        : err?.response?.data?.message || "Failed to submit KYC. Please try again.";
      toast.error(msg);
    }
  };

  const stepHeadings = {
    1: { title: "Merchant Details", subtitle: "Basic business information" },
    2: { title: "Company & Bank Details", subtitle: "Legal and banking information" },
    3: { title: "Director Details", subtitle: "Director KYC information" },
    4: { title: "Video KYC", subtitle: "Video verification" },
  };

  // ──────────────────────────────────────────────
  // Guard: No merchant data → show full-screen message
  // ──────────────────────────────────────────────
  if (!merchant || !merchant.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-10 bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 border border-gray-200">
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Registration Data Missing
          </h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            You must complete merchant registration before you can proceed with KYC.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-10 py-4 bg-blue-600 text-white font-semibold text-lg rounded-xl hover:bg-blue-700 transition shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Main KYC Form
  // ──────────────────────────────────────────────
  return (
    <>
      <div
        className="min-h-screen w-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${paymentGatewayBg})` }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-5xl">
            <div className="shadow-2xl overflow-hidden rounded-2xl">
              <div className="w-full max-w-4xl mx-auto rounded-2xl bg-white p-6 sm:p-8 lg:p-10">
                <div className="relative mb-10">
                  <div
                    className="absolute inset-0 rounded-xl blur-md opacity-60"
                    style={{
                      background: "linear-gradient(120deg, #2958da, #2F5BFF, #6A8CFF)",
                    }}
                  />
                  <div
                    className="relative rounded-xl px-6 py-5 flex items-center justify-between shadow-lg"
                    style={{
                      background: "linear-gradient(275deg, #4b76eb, #1E40FF, #4F6FFF)",
                    }}
                  >
                    <h4 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                      Complete Your KYC
                    </h4>
                    <Stepper currentStep={currentStep} />
                  </div>
                </div>

                <div className="border-b pb-4 mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 text-center">
                    {stepHeadings[currentStep]?.title || "KYC Form"}
                  </h2>
                  <p className="text-center text-gray-600 mt-1">
                    {stepHeadings[currentStep]?.subtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  {currentStep === 1 && (
                    <div className="space-y-6 mb-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { name: "name", label: "Business Name", readOnly: true },
                          { name: "mobile_no", label: "Business Mobile", readOnly: true },
                          { name: "email", label: "Business Email", readOnly: true },
                          { name: "business_mcc", label: "Business MCC" },
                          { name: "city", label: "City" },
                          { name: "state", label: "State" },
                          { name: "district", label: "District" },
                          { name: "pin_code", label: "Pincode" },
                          { name: "address", label: "Address" },
                          { name: "website_url", label: "Website URL" },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              {field.label} <span className="text-red-600">*</span>
                            </label>
                            <input
                              name={field.name}
                              readOnly={field.readOnly}
                              value={memberFormData?.[field.name] || ""}
                              onChange={handleChange}
                              className={`
                                w-full px-4 py-3 rounded-lg border border-gray-300 
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                transition duration-200
                                ${field.readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
                              `}
                            />
                            {errors?.[field.name] && (
                              <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6 mb-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Company PAN Number <span className="text-red-600">*</span>
                          </label>
                          <input
                            name="company_pan_no"
                            value={memberFormData.company_pan_no || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                          {errors?.company_pan_no && (
                            <p className="mt-1 text-sm text-red-600">{errors.company_pan_no}</p>
                          )}
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            PAN Document <span className="text-red-600">*</span>
                          </label>
                          <div
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50"
                            onClick={() => document.getElementById("company_pan_no_doc").click()}
                          >
                            {memberFormData.company_pan_no_doc?.name ||
                              "Click to upload PAN document (PDF)"}
                          </div>
                          <input
                            id="company_pan_no_doc"
                            name="company_pan_no_doc"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleCompanyFileChange}
                          />
                          {errors?.company_pan_no_doc && (
                            <p className="mt-1 text-sm text-red-600">{errors.company_pan_no_doc}</p>
                          )}
                        </div>

                        {/* Repeat similar pattern for other file + text fields in step 2 */}
                        {/* GST */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            GST Number <span className="text-red-600">*</span>
                          </label>
                          <input
                            name="company_gst_no"
                            value={memberFormData.company_gst_no || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                          {errors?.company_gst_no && (
                            <p className="mt-1 text-sm text-red-600">{errors.company_gst_no}</p>
                          )}
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            GST Document <span className="text-red-600">*</span>
                          </label>
                          <div
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50"
                            onClick={() => document.getElementById("company_gst_no_doc").click()}
                          >
                            {memberFormData.company_gst_no_doc?.name ||
                              "Click to upload GST document (PDF)"}
                          </div>
                          <input
                            id="company_gst_no_doc"
                            name="company_gst_no_doc"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleCompanyFileChange}
                          />
                          {errors?.company_gst_no_doc && (
                            <p className="mt-1 text-sm text-red-600">{errors.company_gst_no_doc}</p>
                          )}
                        </div>

                        {/* CIN / LLPIN */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            CIN / LLPIN <span className="text-red-600">*</span>
                          </label>
                          <input
                            name="cin_llpin"
                            value={memberFormData.cin_llpin || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                          {errors?.cin_llpin && (
                            <p className="mt-1 text-sm text-red-600">{errors.cin_llpin}</p>
                          )}
                        </div>

                        {/* Company Type */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Company Type <span className="text-red-600">*</span>
                          </label>
                          <select
                            name="company_type"
                            value={memberFormData.company_type || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Company Type</option>
                            <option value="private">Private Limited</option>
                            <option value="public">Public Limited</option>
                            <option value="llp">LLP</option>
                            <option value="proprietor">Proprietorship</option>
                            <option value="partnership">Partnership</option>
                          </select>
                          {errors?.company_type && (
                            <p className="mt-1 text-sm text-red-600">{errors.company_type}</p>
                          )}
                        </div>

                        {/* Cancel Cheque */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Cancel Cheque <span className="text-red-600">*</span>
                          </label>
                          <div
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50"
                            onClick={() => document.getElementById("cancel_cheque_doc").click()}
                          >
                            {memberFormData.cancel_cheque_doc?.name ||
                              "Click to upload Cancel Cheque (PDF)"}
                          </div>
                          <input
                            id="cancel_cheque_doc"
                            name="cancel_cheque_doc"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleCompanyFileChange}
                          />
                          {errors?.cancel_cheque_doc && (
                            <p className="mt-1 text-sm text-red-600">{errors.cancel_cheque_doc}</p>
                          )}
                        </div>

                        {/* Bank Details */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Account Holder Name <span className="text-red-600">*</span>
                          </label>
                          <input
                            name="account_holder_name"
                            value={memberFormData.account_holder_name || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                          {errors?.account_holder_name && (
                            <p className="mt-1 text-sm text-red-600">{errors.account_holder_name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Bank Account Number <span className="text-red-600">*</span>
                          </label>
                          <input
                            name="bank_account_no"
                            value={memberFormData.bank_account_no || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                          {errors?.bank_account_no && (
                            <p className="mt-1 text-sm text-red-600">{errors.bank_account_no}</p>
                          )}
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            IFSC Code <span className="text-red-600">*</span>
                          </label>
                          <input
                            name="ifsc_code"
                            value={memberFormData.ifsc_code || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                          {errors?.ifsc_code && (
                            <p className="mt-1 text-sm text-red-600">{errors.ifsc_code}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-8 mb-10">
                      {memberFormData?.director_info?.map((director, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-2xl p-6 bg-gray-50 shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Director {index + 1}
                            </h3>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeDirector(index)}
                                className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                              >
                                <i className="fa-solid fa-trash-can"></i> Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Director Name <span className="text-red-600">*</span>
                              </label>
                              <input
                                name="director_name"
                                value={director.director_name || ""}
                                onChange={(e) => handleDirectorChange(index, e)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                              />
                              {errors?.director?.[index]?.director_name && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.director[index].director_name}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Gender <span className="text-red-600">*</span>
                              </label>
                              <select
                                name="director_gender"
                                value={director.director_gender || ""}
                                onChange={(e) => handleDirectorChange(index, e)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                              {errors?.director?.[index]?.director_gender && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.director[index].director_gender}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                PAN Number <span className="text-red-600">*</span>
                              </label>
                              <input
                                name="director_pan_no"
                                value={director.director_pan_no || ""}
                                onChange={(e) => handleDirectorChange(index, e)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                              />
                              {errors?.director?.[index]?.director_pan_no && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.director[index].director_pan_no}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                PAN Document <span className="text-red-600">*</span>
                              </label>
                              <div
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50"
                                onClick={() =>
                                  document.getElementById(`director-pan-${index}`).click()
                                }
                              >
                                {director.user_pan_doc?.name || "Upload PAN Document"}
                              </div>
                              <input
                                id={`director-pan-${index}`}
                                name="user_pan_doc"
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => handleDirectorFileChange(index, e)}
                              />
                              {errors?.director?.[index]?.user_pan_doc && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.director[index].user_pan_doc}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Aadhaar Number <span className="text-red-600">*</span>
                              </label>
                              <input
                                name="director_aadhar_no"
                                value={director.director_aadhar_no || ""}
                                onChange={(e) => handleDirectorChange(index, e)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                              />
                              {errors?.director?.[index]?.director_aadhar_no && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.director[index].director_aadhar_no}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Aadhaar Document <span className="text-red-600">*</span>
                              </label>
                              <div
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50"
                                onClick={() =>
                                  document.getElementById(`director-aadhaar-${index}`).click()
                                }
                              >
                                {director.user_addhar_doc?.name || "Upload Aadhaar Document"}
                              </div>
                              <input
                                id={`director-aadhaar-${index}`}
                                name="user_addhar_doc"
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => handleDirectorFileChange(index, e)}
                              />
                              {errors?.director?.[index]?.user_addhar_doc && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.director[index].user_addhar_doc}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Date of Birth <span className="text-red-600">*</span>
                              </label>
                              <input
                                type="date"
                                name="director_dob"
                                value={director.director_dob || ""}
                                onChange={(e) => handleDirectorChange(index, e)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                              />
                              {errors?.director?.[index]?.director_dob && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.director[index].director_dob}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-8 mb-10 max-w-3xl mx-auto">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">
                          Video KYC Instructions
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Please upload a short video where you:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          <li>Clearly state your full name</li>
                          <li>Show your PAN card to the camera (both sides if needed)</li>
                          <li>Ensure good lighting and clear audio</li>
                          <li>Keep video under 50MB (MP4 recommended)</li>
                        </ul>
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="hidden"
                          id="video_kyc_upload"
                        />
                        <label
                          htmlFor="video_kyc_upload"
                          className="cursor-pointer block"
                        >
                          <div className="text-xl font-medium text-gray-700 mb-2">
                            {memberFormData.video_kyc
                              ? memberFormData.video_kyc.name
                              : "Upload Video KYC"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {memberFormData.video_kyc
                              ? "Click to replace video"
                              : "Click or drag video file here (MP4, MOV)"}
                          </div>
                        </label>

                        {errors?.video_kyc && (
                          <p className="mt-4 text-red-600">{errors.video_kyc}</p>
                        )}

                        {memberFormData.video_kyc && (
                          <div className="mt-8">
                            <p className="text-sm font-medium text-gray-600 mb-3">
                              Video Preview
                            </p>
                            <video
                              src={URL.createObjectURL(memberFormData.video_kyc)}
                              controls
                              className="w-full max-h-80 rounded-xl shadow-lg border border-gray-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        className={`px-8 py-3 rounded-xl font-medium text-white transition w-full sm:w-auto
                          ${currentStep === 1 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700"}`}
                      >
                        ← Previous
                      </button>

                      {currentStep < 4 && (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition w-full sm:w-auto"
                        >
                          Next →
                        </button>
                      )}

                      {currentStep === 4 && (
                        <button
                          type="submit"
                          className="px-10 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition w-full sm:w-auto shadow-md"
                        >
                          Submit KYC
                        </button>
                      )}
                    </div>

                    <div className="flex gap-4 w-full sm:w-auto">
                      {currentStep === 3 && (
                        <button
                          type="button"
                          onClick={addDirector}
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition"
                        >
                          + Add Director
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowConfirmModal(true)}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition"
                      >
                        Cancel KYC
                      </button>
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
        heading="Are you sure you want to cancel KYC?"
        body="All entered data will be lost if you go back without submitting."
        handleConfirmModal={setShowConfirmModal}
        action={() => {
          localStorage.removeItem("kycFormData");
          navigate("/");
        }}
      />
    </>
  );
};