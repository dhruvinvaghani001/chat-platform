import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Protected = ({ children, authentication }) => {
  const status = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  console.log(status);

  useEffect(() => {
    if (!status && authentication) {
      navigate("/login");
    }
    if (!authentication && status) {
      navigate("/");
    }
  }, []);

  return <>{children}</>;
};

export default Protected;
