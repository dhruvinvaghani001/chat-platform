import React from "react";

const Button = ({ children, onclick, className = "", type }) => {
  return (
    <>
      <button
        className={` rounded-md  ${className}`}
        onClick={onclick}
        type={type}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
