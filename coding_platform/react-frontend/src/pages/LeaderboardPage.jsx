import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const currentUserId = user?.userId;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/leaderboard`)
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch leaderboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-white text-xl">Loading leaderboard...</p>
      </div>
    );
  }

  const currentUser = leaderboard.find(u => u.userId === currentUserId);

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar title="Leaderboard" showBack={true} backTo="/subjects" />

      <div className="max-w-6xl mx-auto px-4 pb-8">

        {/* Current User Banner */}
        {currentUser && (
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 mb-6 border border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-2xl font-bold mb-2">Your Ranking</h2>
                <div className="flex items-center gap-4 text-white">
                  <div>
                    <span className="text-4xl font-bold">#{currentUser.rank}</span>
                    <span className="text-gray-300 ml-2">out of {leaderboard.length} students</span>
                  </div>
                  <div className="border-l border-blue-600 pl-4">
                    <div className="text-sm text-gray-300">Your Score</div>
                    <div className="text-2xl font-bold text-yellow-400">{currentUser.totalPoints}</div>
                  </div>
                  <div className="border-l border-blue-600 pl-4">
                    <div className="text-sm text-gray-300">Exercises Completed</div>
                    <div className="text-2xl font-bold text-green-400">{currentUser.exercisesCompleted}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-600">
            <h3 className="text-white font-bold text-xl">Full Rankings</h3>
          </div>

          {/* Table Header */}
          <div className="bg-gray-800 px-6 py-3 border-b border-gray-600 grid grid-cols-4 gap-4 text-gray-400 text-sm font-medium">
            <div>Rank</div>
            <div>Username</div>
            <div className="text-center">Score</div>
            <div className="text-center">Exercises Completed</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-600">
            {leaderboard.map((user) => (
              <div
                key={user.userId}
                className={`px-6 py-4 grid grid-cols-4 gap-4 items-center transition ${
                  user.userId === currentUserId
                    ? 'bg-blue-900 bg-opacity-30 border-l-4 border-blue-500'
                    : 'hover:bg-gray-600'
                }`}
              >
                <div className={`text-xl font-bold ${
                  user.userId === currentUserId ? 'text-blue-400' : 'text-white'
                }`}>
                  #{user.rank}
                </div>

                <div className={`font-semibold ${
                  user.userId === currentUserId ? 'text-blue-400' : 'text-white'
                }`}>
                  {user.username}
                  {user.userId === currentUserId && (
                    <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      YOU
                    </span>
                  )}
                </div>

                <div className="text-center text-yellow-400 font-bold text-lg">
                  {user.totalPoints}
                </div>

                <div className="text-center text-white font-medium">
                  {user.exercisesCompleted}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}