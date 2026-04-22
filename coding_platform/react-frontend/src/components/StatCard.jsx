import React from 'react';

export default function StatCard({ value, label, color = 'gray' }) {
  // Color mapping for the value text
  const colorClasses = {
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    red: 'text-red-400',
    gray: 'text-gray-400',
    purple: 'text-purple-400'
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}