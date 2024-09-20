import React from "react";

export default function DropDownOption({ children, onClick = () => {} }) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 text-sm transition-all cursor-pointer hover:text-primary"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
