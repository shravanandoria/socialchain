import React from "react";
import loader from "./loader.gif";
const Spinner = () => {
  return (
    <div className="text-center flex justify-center absolute items-center h-full w-full bg-slate-500 opacity-70">
      <img src={loader} alt="loader" className="h-40" />
    </div>
  );
};

export default Spinner;
