import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';

export default function SubmissionsPage() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;

  useEffect(() => {
    fetch(`http://localhost:8080/api/submissions/user/${userId}/exercise/${exerciseId}`)
      .then(res => res.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch submissions:', err);
        setLoading(false);
      });
  }, [exerciseId, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-white text-xl">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar title="My Submissions" showBack={true} backTo={`/exercise/${exerciseId}`} />

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {submissions.length === 0 ? (
          <div className="bg-gray-700 rounded-lg border border-gray-600 p-8 text-center">
            <p className="text-gray-400 text-lg">No submissions yet for this exercise.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub, i) => (
              <div
                key={sub.id}
                onClick={() => navigate(`/results/${exerciseId}?submissionId=${sub.id}`)}
                className="bg-gray-700 rounded-lg border border-gray-600 p-5 cursor-pointer hover:bg-gray-600 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">#{submissions.length - i}</span>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      sub.status === 'completed' ? 'bg-green-900 text-green-400 border border-green-700' :
                      sub.status === 'error'     ? 'bg-red-900 text-red-400 border border-red-700' :
                                                   'bg-yellow-900 text-yellow-400 border border-yellow-700'
                    }`}>
                      {sub.status}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-yellow-400 font-bold">
                    {sub.totalPoints} / {sub.maxPoints} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}