import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExerciseCard({ id, title, subtitle, dueDate, status, points, user }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [assignedLessonIds, setAssignedLessonIds] = useState([]);
  const [dueDates, setDueDates] = useState({});
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [studentProgress, setStudentProgress] = useState({});

  const fetchLessonData = async () => {
    const [lessonsRes, assignedRes] = await Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/api/lessons/teacher/${user.userId}`),
      fetch(`${process.env.REACT_APP_API_URL}/api/lessons/exercise/${id}`)
    ]);
    setLessons(await lessonsRes.json());
    setAssignedLessonIds(await assignedRes.json());
  };

  const handleAssign = async (lessonId) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/lessons/exercise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, exerciseId: id, dueDate: dueDates[lessonId] || null })
    });
    setAssignedLessonIds(prev => [...prev, lessonId]);
  };

  const handleRemove = async (lessonId) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}/exercise/${id}`, { method: 'DELETE' });
    setAssignedLessonIds(prev => prev.filter(lid => lid !== lessonId));
  };

  const getStatusBadge = () => {
    if (status === 'completed') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-green-900 border border-green-600">
          <span className="text-green-400">✓</span>
          <span className="text-xs font-medium text-green-400">Completed</span>
        </div>
      );
    }
    if (status === 'started') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-yellow-900 border border-yellow-600">
          <span className="text-yellow-400">⟳</span>
          <span className="text-xs font-medium text-yellow-400">In Progress</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded bg-gray-800 border border-gray-600">
        <span className="text-gray-400">○</span>
        <span className="text-xs font-medium text-gray-400">Not Started</span>
      </div>
    );
  };

  const handleExpandLesson = async (lessonId) => {
    if (expandedLesson === lessonId) {
      setExpandedLesson(null);
      return;
    }
    setExpandedLesson(lessonId);
    if (!studentProgress[lessonId]) {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}/progress/${id}`);
      const data = await res.json();
    setStudentProgress(prev => ({ ...prev, [lessonId]: data }));
    }
  };  

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg p-5 flex items-center justify-between hover:shadow-xl hover:border-blue-500 transition border border-gray-600">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-lg text-white">{title}</h3>
          {getStatusBadge()}
          <div className="px-3 py-1 rounded bg-yellow-900 border border-yellow-600">
            <span className="text-yellow-400 font-bold">{points} pts</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-2">{subtitle}</p>
        {dueDate && (
          <span className="text-xs font-medium px-2 py-1 rounded border text-orange-400 bg-orange-900 border-orange-700">
             Due: {new Date(dueDate).toLocaleDateString()}
             </span>
            )}
      </div>
     <div className="flex gap-2 ml-4">
        {user?.role === 'teacher' && (
          <button
            onClick={(e) => { e.stopPropagation(); fetchLessonData(); setShowModal(true); }}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition font-medium"
          >
            Lessons
          </button>
        )}
        <button
          onClick={() => navigate(`/exercise/${id}`)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
        >
          Open
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-600 p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Manage Lessons</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
            </div>
            {lessons.length === 0 ? (
              <p className="text-gray-400">No lessons found.</p>
            ) : (
              <div className="space-y-3">
                {lessons.map(lesson => {
                  const assigned = assignedLessonIds.includes(lesson.id);
                  return (
                    <div key={lesson.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-white font-medium">{lesson.subjectName}</span>
                          <span className="text-gray-400 text-sm ml-2">{lesson.dayOfWeek} {lesson.startTime}</span>
                          <span className="text-gray-500 text-sm ml-2">{lesson.semester} {lesson.year}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleExpandLesson(lesson.id)}
                            className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                          >
                            {expandedLesson === lesson.id ? 'Hide' : 'Students'}
                          </button>
                          {assigned ? (
                            <button onClick={() => handleRemove(lesson.id)} className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-sm">
                              Remove
                            </button>
                          ) : (
                            <button onClick={() => handleAssign(lesson.id)} className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-sm">
                              Assign
                            </button>
                          )}
                        </div>
                      </div>
                      {expandedLesson === lesson.id && (
                        <div className="mt-3 border-t border-gray-600 pt-3">
                          {!studentProgress[lesson.id] ? (
                            <p className="text-gray-400 text-sm">Loading...</p>
                          ) : studentProgress[lesson.id].length === 0 ? (
                            <p className="text-gray-400 text-sm">No students enrolled.</p>
                          ) : (
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-gray-400 border-b border-gray-600">
                                  <th className="text-left py-1">Student</th>
                                  <th className="text-center py-1">Score</th>
                                  <th className="text-center py-1">Attempts</th>
                                  <th className="text-center py-1">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {studentProgress[lesson.id].map(s => (
                                  <tr key={s.userId} className="border-b border-gray-700">
                                    <td className="py-2 text-white">{s.username}</td>
                                    <td className="py-2 text-center text-yellow-400">{s.bestScore} pts</td>
                                    <td className="py-2 text-center text-gray-300">{s.attempts}</td>
                                    <td className="py-2 text-center">
                                      {s.completedAt ? (
                                        <span className="text-green-400">Completed</span>
                                      ) : s.attempts > 0 ? (
                                        <span className="text-yellow-400">In Progress</span>
                                      ) : (
                                        <span className="text-gray-400">Not Started</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                      {!assigned && (
                        <input
                          type="datetime-local"
                          onChange={(e) => setDueDates(prev => ({ ...prev, [lesson.id]: e.target.value }))}
                          className="w-full bg-gray-900 text-gray-300 border border-gray-600 rounded px-3 py-1 text-sm mt-2"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}