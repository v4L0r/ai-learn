/**
 * Dummy data for CourseOverview, Chapter, and Quiz pages.
 * Replace with real API responses once backend is ready.
 */

export const TRACKS = {
  EDUCATION: 'education',
  INTEREST: 'interest',
  CAREER: 'career',
};

export const dummyCourse = {
  id: 'course-1',
  title: 'Introduction to Machine Learning',
  track: TRACKS.EDUCATION,
  description: 'Learn the fundamentals of ML: supervised learning, neural networks, and practical applications.',
  progress: 35,
  endGoal: 'Complete ML fundamentals and build a simple classifier',
  dailyGoal: 'Watch 2 videos per day',
  monthlyGoal: 'Finish 3 chapters this month',
  hashtags: ['#MachineLearning', '#AI', '#Python'],
  chapters: [
    { id: 'ch-1', title: 'What is Machine Learning?', order: 1, completed: true, duration: '2:30' },
    { id: 'ch-2', title: 'Supervised vs Unsupervised Learning', order: 2, completed: true, duration: '3:00' },
    { id: 'ch-3', title: 'Linear Regression Basics', order: 3, completed: false, duration: '2:45' },
    { id: 'ch-4', title: 'Neural Networks Intro', order: 4, completed: false, duration: '4:00' },
    { id: 'ch-5', title: 'Building Your First Model', order: 5, completed: false, duration: '3:15' },
  ],
};

export const dummyChapter = {
  id: 'ch-3',
  courseId: 'course-1',
  title: 'Linear Regression Basics',
  order: 3,
  videoUrl: null, // Placeholder - will be real video URL from MiniMax
  duration: '2:45',
  caption: `Linear regression is one of the simplest yet most powerful algorithms in machine learning. It models the relationship between a dependent variable and one or more independent variables using a straight line.

Key concepts covered:
• <a href="#loss-function">Loss function</a> and gradient descent
• <a href="#overfitting">Overfitting</a> and regularization
• <a href="#scikit-learn">Implementing with scikit-learn</a>

For a deeper dive into the math behind gradient descent, check out our advanced <a href="#gradient-descent">gradient descent</a> module.`,
  likes: 1247,
  saved: false,
};

export const dummyQuiz = {
  id: 'quiz-1',
  courseId: 'course-1',
  chapterId: 'ch-3',
  title: 'Daily Check-in: Linear Regression',
  type: 'daily', // 'daily' | 'milestone'
  questions: [
    {
      id: 'q1',
      type: 'mcq',
      question: 'What does linear regression predict?',
      options: ['Categories', 'Continuous values', 'Probabilities', 'Clusters'],
      correctIndex: 1,
    },
    {
      id: 'q2',
      type: 'fill_blank',
      question: 'The _____ function measures how wrong our predictions are.',
      answer: 'loss',
      alternatives: ['cost', 'error'],
    },
    {
      id: 'q3',
      type: 'short_answer',
      question: 'Name one technique to prevent overfitting in linear regression.',
      answer: 'regularization',
      alternatives: ['L1', 'L2', 'ridge', 'lasso', 'dropout'],
    },
  ],
};
