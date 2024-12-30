import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle, linkText, linkTo }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>
        {children}
        <div className="text-center">
          <Link to={linkTo} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
}