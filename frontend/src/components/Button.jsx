import React from "react";

const Button = ({ children, onclick, className = "", type }) => {
  return (
    <>
      <button
        className={`px-4 py-2 md:px-8 md:py-4 bg-violet-600 rounded-md text-lg md:text-xl ${className}`}
        onClick={onclick}
        type={type}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
