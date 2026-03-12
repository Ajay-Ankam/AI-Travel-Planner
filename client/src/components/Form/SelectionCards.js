"use client";
import React from "react";

export default function SelectionCards({
  options,
  selectedValue,
  onSelect,
  label,
}) {
  return (
    <div className="space-y-4">
      {label && (
        <label className="text-lg font-bold text-gray-900 block mb-2">
          {label}
        </label>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.title)}
            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-md flex flex-col items-center text-center gap-3 ${
              selectedValue === item.title
                ? "border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600/20"
                : "border-gray-100 bg-white hover:border-blue-200"
            }`}
          >
            <div
              className={`text-3xl p-3 rounded-xl ${
                selectedValue === item.title
                  ? "bg-white shadow-sm"
                  : "bg-gray-50"
              }`}
            >
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-tight mt-1">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
