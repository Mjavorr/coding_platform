import React from 'react';

export default function TestResultCard({ test }) {
  const getStatusColor = (status) => {
    if (status === 'passed') return 'bg-green-500';
    if (status === 'failed') return 'bg-red-500';
    if (status === 'timeout') return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
      {/* Header */}
      <div className={`${getStatusColor(test.status)} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <p className="text-sm text-white text-opacity-80">
            Execution time: {test.executionTime ? `${test.executionTime}ms` : 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg uppercase">{test.status}</span>
          {!test.isHidden && (
            <span className="text-white text-sm">+{test.pointsEarned} pts</span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-4 bg-gray-800">
        {test.isHidden && test.status !== 'passed' ? (
          <p className="text-gray-400 text-sm italic">
            This is a hidden test case. Details are not shown.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Input:</p>
              <code className="text-blue-400 font-mono whitespace-pre">{test.input}</code>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Expected:</p>
              <code className="text-green-400 font-mono">{test.expectedOutput}</code>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Your Output:</p>
              <code className={`font-mono ${
                test.status === 'passed' ? 'text-green-400' : 'text-red-400'
              }`}>
                {test.actualOutput || 'No output'}
              </code>
            </div>
          </div>
        )}

        {/* Error or Warning Message */}
        {test.errorMessage && (
          <div className="mt-4 p-3 rounded border bg-red-900 bg-opacity-30 border-red-600 text-red-300">
            <p className="font-mono text-sm">{test.errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}