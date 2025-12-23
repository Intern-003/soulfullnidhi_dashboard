import React from "react";
import logo from "../images/logo.png";

export const Stepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Business & Contact Details" },
    { id: 2, label: "Company & Bank Details" },
    { id: 3, label: "Director KYC Details" },
    {id:4, label:"Video KYC"}
  ];

  return (
    <div className="rounded-2xl shadow-xl/20 p-3  bg-white pb-6 h-120"
    >

      <div className="p-6  rounded-2xl h-110 "  style={{ background:"linear-gradient(275deg, #e0e6f0ff, #e3eafdff)" }}>
{/* <div className="flex justify-center items-center ">
  <div className="flex justify-center items-center w-20 h-20 bg-white rounded-full shadow-md mb-6">
    <img className="w-3/4 h-3/4 object-contain" src={logo} alt="logo" />
  </div>
</div> */}

      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex gap-4">
              {/* Indicator */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                    ? "bg-blue-600 text-white"
                    : "border-2 border-gray-300 text-gray-400"
                }`}
            >
              {isCompleted ? "✓" : step.id}
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`w-[2px] h-15 ${
                  isCompleted ? "bg-emerald-400" : "bg-gray-300"
                }`}
                style={{ marginTop: "2px" }}
              />
            )}
          </div>


              {/* Labels */}
          <div className="pt-1">
            {/* <p className="text-xs text-gray-500">STEP {step.id}</p> */}
            <p
              className={`text-sm ${
                isActive ? "font-bold text-blue-700" : "text-gray-800"
              }`}
            >
              {step.label}
            </p>
          </div>

            </div>
          );
        })}
      </div>
    


      </div>
    </div>
  );
};
