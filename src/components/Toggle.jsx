import React, { useState } from "react";

const Toggle = ({ defaultChecked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isChecked}
        onChange={handleToggle}
      />
      <div className="relative w-9 h-5 bg-red-500 peer-focus:outline-none peer-focus:ring-green-300
        rounded-full peer dark:bg-red-700 dark:peer-focus:ring-green-800
        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all
        dark:border-gray-600 peer-checked:bg-green-500">
      </div>


    </label>
  );
};

export default Toggle;
