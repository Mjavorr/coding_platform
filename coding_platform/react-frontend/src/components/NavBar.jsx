import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ title, showLeaderboard = false, showBack = false, backTo = '/exercises', centerTitle = false }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg p-4 mb-6 border-b-2 border-blue-600">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Left side - Back button or empty div for spacing */}
        <div className="flex-1">
          {showBack && (
            <button 
              onClick={() => navigate(backTo)} 
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition border border-gray-600"
            >
              <span>←</span>
              <span className="font-medium">Back</span>
            </button>
          )}
        </div>

        {/* Center - Title (when centerTitle is true or when back button is shown) */}
        {(centerTitle || showBack) && title && (
          <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2 text-white">
            {title}
          </h1>
        )}

        {/* Left side title (when not centered and no back button) */}
        {!centerTitle && !showBack && title && (
          <h1 className="text-xl font-bold flex-1 text-white">{title}</h1>
        )}

        {/* Right side - Buttons */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          {showLeaderboard && (<Link 
            to="/leaderboard" 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition font-medium shadow-lg"
          >
            <span>Leaderboard</span>
          </Link>
        )}
          
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/');
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium shadow-lg"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}