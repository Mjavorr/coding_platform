import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/NavBar';
import ExerciseCard from '../components/ExerciseCard';
import FilterButton from '../components/FilterButton';
import StatCard from '../components/StatCard';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('all');
  const [filterDifficulty] = useState('all');
  const navigate = useNavigate();

  const location = useLocation();
  const subjectId = new URLSearchParams(location.search).get('subjectId');
  const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.userId;

    if (!userId) {
        navigate('/');
    }

  useEffect(() => {
    Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/exercises?subjectId=${subjectId}`).then(res => res.json()),
        fetch(`${process.env.REACT_APP_API_URL}/api/progress/${userId}`).then(res => res.json())
    ]).then(([exercisesData, progressData]) => {
        // Merge progress into exercises
        const exercisesWithProgress = exercisesData.map(ex => {
            const progress = progressData.find(p => p.exerciseId === ex.id);
            return {
                ...ex,
                status: progress ? progress.status : 'uncompleted',
                bestScore: progress ? progress.bestScore : 0,
                attempts: progress ? progress.attempts : 0
            };
        });
        setExercises(exercisesWithProgress);
        setLoading(false);
    }).catch(err => {
        console.error('Failed to fetch data:', err);
        setLoading(false);
    });
}, []);

  const completed = exercises.filter(ex => ex.status === 'completed').length;
  const started = exercises.filter(ex => ex.status === 'started').length;
  const totalPointsEarned = exercises.reduce((sum, ex) => sum + (ex.bestScore || 0), 0);

  // Filter exercises
  const filteredExercises = exercises.filter(ex => {
    const statusMatch = sortBy === 'all' || ex.status === sortBy;
    const difficultyMatch = filterDifficulty === 'all' || ex.difficulty === filterDifficulty;
    return statusMatch && difficultyMatch;
});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-white text-xl">Loading exercises...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar title="Coding Practice Platform" centerTitle={true} showBack={true} backTo="/subjects" showLeaderboard={true}/>

      <div className="max-w-6xl mx-auto px-4">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard value={completed} label="Completed" color="green" />
          <StatCard value={started} label="In Progress" color="yellow" />
          <StatCard value={exercises.length - completed - started} label="Not Started" color="gray" />
          <StatCard value={totalPointsEarned} label="Points Earned" color="purple" />
        </div>

        {/* Filters */}
        <div>
    <h3 className="text-sm font-medium text-gray-300 mb-2">Filter by Status:</h3>
    <div className="flex gap-2">
        <FilterButton
            label="All"
            count={exercises.length}
            isActive={sortBy === 'all'}
            onClick={() => setSortBy('all')}
            color="blue"
        />
        <FilterButton
            label="Completed"
            count={completed}
            isActive={sortBy === 'completed'}
            onClick={() => setSortBy('completed')}
            color="green"
        />
        <FilterButton
            label="In Progress"
            count={started}
            isActive={sortBy === 'started'}
            onClick={() => setSortBy('started')}
            color="yellow"
        />
        <FilterButton
            label="Not Started"
            count={exercises.length - completed - started}
            isActive={sortBy === 'uncompleted'}
            onClick={() => setSortBy('uncompleted')}
            color="gray"
        />
    </div>
</div>

        {/* Exercise List Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Exercises
            <span className="text-gray-400 text-lg ml-2">
              ({filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'})
            </span>
          </h2>
        </div>

        {/* Exercise List */}
        <div className="space-y-3 pb-8">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                title={exercise.title}
                subtitle={exercise.subjectName}
                difficulty={exercise.difficulty}
                status={exercise.status}
                points={exercise.totalPoints}
                user={user}
              />
            ))
          ) : (
            <div className="bg-gray-700 rounded-lg p-8 text-center border border-gray-600">
              <p className="text-gray-400 text-lg">No exercises match your filters</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}