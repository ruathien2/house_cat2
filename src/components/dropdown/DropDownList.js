import React, { useEffect, useRef } from "react";
import { useDropdown } from "../../contexts/dropdown-context";

export default function DropDownList({ children }) {
  const { show, setShow } = useDropdown();

  return (
    <>
      {show && (
        <div className="w-full absolute top-full left-0  bg-[#E7ECF3] text-[#84878b] rounded-[8px]">
          {children}
        </div>
      )}
    </>
  );
}
