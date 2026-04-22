import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SubjectsPage from './pages/SubjectsPage';
import ExercisesPage from './pages/ExercisesPage';
import ExercisePage from './pages/ExercisePage';
import ResultsPage from './pages/ResultsPage';
import UploadPage from './pages/UploadPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SubmissionsPage from './pages/SubmissionsPage';

// Main App
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/exercise/:id" element={<ExercisePage />} />
        <Route path="/submissions/:exerciseId" element={<SubmissionsPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}