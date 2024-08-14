"use client";

import React from "react";
import { Oval } from "react-loader-spinner";

const TestPage = () => {
  return (
    <Oval
      visible={true}
      height="20"
      width="20"
      color="#0EA5E9"
      secondaryColor="rgba(0, 0, 0, 0.1)"
      strokeWidth={7}
      ariaLabel="oval-loading"
    />
  );
};

export default TestPage;
