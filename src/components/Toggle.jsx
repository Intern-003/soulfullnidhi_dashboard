import React, { useState } from "react";

const Toggle = ({ defaultChecked = false, onChange, disabled = false }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <label
      className={`inline-flex items-center ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isChecked}
        onChange={handleToggle}
        disabled={disabled}
      />
      <div
        className={`relative w-9 h-5 bg-red-500 peer-focus:outline-none peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500`}
      ></div>
    </label>
  );
};

export default Toggle;
