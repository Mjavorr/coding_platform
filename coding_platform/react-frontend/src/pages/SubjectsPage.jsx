import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetch('${process.env.REACT_APP_API_URL}/api/subjects')
      .then(res => res.json())
      .then(data => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch subjects:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-white text-xl">Loading subjects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar title="Coding Practice Platform" centerTitle={true} showLeaderboard={true}/>

      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome, {user?.username}!
          </h2>
          <p className="text-gray-400">Select a subject to start practicing</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {subjects.map(subject => (
            <div
              key={subject.id}
              onClick={() => navigate(`/exercises?subjectId=${subject.id}`)}
              className="bg-gray-700 rounded-lg border border-gray-600 p-6 cursor-pointer hover:bg-gray-600 transition"
              style={{ borderLeftColor: '#3B82F6', borderLeftWidth: '4px' }}
            >
              <h3 className="text-white font-bold text-xl mb-2">{subject.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{subject.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: '#3B82F620', color: '#3B82F6' }}
                >
                  {subject.code}
                </span>
                <span className="text-gray-400 text-sm">View exercises →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}