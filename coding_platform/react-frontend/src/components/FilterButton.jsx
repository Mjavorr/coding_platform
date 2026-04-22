import React from 'react';

export default function FilterButton({ 
  label, 
  isActive, 
  onClick, 
  count, 
  color = 'blue' // default color
}) {
  // Color mapping for active state
  const colorClasses = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    yellow: 'bg-yellow-600 text-white',
    red: 'bg-red-600 text-white',
    gray: 'bg-gray-500 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded transition ${
        isActive 
          ? colorClasses[color]
          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
      }`}
    >
      {label} {count !== undefined && `(${count})`}
    </button>
  );
}