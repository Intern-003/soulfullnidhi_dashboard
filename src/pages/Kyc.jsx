import React, { useEffect, useState } from "react";
import { Stepper } from "../components/Stepper";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../components/ConfirmModal";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import { useLocation } from "react-router-dom";
import paymentGatewayBg from "../images/login-background.jpg";

export const Kyc = () => {
  const location = useLocation();
  const [errors, setErrors] = useState();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toast = useToast();

  const [memberFormData, setMemberFormData] = useState({
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
  });

  useEffect(() => {
    const saved = localStorage.getItem("kycFormData");
    const merchant = location.state?.merchant;

    // 1️⃣ Fresh navigation from Register
    if (merchant?.id) {
      setMemberFormData((prev) => ({
        ...prev,
        id: merchant.id,
        name: merchant.name || "",
        email: merchant.email || "",
        mobile_no: merchant.mobile_no || "",
      }));
      return;
    }

    // 2️⃣ Refresh case
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMemberFormData((prev) => ({
          ...prev,
          ...parsed,
        }));
      } catch (e) {
        console.error("Invalid localStorage data");
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (!memberFormData.id) return; // 🔥 MOST IMPORTANT LINE

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
      "company_pan_no_doc",
      "company_gst_no_doc",
      "cancel_cheque_doc",
      // "account_holder_name",
      // "bank_account_no",
      // "ifsc_code",
      // "date_of_incorporation",
    ],
    3: [
      "director_name",
      "director_pan_no",
      "director_aadhar_no",
      "director_gender",
      "director_dob",
      "user_pan_doc", // add director files here if required
      "user_addhar_doc",
    ],
    4: ["video_kyc"],
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
  const websiteRegex =
    /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/;
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
      message: "Valid city name required",
    },
    state: {
      required: true,
      minLength: 2,
      pattern: /^[A-Za-z ]+$/,
      message: "Valid state name required",
    },
    district: {
      required: true,
      minLength: 2,
      pattern: /^[A-Za-z ]+$/,
      message: "Valid district name required",
    },
    address: {
      required: true,
      minLength: 10,
      message: "Address must be at least 10 characters",
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
      message: "Please select company type",
    },
    date_of_incorporation: {
      required: true,
      message: "Date of incorporation is required",
    },
    director_gender: {
      required: true,
      message: "Please select gender",
    },
    director_dob: {
      required: true,
      message: "Date of birth is required",
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
        const value =
          field === "video_kyc"
            ? memberFormData.video_kyc
            : memberFormData[field];
        const error = validateValue(value, field); // ← Use 'value', not memberFormData[field]
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
    console.log("Errors:", errors);
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

  const handleFileChange = (key, file) => {
    if (!file) return;

    // ✅ Allowed file types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    // ❌ Invalid type
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [key]: "Only JPG, PNG, WEBP images or PDF files are allowed",
      }));
      return;
    }

    // ❌ Size limit: 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        [key]: "File size must be under 5MB",
      }));
      return;
    }

    // ✅ Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [key]: null,
    }));

    // ✅ Save file in companyDocs state
    setCompanyDocs((prev) => ({
      ...prev,
      [key]: file,
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

      const merchantId = memberFormData.id;
      if (!merchantId) {
        toast.error("Merchant ID missing – cannot submit KYC");
        return;
      }
      formData.append("id", merchantId);

      // Append text fields (excluding files and directors)
      Object.keys(memberFormData).forEach((key) => {
        if (
          ![
            "director_info",
            "company_pan_no_doc",
            "company_gst_no_doc",
            "cancel_cheque_doc",
          ].includes(key)
        ) {
          formData.append(key, memberFormData[key]);
          // console.log(`[Text] ${key}:`, memberFormData[key]);
        }
      });

      // Append company files
      ["company_pan_no_doc", "company_gst_no_doc", "cancel_cheque_doc"].forEach(
        (fileKey) => {
          if (memberFormData[fileKey] instanceof File) {
            formData.append(fileKey, memberFormData[fileKey]);
            // console.log(`[File] ${fileKey}:`, memberFormData[fileKey].name);
          }
        }
      );

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
      subtitle: "Basic business information",
    },
    2: {
      title: "Company & Bank Details",
      subtitle: "Legal and banking information",
    },
    3: {
      title: "Director Details",
      subtitle: "Director KYC information",
    },
    4: {
      title: "Video KYC",
      subtitle: "video kyc information",
    },
  };

  return (
    <>
      <div
        className="min-h-screen w-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${paymentGatewayBg})` }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* centered content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-5xl">
            <div className=" shadow-2xl overflow-hidden">
              {/* FORM — 3/4 */}
              <div className="w-full max-w-3xl mx-auto rounded-2xl bg-white p-8">
                <div className="relative mb-10">
                  {/* glow / blur */}
                  <div
                    className="absolute inset-0 rounded-xl blur-md opacity-70"
                    style={{
                      background:
                        "linear-gradient(120deg, #2958da, #2F5BFF, #6A8CFF)",
                    }}
                  />

                  {/* HEADER ROW */}
                  <div
                    className="relative rounded-xl px-6 py-4 flex items-center justify-between"
                    style={{
                      background:
                        "linear-gradient(275deg, #4b76eb, #1E40FF, #4F6FFF)",
                    }}
                  >
                    {/* LEFT: HEADING */}
                    <h4 className="text-2xl md:text-2xl font-bold text-white tracking-wide ml-52">
                      Complete Your KYC
                    </h4>

                    {/* RIGHT: STEPPER */}
                    <Stepper currentStep={currentStep} />
                  </div>
                </div>

                {/* Dynamic Step Heading */}
                <div className="border-b pb-3 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mt-6 text-center">
                    {stepHeadings[currentStep].title}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                
                  {currentStep === 1 && (
                    <div className="space-y-4 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            name: "name",
                            label: "Business Name",
                            readOnly: true,
                          },
                          {
                            name: "mobile_no",
                            label: "Business Mobile",
                            readOnly: true,
                          },
                          {
                            name: "email",
                            label: "Business Email",
                            readOnly: true,
                          },
                          { name: "business_mcc", label: "Business MCC" },
                          { name: "city", label: "City" },
                          { name: "state", label: "State" },
                          { name: "district", label: "District" },
                          { name: "pin_code", label: "Pincode" },
                          { name: "address", label: "Address" },
                          { name: "website_url", label: "Website URL" },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block mb-1 text-xs font-semibold text-gray-600 tracking-wide ml-2">
                              {field.label}{" "}
                              <span className="text-red-600">*</span>
                            </label>

                            <input
                              name={field.name}
                              readOnly={field.readOnly}
                              value={memberFormData?.[field.name] || ""}
                              onChange={handleChange}
                              className={`
                                w-full px-3 py-2
                                rounded-lg
                                border border-gray-300
                                focus:outline-none focus:ring-1 focus:ring-[#375EF4]
                                ${
                                  field.readOnly
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : ""
                                }
                              `}
                            />

                            {errors?.[field.name] && (
                              <p className="text-red-600 text-xs mt-1">
                                {errors[field.name]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Company PAN */}
                        <div>
                          <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                            Company PAN Number{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <input
                            name="company_pan_no"
                            value={memberFormData.company_pan_no || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                          />
                          {errors?.company_pan_no && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.company_pan_no}
                            </p>
                          )}
                        </div>

                        {/* PAN Document */}
                        <div>
                          <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                            PAN Document <span className="text-red-600">*</span>
                          </label>

                          <input
                            type="text"
                            readOnly
                            placeholder="Upload PAN document"
                            value={
                              memberFormData.company_pan_no_doc?.name || ""
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 cursor-pointer bg-white focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                            onClick={() =>
                              document
                                .getElementById("company_pan_no_doc")
                                .click()
                            }
                          />

                          <input
                            id="company_pan_no_doc"
                            name="company_pan_no_doc"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleCompanyFileChange}
                          />

                          {errors?.company_pan_no_doc && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.company_pan_no_doc}
                            </p>
                          )}
                        </div>

                        {/* GST Number */}
                        <div>
                          <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                            GST Number <span className="text-red-600">*</span>
                          </label>
                          <input
                            name="company_gst_no"
                            value={memberFormData.company_gst_no || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                          />
                          {errors?.company_gst_no && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.company_gst_no}
                            </p>
                          )}
                        </div>

                        {/* GST Document */}
                        <div>
                          <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                            GST Document <span className="text-red-600">*</span>
                          </label>

                          <input
                            type="text"
                            readOnly
                            placeholder="Upload GST document"
                            value={
                              memberFormData.company_gst_no_doc?.name || ""
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 cursor-pointer bg-white focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                            onClick={() =>
                              document
                                .getElementById("company_gst_no_doc")
                                .click()
                            }
                          />

                          <input
                            id="company_gst_no_doc"
                            name="company_gst_no_doc"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleCompanyFileChange}
                          />

                          {errors?.company_gst_no_doc && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.company_gst_no_doc}
                            </p>
                          )}
                        </div>

                        {/* CIN */}
                        <div>
                          <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                            CIN / LLPIN <span className="text-red-600">*</span>
                          </label>
                          <input
                            name="cin_llpin"
                            value={memberFormData.cin_llpin || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                          />
                          {errors?.cin_llpin && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.cin_llpin}
                            </p>
                          )}
                        </div>

                        {/* Company Type */}
                        <div>
                          <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                            Company Type <span className="text-red-600">*</span>
                          </label>
                          <select
                            name="company_type"
                            value={memberFormData.company_type || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                          >
                            <option value="">Select</option>
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                            <option value="llp">LLP</option>
                          </select>
                          {errors?.company_type && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.company_type}
                            </p>
                          )}
                        </div>

                        {/* Cancel Cheque */}
                        <div>
                          <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                            Cancel Cheque{" "}
                            <span className="text-red-600">*</span>
                          </label>

                          <input
                            type="text"
                            readOnly
                            placeholder="Upload cancel cheque"
                            value={memberFormData.cancel_cheque_doc?.name || ""}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 cursor-pointer bg-white focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                            onClick={() =>
                              document
                                .getElementById("cancel_cheque_doc")
                                .click()
                            }
                          />

                          <input
                            id="cancel_cheque_doc"
                            name="cancel_cheque_doc"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleCompanyFileChange}
                          />

                          {errors?.cancel_cheque_doc && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.cancel_cheque_doc}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6 mb-6">
                      {memberFormData?.director_info?.map((director, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-2xl p-5 space-y-4"
                        >
                          {/* Header */}
                          <div className="flex justify-between items-center">
                            <h3 className="text-base font-semibold text-gray-700">
                              Director {index + 1}
                            </h3>

                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeDirector(index)}
                                className="text-red-600 text-sm font-semibold"
                              >
                                <i className="fa-solid fa-trash"></i> Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Director Name */}
                            <div>
                              <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                                Director Name{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <input
                                name="director_name"
                                value={director.director_name || ""}
                                onChange={(e) => handleDirectorChange(index, e)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                              />
                              {errors?.director?.[index]?.director_name && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors.director[index].director_name}
                                </p>
                              )}
                            </div>

                            {/* Gender */}
                            <div>
                              <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                                Gender <span className="text-red-600">*</span>
                              </label>
                              <select
                                name="director_gender"
                                value={director.director_gender || ""}
                                onChange={(e) => handleDirectorChange(index, e)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                              {errors?.director?.[index]?.director_gender && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors.director[index].director_gender}
                                </p>
                              )}
                            </div>

                            {/* PAN Number */}
                            <div>
                              <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                                PAN Number{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <input
                                name="director_pan_no"
                                value={director.director_pan_no || ""}
                                onChange={(e) => handleDirectorChange(index, e)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                              />
                              {errors?.director?.[index]?.director_pan_no && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors.director[index].director_pan_no}
                                </p>
                              )}
                            </div>

                            {/* PAN Document (Fake Input) */}
                            <div>
                              <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                                PAN Document{" "}
                                <span className="text-red-600">*</span>
                              </label>

                              <input
                                type="text"
                                readOnly
                                value={director.user_pan_doc?.name || ""}
                                placeholder="Upload PAN document"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                                onClick={() =>
                                  document
                                    .getElementById(`director-pan-${index}`)
                                    .click()
                                }
                              />

                              <input
                                id={`director-pan-${index}`}
                                name="user_pan_doc"
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) =>
                                  handleDirectorFileChange(index, e)
                                }
                              />

                              {errors?.director?.[index]?.user_pan_doc && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors.director[index].user_pan_doc}
                                </p>
                              )}
                            </div>

                            {/* Aadhaar Number */}
                            <div>
                              <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                                Aadhaar Number{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <input
                                name="director_aadhar_no"
                                value={director.director_aadhar_no || ""}
                                onChange={(e) => handleDirectorChange(index, e)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                              />
                              {errors?.director?.[index]
                                ?.director_aadhar_no && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors.director[index].director_aadhar_no}
                                </p>
                              )}
                            </div>

                            {/* Aadhaar Document (Fake Input) */}
                            <div>
                              <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                                Aadhaar Document{" "}
                                <span className="text-red-600">*</span>
                              </label>

                              <input
                                type="text"
                                readOnly
                                value={director.user_addhar_doc?.name || ""}
                                placeholder="Upload Aadhaar document"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                                onClick={() =>
                                  document
                                    .getElementById(`director-aadhaar-${index}`)
                                    .click()
                                }
                              />

                              <input
                                id={`director-aadhaar-${index}`}
                                name="user_addhar_doc"
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) =>
                                  handleDirectorFileChange(index, e)
                                }
                              />

                              {errors?.director?.[index]?.user_addhar_doc && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors.director[index].user_addhar_doc}
                                </p>
                              )}
                            </div>

                            {/* DOB */}
                            <div>
                              <label className="block mb-1 text-xs font-semibold text-gray-600 ml-2">
                                Date of Birth{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <input
                                type="date"
                                name="director_dob"
                                value={director.director_dob || ""}
                                onChange={(e) => handleDirectorChange(index, e)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#375EF4]"
                              />
                              {errors?.director?.[index]?.director_dob && (
                                <p className="text-red-600 text-xs mt-1">
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
                    <div className="space-y-6 mb-6">
                      {/* Instruction text (as requested) */}
                      <p className="text-sm text-gray-600 text-center max-w-2xl mx-auto">
                        Please upload a short video for identity verification.
                        Make sure your face and PAN card are clearly visible and
                        the video is recorded in good lighting.
                      </p>

                      {/* Bullet instructions */}
                      <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50 max-w-3xl mx-auto">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li>
                            Look straight into the camera and say your full name
                          </li>
                          <li>Show your PAN card clearly in the video</li>
                          <li>Ensure proper lighting and clear audio</li>
                          <li>
                            Video size should be reasonable (recommended under
                            50MB)
                          </li>
                        </ul>
                      </div>

                      {/* Upload box */}
                      <div
                        className="
                          border-2 border-dashed border-gray-300
                          rounded-xl
                          p-6
                          text-center
                          transition
                          hover:border-blue-500
                          hover:bg-blue-50
                          max-w-3xl
                          mx-auto
                        "
                      >
                        {/* Hidden input */}
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="hidden"
                          id="video_kyc_upload"
                        />

                        {/* Clickable fake input */}
                        <label
                          htmlFor="video_kyc_upload"
                          className="
                            cursor-pointer
                            block
                            w-full
                            py-3
                            px-4
                            bg-white
                            border border-gray-300
                            rounded-lg
                            transition
                            hover:border-blue-500
                            hover:bg-blue-50
                            focus-within:border-blue-600
                          "
                        >
                          <div className="text-base font-medium text-gray-700">
                            {memberFormData.video_kyc
                              ? memberFormData.video_kyc.name
                              : "Choose video file"}
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            {memberFormData.video_kyc
                              ? "Click to change video"
                              : "MP4, MOV or other video formats"}
                          </div>
                        </label>

                        {/* Error */}
                        {errors?.video_kyc && (
                          <p className="mt-3 text-sm text-red-600">
                            {errors.video_kyc}
                          </p>
                        )}

                        {/* Video preview */}
                        {memberFormData.video_kyc && (
                          <div className="mt-5">
                            <p className="text-xs font-semibold text-gray-600 mb-2">
                              Video Preview
                            </p>

                            <video
                              src={URL.createObjectURL(
                                memberFormData.video_kyc
                              )}
                              controls
                              className="
                                max-w-full
                                h-auto
                                rounded-lg
                                shadow-md
                                mx-auto
                                max-h-72
                                border border-gray-300
                              "
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
        body={"If you go back then you will lose your filled data in form...."}
        handleConfirmModal={setShowConfirmModal}
        action={() => navigate("/")}
      />
    </>
  );
};