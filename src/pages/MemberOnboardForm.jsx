import React, { useEffect, useState } from "react";
import { Stepper } from "../components/Stepper";
import { SchemeModal } from "../components/SchemeModal";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { BankModal } from "../components/BankModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";

export const MemberOnboardForm = () => {
  const [errors, setErrors] = useState();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [showPayinModal, setShowPayinModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState("payin");
  const toast = useToast();
  const [airpayMids, setAirpayMids] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});


  const [memberFormData, setMemberFormData] = useState({
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
        director_pan_doc: null,
        director_aadhar_doc: null,
      },
    ],
    payin_at_onboard: "",
    payout_at_onboard: "",
    scheme_id: "",
  });

  const stepRequiredFields = {
    1: [
      "name",
      "mobile_no",
      "email",
      "business_mcc",
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
      "account_holder_name",
      "bank_account_no",
      "ifsc_code",
      "website_url",
      "company_type",
      "date_of_incorporation",
    ],
    3: [
      "director_name",
      "director_pan_no",
      "director_aadhar_no",
      "director_gender",
      "director_dob",
    ],
    4: ["payin_at_onboard", "payout_at_onboard", "scheme_id"],
  };

  const navigate = useNavigate();

  const { data: payoutBanks, refetch: refetchPayout } = useGet(
    "/payoutbanks-List?status=1"
  );
  const {
    data: midCredentials,
    refetch: refetchCredentials,
    isLoading,
  } = useGet("/credentials");

  const { data: payinBanks, refetch: refetchPayin } = useGet(
    "/payinbanks-List?status=1"
  );
  const { data: schemes, refetch: refetchScheme } = useGet("/get-scheme");

  const { execute: executeMember } = usePost("/onboard-merchant");

  const handleSchemeModal = () => {
    setShowSchemeModal(!showSchemeModal);
  };

  const handlePayoutModal = () => {
    setShowPayoutModal(!showPayoutModal);
    setActiveTab("payout");
  };

  const handlePayinModal = () => {
    setShowPayinModal(!showPayinModal);
    setActiveTab("payin");
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (field, file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [field]: "File size should not exceed 5 MB",
      }));
      return;
    }

    if (!["image/png", "image/jpeg", "application/pdf"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Only JPG, PNG or PDF allowed",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, [field]: "" }));

    // Simulate progress
    setUploadProgress((prev) => ({ ...prev, [field]: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      setUploadProgress((prev) => ({ ...prev, [field]: progress }));

      if (progress >= 100) {
        clearInterval(interval);

        setMemberFormData((prev) => ({
          ...prev,
          [field]: file,
        }));
      }
    }, 100);
  };


  const removeFile = (field) => {
    setMemberFormData((prev) => ({ ...prev, [field]: null }));
    setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
  };


  const validateStep = () => {
    const requiredFields = stepRequiredFields[currentStep];
    const newErrors = {};

    if (currentStep === 3) {
      memberFormData.director_info.forEach((director, idx) => {
        requiredFields.forEach((field) => {
          if (!director[field] || director[field].trim() === "") {
            if (!newErrors.director) newErrors.director = [];
            newErrors.director[idx] = {
              ...newErrors.director[idx],
              [field]: "This field is required",
            };
          }
        });
      });
    } else {
      requiredFields.forEach((field) => {
        let value;

        value = memberFormData[field];

        if (!value || value === "") {
          newErrors[field] = `This field is required`;
        }
      });
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // true if no errors
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };
  useEffect(() => {
    if (memberFormData.payin_at_onboard !== "Airpay") return; // only run for Airpay
    if (isLoading) return; // wait for API
    const credentialsData = midCredentials?.data || [];
    if (credentialsData.length > 0) {
      setAirpayMids(credentialsData);
      console.log("✅ credentials loaded:", credentialsData);
    } else {
      console.warn("⚠️ no credentials found yet");
      setAirpayMids([]);
    }
  }, [memberFormData.payin_at_onboard, midCredentials, isLoading]);

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
        [name]: files ? files[0] : value, // handle file inputs
      };

      return {
        ...prev,
        director_info: updatedDirectors,
      };
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
          director_pan_doc: null,
          director_aadhar_no: "",
          director_aadhar_doc: null,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        const res = await executeMember(memberFormData);
        if (res) {
          toast.success("Form submitted successfully!");
          navigate("/member-list");
        }
      } catch (err) {
        toast.error(Object.values(err?.errors)[0][0]);
      }
    }
  };

  return (
    <>

      {/* <div className="bg-gradient-to-t from-sky-500 to-indigo-500 rounded-lg p-4 shadow-md">
        <h4 className="text-white font-bold text-xl">Add New Merchant Details</h4>
      </div> */}
      <div className="p-4 space-y-4">
        {/* Header Container */}
        <div className="bg-gradient-to-t from-sky-500 to-indigo-500 rounded-lg shadow-md">
          <div className="px-6 py-4">
            <h4 className="text-white font-bold text-xl">
              Add New Merchant Details
            </h4>
          </div>
        </div>
      </div>



      <Stepper currentStep={currentStep} />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {currentStep === 1 && (
          <div className="grid gap-6 mb-6 md:grid-cols-2 p-4 bg-white rounded-lg shadow-md">
            {[
              { name: "name", label: "Business Name", type: "text" },
              { name: "mobile_no", label: "Business Mobile", type: "number" },
              { name: "email", label: "Business Email", type: "email" },
              { name: "business_mcc", label: "Business MCC", type: "number" },
              { name: "city", label: "City", type: "text" },
              { name: "state", label: "State", type: "text" },
              { name: "district", label: "District", type: "text" },
              { name: "pin_code", label: "Pincode", type: "number" },
              { name: "address", label: "Address", type: "text" },
            ].map((field) => (
              <div key={field.name} className="relative mb-4">
                <input
                  type={field.type}
                  name={field.name}
                  id={`floating_outlined_${field.name}`}
                  className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none peer ${errors?.[field.name] ? "border-red-500" : ""
                    }`}
                  placeholder=" "
                  value={memberFormData[field.name]}
                  onChange={handleChange}
                />
                <label
                  htmlFor={`floating_outlined_${field.name}`}
                  className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 ${errors?.[field.name]
                    ? "peer-focus:text-red-600"
                    : "peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                    }`}
                >
                  {field.label} <span className="text-red-600">*</span>
                </label>
                {errors?.[field.name] && (
                  <span className="text-sm text-red-500">{errors[field.name]}</span>
                )}
              </div>
            ))}
          </div>
        )}
        {currentStep === 2 && (
          <div className="grid gap-6 mb-5 md:grid-cols-2 p-4 bg-white rounded-lg shadow-md">

            {/* ================= SMALL FLOATING LABEL INPUTS ================= */}
            {[
              { name: "company_pan_no", label: "Company PAN Number", type: "text", info: "Enter valid PAN" },
              { name: "company_gst_no", label: "GST Number", type: "text", info: "Enter GSTIN" },
              { name: "cin_llpin", label: "CIN LLPIN", type: "text", info: "Enter CIN No." },
              { name: "date_of_incorporation", label: "Date of Incorporation", type: "date" },
              { name: "account_holder_name", label: "Account Holder Name", type: "text" },
              { name: "bank_account_no", label: "Bank Account Number", type: "number" },
              { name: "ifsc_code", label: "IFSC Code", type: "text" },
              { name: "website_url", label: "Website URL", type: "text" },
            ].map((field) => (
              <div key={field.name} className="relative p-2">

                {/* Input */}
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  placeholder=" "
                  value={memberFormData[field.name]}
                  onChange={handleChange}
                  className={`block w-full px-3 pt-4 pb-1 text-sm h-11
            bg-white border rounded-lg appearance-none peer
            focus:border-blue-600 focus:ring-0
            ${errors?.[field.name] ? "border-red-500" : "border-gray-300"}`}
                />

                {/* Floating label */}
                <label
                  htmlFor={field.name}
                  className={`absolute text-sm px-1 left-3 bg-white transition-all 
            duration-200 text-gray-500 z-10 pointer-events-none
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
            peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-0
            peer-focus:text-blue-600`}
                  style={{ top: "4px" }}
                >
                  {field.label} <span className="text-red-600">*</span>
                </label>

                {/* Tooltip */}
                {field.info && (
                  <div className="absolute right-4 top-3 text-lg text-gray-400 cursor-pointer group">
                    ℹ️
                    <span className="absolute hidden group-hover:block bg-black text-white text-xs p-1 rounded left-[-120px] top-[-5px] min-w-[110px]">
                      {field.info}
                    </span>
                  </div>
                )}

                {/* Error */}
                {errors?.[field.name] && (
                  <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}

            {/* ================= FILE UPLOAD WITH PREVIEW + PROGRESS ================= */}
            {[
              { name: "company_pan_no_doc", label: "Document of PAN Card" },
              { name: "company_gst_no_doc", label: "Document of GST Number" },
              { name: "cancel_cheque_doc", label: "Document of Cancel Cheque" },
            ].map((fileField) => (
              <div key={fileField.name} className="p-2">

                <label className="text-sm text-gray-700 mb-1 block">
                  {fileField.label} <span className="text-red-600">*</span>
                </label>

                {/* Drag area */}
                <div
                  className={`w-full border rounded-lg p-3 h-11 flex items-center justify-center cursor-pointer bg-gray-50
            ${errors?.[fileField.name] ? "border-red-500" : "border-gray-300"}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(fileField.name, e.dataTransfer.files[0]);
                  }}
                >
                  <input
                    type="file"
                    id={fileField.name}
                    className="hidden"
                    onChange={(e) => handleFileUpload(fileField.name, e.target.files[0])}
                  />

                  <label htmlFor={fileField.name} className="cursor-pointer text-gray-600 text-sm">
                    Drag & drop or <span className="text-blue-600">browse</span>
                  </label>
                </div>

                {/* Upload Progress */}
                {uploadProgress[fileField.name] > 0 &&
                  uploadProgress[fileField.name] < 100 && (
                    <div className="w-full bg-gray-200 rounded mt-2 h-2">
                      <div
                        className="bg-blue-600 h-2 rounded"
                        style={{ width: `${uploadProgress[fileField.name]}%` }}
                      ></div>
                    </div>
                  )}

                {/* Preview */}
                {memberFormData[fileField.name] && (
                  <div className="mt-2 flex items-center gap-3">

                    {/* IMAGE */}
                    {memberFormData[fileField.name].type.startsWith("image/") && (
                      <img
                        src={URL.createObjectURL(memberFormData[fileField.name])}
                        className="h-12 w-12 object-cover rounded border"
                      />
                    )}

                    {/* PDF */}
                    {memberFormData[fileField.name].type === "application/pdf" && (
                      <div className="text-sm flex items-center gap-2">
                        📄 {memberFormData[fileField.name].name}
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      className="text-red-600 text-xs underline"
                      onClick={() => removeFile(fileField.name)}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Error */}
                {errors?.[fileField.name] && (
                  <p className="text-sm text-red-500 mt-1">{errors[fileField.name]}</p>
                )}
              </div>
            ))}

            {/* Company Type */}
            <div className="p-2">
              <label className="text-sm text-gray-700 mb-1 block">
                Company Type <span className="text-red-600">*</span>
              </label>

              <select
                name="company_type"
                value={memberFormData.company_type}
                onChange={handleChange}
                className={`block w-full px-3 h-11 text-sm bg-white border rounded-lg
          focus:border-blue-600
          ${errors?.company_type ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Choose company type</option>
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
            </div>
          </div>
        )}




        {/* Step 3: Director Information */}
        {currentStep === 3 &&
          memberFormData.director_info.map((director, index) => (
            <div key={index} className="grid gap-6 mb-6 md:grid-cols-2 p-4 bg-white rounded-lg shadow-sm">

              {/* Director Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  id={`director_name_${index}`}
                  name="director_name"
                  value={director.director_name}
                  onChange={(e) => handleDirectorChange(index, e)}
                  placeholder=" "
                  className={`block w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg px-4 pt-5 pb-2 appearance-none peer ${errors?.director?.[index]?.director_name ? "border-red-500" : ""
                    }`}
                  required
                />
                <label
                  htmlFor={`director_name_${index}`}
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600"
                >
                  Name <span className="text-red-600">*</span>
                </label>
              </div>

              {/* Gender */}
              <div className="relative w-full">
                <select
                  id={`director_gender_${index}`}
                  name="director_gender"
                  value={director.director_gender}
                  onChange={(e) => handleDirectorChange(index, e)}
                  className="block w-full p-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <label
                  htmlFor={`director_gender_${index}`}
                  className="absolute text-sm text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2"
                >
                  Gender
                </label>
              </div>

              {/* PAN Number */}
              <div className="relative w-full">
                <input
                  type="text"
                  id={`director_pan_no_${index}`}
                  name="director_pan_no"
                  value={director.director_pan_no}
                  onChange={(e) => handleDirectorChange(index, e)}
                  placeholder=" "
                  className={`block w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg px-4 pt-5 pb-2 peer ${errors?.director?.[index]?.director_pan_no ? "border-red-500" : ""
                    }`}
                  required
                />
                <label
                  htmlFor={`director_pan_no_${index}`}
                  className="absolute text-sm text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:text-blue-600"
                >
                  PAN Number <span className="text-red-600">*</span>
                </label>
              </div>

              {/* PAN Document Upload */}
              <div className="relative w-full">
                <input
                  type="file"
                  id={`director_pan_doc_${index}`}
                  name="director_pan_doc"
                  onChange={(e) => handleFileUpload(`director_pan_doc_${index}`, e.target.files[0])}
                  className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-4 pt-5 pb-2 cursor-pointer peer"
                />
                <label
                  htmlFor={`director_pan_doc_${index}`}
                  className="absolute text-sm text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:text-blue-600"
                >
                  Upload PAN Card <span className="text-red-600">*</span>
                </label>
                {memberFormData[`director_pan_doc_${index}`] && (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-700 truncate">
                      {memberFormData[`director_pan_doc_${index}`].name}
                    </span>
                    <button
                      type="button"
                      className="text-red-600 text-sm font-medium"
                      onClick={() => removeFile(`director_pan_doc_${index}`)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>




              {/* Aadhar Number */}
              <div className="relative w-full">
                <input
                  type="number"
                  id={`director_aadhar_no_${index}`}
                  name="director_aadhar_no"
                  value={director.director_aadhar_no}
                  onChange={(e) => handleDirectorChange(index, e)}
                  placeholder=" "
                  className={`block w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg px-4 pt-5 pb-2 peer ${errors?.director?.[index]?.director_aadhar_no ? "border-red-500" : ""
                    }`}
                  required
                />
                <label
                  htmlFor={`director_aadhar_no_${index}`}
                  className="absolute text-sm text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:text-blue-600"
                >
                  Aadhar Number <span className="text-red-600">*</span>
                </label>
              </div>

              {/* Aadhar Document Upload */}
              <div className="relative w-full">
                <input
                  type="file"
                  id={`director_aadhar_doc_${index}`}
                  name="director_aadhar_doc"
                  onChange={(e) => handleFileUpload(`director_aadhar_doc_${index}`, e.target.files[0])}
                  className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-4 pt-5 pb-2 cursor-pointer"
                />
                <label
                  htmlFor={`director_aadhar_doc_${index}`}
                  className="absolute text-sm text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:text-blue-600"
                >
                  Upload AADHAR Card <span className="text-red-600">*</span>
                </label>
                {memberFormData[`director_aadhar_doc_${index}`] && (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-700 truncate">
                      {memberFormData[`director_aadhar_doc_${index}`].name}
                    </span>
                    <button
                      type="button"
                      className="text-red-600 text-sm font-medium"
                      onClick={() => removeFile(`director_aadhar_doc_${index}`)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* DOB */}
              <div className="relative w-full">
                <input
                  type="date"
                  id={`director_dob_${index}`}
                  name="director_dob"
                  value={director.director_dob}
                  onChange={(e) => handleDirectorChange(index, e)}
                  className={`block w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg px-4 pt-5 pb-2 peer ${errors?.director?.[index]?.director_dob ? "border-red-500" : ""
                    }`}
                  required
                />
                <label
                  htmlFor={`director_dob_${index}`}
                  className="absolute text-sm text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:text-blue-600"
                >
                  DOB <span className="text-red-600">*</span>
                </label>
              </div>

              {/* Remove Director */}
              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  onClick={() => removeDirector(index)}
                  className="text-red-800 p-3 rounded-xl cursor-pointer"
                >
                  <i className="fa-solid fa-trash fa-lg"></i>
                </Button>
              </div>
            </div>
          ))}

        {/* Step 4: Bank & Scheme */}
        {currentStep === 4 && (
          <div className="grid gap-6 mb-6 md:grid-cols-2 p-4 bg-white rounded-lg shadow-sm">

            {/* Payin Bank */}
            <div className="relative w-full">
              <select
                id="payin_at_onboard"
                name="payin_at_onboard"
                value={memberFormData.payin_at_onboard}
                onChange={handleChange}
                className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                required
              >
                <option value="">Select Payin Bank</option>
                {payinBanks?.data.map((item) => (
                  <option key={item.id} value={item.onboard_payin_bank}>
                    {item.onboard_payin_bank}
                  </option>
                ))}
              </select>
            </div>

            {/* Payout Bank */}
            <div className="relative w-full">
              <select
                id="payout_at_onboard"
                name="payout_at_onboard"
                value={memberFormData.payout_at_onboard}
                onChange={handleChange}
                className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                required
              >
                <option value="">Select Payout Bank</option>
                {payoutBanks?.data.map((item) => (
                  <option key={item.id} value={item.onboard_payout_bank}>
                    {item.onboard_payout_bank}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheme */}
            <div className="relative w-full">
              <select
                id="scheme_id"
                name="scheme_id"
                value={memberFormData.scheme_id}
                onChange={handleChange}
                className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
              >
                <option value="">Select Scheme</option>
                {schemes?.data.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}



        <div className="flex justify-between p-4 gap-4 bg-white rounded-lg shadow-sm">
          {/* Left buttons: Prev / Next / Submit */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={`text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${currentStep === 1
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
                className="cursor-pointer text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
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

          {/* Right buttons: Add Director / Go Back */}
          <div className="flex flex-wrap gap-3">
            {currentStep === 3 && (
              <Button
                type="button"
                onClick={addDirector}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
              >
                + Add Director
              </Button>
            )}
            <Button
              onClick={() => setShowConfirmModal(!showConfirmModal)}
              type="button"
              className="cursor-pointer text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Go Back
            </Button>
          </div>
        </div>

      </form>

      <SchemeModal
        showModal={showSchemeModal}
        handleModal={handleSchemeModal}
        refreshTable={refetchScheme}
      />

      {activeTab === "payin" ? (
        <BankModal
          showModal={showPayinModal}
          handleModal={handlePayinModal}
          activeTab={activeTab}
          refreshTable={refetchPayin}
        />
      ) : (
        <BankModal
          showModal={showPayoutModal}
          handleModal={handlePayoutModal}
          activeTab={activeTab}
          refreshTable={refetchPayout}
        />
      )}

      <ConfirmModal
        showConfirmModal={showConfirmModal}
        heading={"Are you sure you want to go back? "}
        body={"If you go back then you will lose your filled data in form."}
        handleConfirmModal={setShowConfirmModal}
        action={() => navigate("/member-list")}
      />
    </>
  );
};
