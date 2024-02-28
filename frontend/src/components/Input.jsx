import React, { forwardRef } from "react";

const Input = forwardRef(function Input(
  { title, type = "text", ...props },
  ref
) {
  return (
    <>
      <label>{title}</label>
      <input {...props} type={type} ref={ref} />
    </>
  );
});
export default Input;
