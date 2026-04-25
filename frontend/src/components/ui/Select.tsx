import React, { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, name, error, children, ...props }, ref) => {
    const errorClasses =
      "border-red-500 focus:border-red-500 focus:ring-red-500";
    const defaultClasses =
      "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

    return (
      <div className="w-full">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <select
          id={name}
          name={name}
          ref={ref}
          className={`block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-1 sm:text-sm rounded-md ${error ? errorClasses : defaultClasses}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
