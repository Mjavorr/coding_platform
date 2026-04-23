import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.success) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
          userId: result.userId,
          username: result.username,
          email: result.email,
          role: result.role
        }));
        navigate('/subjects');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Coding Practice Platform</h1>
        <p className="text-gray-400 text-center">Master your coding skills</p>
      </div>
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-96 border border-gray-600">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white focus:outline-none focus:border-blue-500"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}