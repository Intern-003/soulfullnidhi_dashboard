import React, { useState } from "react";
import { Stepper } from "../components/Stepper";
import { SchemeModal } from "../components/SchemeModal";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { BankModal } from "../components/BankModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { useGet } from "../hooks/useGet";

export const MemberOnboardForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [showPayinModal, setShowPayinModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState("payin");

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
    scheme_id: ""
  });

  const navigate = useNavigate();

  const { data: payoutBanks, refetch: refetchPayout } = useGet("/payoutbanks-List?status=1");
  const { data: payinBanks, refetch: refetchPayin} = useGet("/payinbanks-List?status=1");
  const { data: schemes, refetch: refetchScheme } = useGet("/get-scheme");

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

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleChange = (e) => {
    setMemberFormData({ ...memberFormData, [e.target.name]: e.target.value });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(memberFormData);
  };

  return (
    <>
      <div className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center mb-3 p-2.5">
        <h4 className="font-bold text-white text-lg py-2">
          Add New Merchant Details
        </h4>
      </div>

      <Stepper currentStep={currentStep} />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {currentStep === 1 && (
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div className="relative">
              <input
                type="text"
                name="name"
                id="floating_outlined_name"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
                value={memberFormData.name}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_name"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Business Name <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                name="mobile_no"
                id="floating_outlined_mobile"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
                value={memberFormData.mobile_no}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_mobile"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Business Mobile <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                id="floating_outlined_email"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
                value={memberFormData.email}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_email"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Business Email <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                name="business_mcc"
                id="floating_outlined_mcc"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
                value={memberFormData.business_mcc}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_mcc"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Business MCC <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="city"
                id="floating_outlined_city"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
                value={memberFormData.city}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_city"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                City <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="state"
                id="floating_outlined_state"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
                value={memberFormData.state}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_state"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                State <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="district"
                id="floating_outlined_district"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
                value={memberFormData.district}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_district"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                District <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                name="pin_code"
                id="floating_outlined_pin"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
                value={memberFormData.pin_code}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_pin"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Pincode <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="address"
                id="floating_outlined_address"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
                value={memberFormData.address}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_address"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Address <span className="text-red-600">*</span>
              </label>
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
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
                value={memberFormData.company_pan_no}
                onChange={handleChange}
              />
              <label
                for="floating_outlined_pan"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Company Pan Number <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="file"
                name="company_pan_no_doc"
                id="floating_outlined_pan_doc"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
                onChange={(e) =>
                  setMemberFormData((prev) => ({
                    ...prev,
                    company_pan_no_doc: e.target.files[0],
                  }))
                }
              />
              <label
                for="floating_outlined_pan_doc"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Document Of Pan Card <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="company_gst_no"
                id="floating_outlined_gst"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                value={memberFormData.company_gst_no}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_gst"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                GST Number <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="file"
                name="company_gst_no_doc"
                id="floating_outlined_gst_doc"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
              />
              <label
                for="floating_outlined_gst_doc"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Document Of GST Number <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="cin_llpin"
                id="floating_outlined_cin"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                value={memberFormData.cin_llpin}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_cin"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                CIN Number <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <label
                for="company_type"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Company Type
              </label>
              <select
                id="company_type"
                name="company_type"
                onChange={handleChange}
                value={memberFormData.company_type}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
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
            </div>
            <div className="relative">
              <input
                type="date"
                name="date_of_incorporation"
                id="floating_outlined_date"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                value={memberFormData.date_of_incorporation}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_date"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Date Of Incorporation <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="account_holder_name"
                id="floating_outlined_account_holder_name"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                value={memberFormData.account_holder_name}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_account_holder_name"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Account Holder Name <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                name="bank_account_no"
                id="floating_outlined_account_number"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                value={memberFormData.bank_account_no}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_account_number"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Bank Account Number <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="ifsc_code"
                id="floating_outlined_ifsc"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                value={memberFormData.ifsc_code}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_ifsc"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                IFSC Code <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="file"
                name="cancel_cheque_doc"
                id="floating_outlined_cancel_doc"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                placeholder=""
              />
              <label
                for="floating_outlined_cancel_doc"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Document Of Cancel Cheque{" "}
                <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="website_url"
                id="floating_outlined_web"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                value={memberFormData.website_url}
                onChange={handleChange}
                placeholder=""
              />
              <label
                for="floating_outlined_web"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Website Url <span className="text-red-600">*</span>
              </label>
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
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                  value={director.director_name}
                  onChange={(e) => handleDirectorChange(index, e)}
                  placeholder=""
                />
                <label
                  for="floating_outlined_director_name"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Name <span className="text-red-600">*</span>
                </label>
              </div>
              <div className="relative">
                <label
                  for="default"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Gender
                </label>
                <select
                  id="default"
                  name="director_gender"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  value={director.director_gender}
                  onChange={(e) => handleDirectorChange(index, e)}
                >
                  <option selected>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="floating_outlined_director_pan"
                  name="director_pan_no"
                  value={director.director_pan_no}
                  onChange={(e) => handleDirectorChange(index, e)}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                  placeholder=""
                />
                <label
                  for="floating_outlined_director_pan"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Pan Number <span className="text-red-600">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="floating_outlined_director_pan_doc"
                  name="director_pan_doc"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                  placeholder=""
                />
                <label
                  for="floating_outlined_director_pan_doc"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Document Of Pan Card <span className="text-red-600">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  id="floating_outlined_director_aadhar_no"
                  name="director_aadhar_no"
                  value={director.director_aadhar_no}
                  onChange={(e) => handleDirectorChange(index, e)}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                  placeholder=""
                />
                <label
                  for="floating_outlined_director_aadhar_no"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Aadhar Number <span className="text-red-600">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="floating_outlined_director_aadhar_doc"
                  name="director_aadhar_doc"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                  placeholder=""
                />
                <label
                  for="floating_outlined_director_aadhar_doc"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Document Of Aadhar Card{" "}
                  <span className="text-red-600">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="date"
                  id="floating_outlined_director_dob"
                  name="director_dob"
                  value={director.director_dob}
                  onChange={(e) => handleDirectorChange(index, e)}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
                  placeholder=""
                />
                <label
                  for="floating_outlined_director_dob"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  DOB <span className="text-red-600">*</span>
                </label>
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
          <div className="grid gap-6 mb-6 md:grid-cols-2 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <label
                  for="default"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Payin at Onboard
                </label>
                <select
                  id="default"
                  name="payin_at_onboard"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  value={memberFormData.payin_at_onboard}
                  onChange={handleChange}
                >
                  <option selected>Select Bank</option>
                  {payinBanks?.data.map((item) => {
                    return (
                      <option key={item.id} value={item.onboard_payin_bank}>
                        {item.onboard_payin_bank}
                      </option>
                    );
                  })}
                </select>
              </div>

              <Button
                type="button"
                className="cursor-pointer text-white font-medium rounded-full w-10 h-10 text-lg flex items-center justify-center bg-blue-500 hover:bg-blue-800"
                onClick={handlePayinModal}
              >
                +
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <label
                  for="default"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Payout at Onboard
                </label>
                <select
                  id="default"
                  name="payout_at_onboard"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  value={memberFormData.payout_at_onboard}
                  onChange={handleChange}
                >
                  <option selected>Select Bank</option>
                  {payoutBanks?.data.map((item) => {
                    return (
                      <option key={item.id} value={item.onboard_payout_bank}>
                        {item.onboard_payout_bank}
                      </option>
                    );
                  })}
                </select>
              </div>

              <Button
                type="button"
                className="cursor-pointer text-white font-medium rounded-full w-10 h-10 text-lg flex items-center justify-center bg-blue-500 hover:bg-blue-800"
                onClick={handlePayoutModal}
              >
                +
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <label
                  htmlFor="default"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Scheme
                </label>
                <select
                  id="default"
                  name="scheme_id"
                  className="peer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  value={memberFormData.scheme_id}
                  onChange={handleChange}
                >
                  <option value="">Select Scheme</option>
                  {schemes?.data.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <Button
                type="button"
                className="cursor-pointer text-white font-medium rounded-full w-10 h-10 text-lg flex items-center justify-center bg-blue-500 hover:bg-blue-800"
                onClick={handleSchemeModal}
              >
                +
              </Button>
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
              className="cursor-pointer text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-cente"
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
        heading={"Are you sure you want to go back?"}
        body={"If you go back then you will lose your filled data in form."}
        handleConfirmModal={setShowConfirmModal}
        action={() => navigate("/member-list")}
      />
    </>
  );
};
