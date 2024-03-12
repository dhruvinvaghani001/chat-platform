import React from "react";
import { Puff } from "react-loader-spinner";

const LoadingSpinner = ({ className = "", height, width }) => {
  return (
    <>
      <Puff
        visible={true}
        height={height}
        width={width}
        color="white"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass={className}
      />
    </>
  );
};

export default LoadingSpinner;
