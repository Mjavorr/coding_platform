import React, { useState } from 'react';

export default function TestResultCard({ test }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    if (status === 'passed') return 'bg-green-900 border-green-700';
    if (status === 'failed') return 'bg-red-900 border-red-700';
    if (status === 'timeout') return 'bg-orange-900 border-orange-700';
    return 'bg-yellow-900 border-yellow-700';
  };

  const getStatusText = (status) => {
    if (status === 'passed') return 'text-green-400';
    if (status === 'failed') return 'text-red-400';
    if (status === 'timeout') return 'text-orange-400';
    return 'text-yellow-400';
  };

  const showDetails = !test.isHidden || test.status !== 'passed';

  return (
    <div className={`rounded-lg border overflow-hidden ${getStatusColor(test.status)}`}>
      {/* Compact Header - always visible */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white hover:bg-opacity-5 transition"
        onClick={() => showDetails && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className={`font-bold uppercase text-sm ${getStatusText(test.status)}`}>
            {test.status}
          </span>
          {test.isHidden && (
            <span className="text-xs text-gray-500 italic">hidden test</span>
          )}
          {test.executionTime > 0 && (
            <span className="text-xs text-gray-400">{test.executionTime}ms</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-bold ${getStatusText(test.status)}`}>
            +{test.pointsEarned} pts
          </span>
          {showDetails && (
            <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      {expanded && showDetails && (
        <div className="px-4 pb-4 bg-gray-900 border-t border-gray-700">
          {test.isHidden && test.status !== 'passed' ? (
            <p className="text-gray-400 text-sm italic pt-3">
              Hidden test case — details not shown.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-sm pt-3">
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
          {test.errorMessage && (
            <div className="mt-3 p-3 rounded border bg-red-900 bg-opacity-30 border-red-600 text-red-300">
              <p className="font-mono text-sm">{test.errorMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}