export const leaderboardData = [
  {
    rank: 1,
    username: 'CodeMaster_99',
    score: 1850,
    exercisesCompleted: 8,
    averageTime: '12m',
    streak: 15,
    badge: '🏆'
  },
  {
    rank: 2,
    username: 'AlgoQueen',
    score: 1720,
    exercisesCompleted: 8,
    averageTime: '15m',
    streak: 12,
    badge: '🥈'
  },
  {
    rank: 3,
    username: 'ByteNinja',
    score: 1680,
    exercisesCompleted: 7,
    averageTime: '14m',
    streak: 10,
    badge: '🥉'
  },
  {
    rank: 4,
    username: 'DevWizard',
    score: 1550,
    exercisesCompleted: 7,
    averageTime: '18m',
    streak: 8,
    badge: '⭐'
  },
  {
    rank: 5,
    username: 'StackOverflow_Hero',
    score: 1480,
    exercisesCompleted: 6,
    averageTime: '16m',
    streak: 7,
    badge: '⭐'
  },
  {
    rank: 6,
    username: 'BugHunter_42',
    score: 1420,
    exercisesCompleted: 6,
    averageTime: '20m',
    streak: 6,
    badge: '⭐'
  },
  {
    rank: 7,
    username: 'RecursiveGenius',
    score: 1380,
    exercisesCompleted: 5,
    averageTime: '17m',
    streak: 5,
    badge: '⭐'
  },
  {
    rank: 8,
    username: 'ArrayArtist',
    score: 1320,
    exercisesCompleted: 5,
    averageTime: '22m',
    streak: 4,
    badge: '⭐'
  },
  {
    rank: 9,
    username: 'LoopLegend',
    score: 1280,
    exercisesCompleted: 4,
    averageTime: '19m',
    streak: 3,
    badge: '⭐'
  },
  {
    rank: 10,
    username: 'You',
    score: 950,
    exercisesCompleted: 3,
    averageTime: '25m',
    streak: 2,
    badge: '🔥',
    isCurrentUser: true
  }
];

export const getCurrentUserRank = () => {
  return leaderboardData.find(user => user.isCurrentUser);
};

export const getTopThree = () => {
  return leaderboardData.slice(0, 3);
};