import React from 'react';

export default function FormSelect({ label, error, options, value, onChange, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        {...props}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm capitalize
          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
      >
        {options.map((option) => (
          <option key={option} value={option} >
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}