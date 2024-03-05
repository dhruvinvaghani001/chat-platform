import React from "react";
import { Puff } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    <>
      <Puff
        visible={true}
        height="32"
        width="32"
        color="white"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </>
  );
};

export default LoadingSpinner;
