import React from "react";
import { useNavigate } from "react-router-dom";

const Protected = ({ children, authentication }) => {
  const userAuthenctiocation = true;
  const navigate = useNavigate();


  return <>{children}</>;
};

export default Protected;
