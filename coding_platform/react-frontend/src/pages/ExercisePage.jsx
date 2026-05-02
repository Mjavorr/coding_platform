import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';

export default function ExercisePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/exercises/${id}`)
      .then(res => res.json())
      .then(data => {
        setExercise(data);
        setCode(data.starterCode || '// Write your solution here\n\n');
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch exercise:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-white text-xl">Loading exercise...</p>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Exercise not found</div>
      </div>
    );
  }

  const handleSubmit = async () => {
  setOutput('Submitting your code for testing...');
  
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code,
        exerciseId: id,
        userId: userId
      })
    });

    const result = await response.json();
    
    if (result.success) {
      localStorage.setItem('testResults', JSON.stringify(result));
      navigate(`/results/${id}?subjectId=${exercise.subjectId}`);
    } else {
      setOutput(`✗ Submission failed:\n${result.error}`);
    }
  } catch (err) {
    setOutput('✗ Failed to connect to backend.');
  }
};

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar title={exercise.title} showBack={true} backTo={`/exercises?subjectId=${exercise.subjectId}`}  />

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Instructions */}
          <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Instructions</h2>
              <div className="px-4 py-2 rounded bg-yellow-900 border border-yellow-600">
                <span className="text-yellow-400 font-bold text-lg">{exercise.totalPoints} points</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4">{exercise.description}</p>
            
            {/* Test Cases as Examples */}
            <div className="border-t border-gray-600 pt-6">
              <h3 className="font-semibold mb-3 text-white">Examples:</h3>
              <div className="space-y-3">
                {exercise.testCases
                  .filter(tc => !tc.isHidden)
                  .map((tc, i) => (
                    <div key={i} className="bg-gray-800 p-3 rounded border border-gray-600">
                      <div className="font-mono text-sm">
                        <div className="text-gray-400">Input: <span className="text-blue-400">{tc.input}</span></div>
                        <div className="text-gray-400">Output: <span className="text-green-400">{tc.expectedOutput}</span></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Code & Tests */}
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
              <div className="flex border-b border-gray-600">
                <div className="px-4 py-3 font-medium text-white">
                  Editor
                </div>
              </div>

              {/* Code/Tests Editor */}
              <div className="p-4">
                <CodeMirror
                value={code}
                height="500px"
                theme={oneDark}
                extensions={[cpp()]}
                onChange={(value) => setCode(value)}
                className="rounded border border-gray-600"
              />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate(`/submissions/${id}`)}
                className="bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition font-medium"
              >
                My Submissions
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition font-medium"
              >
                Submit
              </button>
            </div>

            {/* Output Console */}
            {output && (
              <div className="bg-gray-700 rounded-lg border border-gray-600 p-4">
                <h3 className="font-semibold mb-2 text-white">Output:</h3>
                <pre className="bg-gray-900 p-4 rounded font-mono text-sm text-gray-300 overflow-x-auto border border-gray-600">
                  {output}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}