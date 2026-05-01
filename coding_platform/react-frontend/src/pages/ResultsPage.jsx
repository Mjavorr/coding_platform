import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/NavBar';
import TestResultCard from '../components/TestResultCard';

export default function ResultsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('submissionId');
  const maxPoints = parseInt(searchParams.get('maxPoints') || '0');
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (submissionId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/submissions/${submissionId}`)
        .then(res => res.json())
        .then(detail => {
          const totalPoints = detail.testResults.reduce((sum, t) => sum + (t.pointsEarned || 0), 0);
          setResults({
            summary: {
              totalPoints,
              maxPoints,
              percentage: maxPoints > 0 ? Math.round(totalPoints * 100 / maxPoints) : 0,
              passed: detail.testResults.filter(t => t.status === 'passed').length,
              failed: detail.testResults.filter(t => t.status !== 'passed').length,
            },
            results: detail.testResults
          });
        });
      return;
    }
    const storedResults = localStorage.getItem('testResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
      localStorage.removeItem('testResults');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    fetch(`${process.env.REACT_APP_API_URL}/api/submissions/user/${user?.userId}/exercise/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                const latest = data[0];
                fetch(`${process.env.REACT_APP_API_URL}/api/submissions/${latest.id}`)
                    .then(res => res.json())
                    .then(detail => {
                      const totalPoints = detail.testResults.reduce((sum, t) => sum + (t.pointsEarned || 0), 0);
                      const maxPoints = latest.maxPoints || 0;
                        setResults({
                            summary: {
                              totalPoints,
                              maxPoints,
                              percentage: maxPoints > 0 ? Math.round(totalPoints * 100 / maxPoints) : 0,
                              passed: detail.testResults.filter(t => t.status === 'passed').length,
                              failed: detail.testResults.filter(t => t.status !== 'passed').length,
                            },
                            results: detail.testResults
                        });
                    });
            }
        })
        .catch(err => console.error('Failed to load results:', err));
  }, [id, submissionI, maxPoints]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading results...</div>
      </div>
    );
  }

  const { summary, results: testResults } = results;

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar title="Test Results" showBack={true} backTo={`/exercise/${id}`} />

      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Score Summary Card */}
        <div className="bg-gray-700 rounded-lg shadow-lg p-8 mb-6 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Your Score: {summary.percentage}%
              </h2>
              <p className="text-gray-400 text-lg">
                {summary.passed} passed • {summary.failed} failed
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="px-4 py-2 rounded bg-yellow-900 border border-yellow-600">
                  <span className="text-yellow-400 font-bold text-xl">
                    🏆 {summary.totalPoints} / {summary.maxPoints} points earned
                  </span>
                </div>
              </div>
            </div>
            <div className={`text-6xl font-bold ${
              summary.percentage >= 80 ? 'text-green-400' : 
              summary.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {summary.percentage >= 80 ? '🎉' : summary.percentage >= 50 ? '👍' : '💪'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex gap-1 h-4 rounded-full overflow-hidden">
              {summary.passed > 0 && (
                <div 
                  className="bg-green-500 transition-all" 
                  style={{ width: `${(summary.passed / testResults.length) * 100}%` }}
                />
              )}
              {summary.failed > 0 && (
                <div 
                  className="bg-red-500 transition-all" 
                  style={{ width: `${(summary.failed / testResults.length) * 100}%` }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Detailed Results</h3>
          
          {testResults.map((test, i) => (
            <TestResultCard key={i} test={test} />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={() => navigate(`/exercise/${id}`)}
            className="bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-medium text-lg"
          >
            ← Edit Your Code
          </button>
          <button
            onClick={() => navigate('/exercises')}
            className="bg-gray-600 text-white py-4 rounded-lg hover:bg-gray-500 transition font-medium text-lg"
          >
            Choose Another Exercise
          </button>
        </div>

        {/* Feedback Section */}
        {summary.percentage < 100 && (
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mt-6">
            <h3 className="font-semibold text-white mb-3">💡 Tips for Improvement:</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Review the failed test cases and check your edge case handling</li>
              <li>• Make sure your output format exactly matches the expected output</li>
              <li>• Check for off-by-one errors and boundary conditions</li>
            </ul>
          </div>
        )}

        {summary.percentage === 100 && (
          <div className="bg-green-900 bg-opacity-30 border border-green-600 rounded-lg p-6 mt-6">
            <h3 className="font-semibold text-green-400 mb-3 text-xl">🎉 Perfect Score!</h3>
            <p className="text-gray-300">
              Congratulations! You've passed all test cases. Ready for the next challenge?
            </p>
          </div>
        )}
      </div>
    </div>
  );
}