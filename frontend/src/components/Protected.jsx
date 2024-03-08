import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Protected = ({ children, authentication }) => {
  const status = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("inside useeffect!");
    if (!status && authentication) {
      navigate("/login");
    }
    else if (!authentication && status) {
      navigate("/");
    }
  });

  return <>{children}</>;
};

export default Protected;
