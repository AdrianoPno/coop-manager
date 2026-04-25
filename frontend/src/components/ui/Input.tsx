import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, error, ...props }, ref) => {
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
        <input
          id={name}
          name={name}
          ref={ref}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${error ? errorClasses : defaultClasses}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
