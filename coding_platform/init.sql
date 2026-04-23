-- ============================================
-- CODING PLATFORM DATABASE SCHEMA
-- ============================================

-- 1. Users table with roles
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT
);

-- 3. Lessons/Classes table
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    semester VARCHAR(20) CHECK (semester IN ('winter', 'summer')),
    year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Exercises table
CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    starter_code TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Test cases table
CREATE TABLE test_cases (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    points INTEGER NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE
);

-- 6. Submissions table
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'error'))
);

-- 7. test results table
CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    test_case_id INTEGER NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('passed', 'failed', 'error', 'timeout')),
    actual_output TEXT,
    execution_time INTEGER,
    error_message TEXT,
    points_earned INTEGER
);

-- 8. User progress table
CREATE TABLE user_progress (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    best_score INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    last_attempted_at TIMESTAMP,
    completed_at TIMESTAMP,
    PRIMARY KEY(user_id, exercise_id)
);

-- 9. Lesson-Exercise mapping table
CREATE TABLE lesson_exercises (
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    due_date TIMESTAMP,
    PRIMARY KEY(lesson_id, exercise_id)
);

-- 10. Lesson-Student mapping table
CREATE TABLE lesson_students (
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(lesson_id, user_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_user_progress_exercise ON user_progress(exercise_id);
CREATE INDEX idx_lesson_exercises_exercise ON lesson_exercises(exercise_id);
CREATE INDEX idx_lesson_students_user ON lesson_students(user_id);

-- ============================================
-- SAMPLE DATA
-- ============================================

INSERT INTO users (email, password_hash, username, role) VALUES
('teacher@test.com', '$2a$12$t91ukyNTGUvBCfOzc6vODuxYEymWEEK7DyhOq0XpaNeZIQgovL5rq', 'jteacher', 'teacher'),
('student1@test.com', '$2a$12$EBNr8.0prfa86oNuwWWpAuGuJpPEgVeSCRJlRNBGMOgNh95ul4OYW', 'alice', 'student'),
('student2@test.com', '$2a$12$EBNr8.0prfa86oNuwWWpAuGuJpPEgVeSCRJlRNBGMOgNh95ul4OYW', 'bob', 'student');

INSERT INTO subjects (name, code, description) VALUES
('Data Structures', 'DS101',  'Arrays, Lists, Trees, Graphs'),
('Algorithms', 'ALG201', 'Sorting, Searching, Dynamic Programming'),
('Operating Systems', 'OS301', 'Processes, Memory, File Systems');

INSERT INTO lessons (subject_id, teacher_id, day_of_week, start_time, semester, year) VALUES
(1, 1, 1, '09:00', 'winter', 2024),
(1, 1, 3, '09:00', 'winter', 2024),
(2, 1, 2, '14:00', 'winter', 2024);

INSERT INTO exercises (subject_id, title, description, starter_code, is_published) VALUES
(1,
 'Sorting Algorithms',
 'Implement a function that sorts an array of numbers. Read the number of elements first, then the elements themselves. Print the sorted array separated by spaces.',
'#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int arr[n];
    for(int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    // Sort the array here

    for(int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if(i < n-1) printf(" ");
    }
    printf("\n");

    return 0;
}',
TRUE),

(1,
 'Prime Number Checker',
 'Write a program that checks if a given number is prime. Print true if it is prime, false otherwise.',
'#include <stdio.h>
#include <stdbool.h>

bool isPrime(int num) {
    // Your code here
}

int main() {
    int n;
    scanf("%d", &n);

    if(isPrime(n)) {
        printf("true\n");
    } else {
        printf("false\n");
    }

    return 0;
}',
TRUE),

(1,
 'Binary Search Tree',
 'Implement basic BST operations. Insert a sequence of numbers and then search for a given value. Print true if found, false otherwise.',
'#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

// Implement BST functions here

int main() {
    // Your code here
    return 0;
}',
TRUE);

-- Test cases for Sorting Algorithms (exercise id=1, total 200 points)
INSERT INTO test_cases (exercise_id, input, expected_output, points, is_hidden) VALUES
(1, E'5\n5 2 8 1 9', '1 2 5 8 9', 40, FALSE),
(1, E'5\n1 2 3 4 5', '1 2 3 4 5', 40, FALSE),
(1, E'5\n9 7 5 3 1', '1 3 5 7 9', 40, FALSE),
(1, E'5\n3 3 1 2 3', '1 2 3 3 3', 40, FALSE),
(1, E'1\n42', '42', 40, TRUE);

-- Test cases for Prime Number Checker (exercise id=2, total 100 points)
INSERT INTO test_cases (exercise_id, input, expected_output, points, is_hidden) VALUES
(2, '7', 'true', 25, FALSE),
(2, '4', 'false', 25, FALSE),
(2, '1', 'false', 25, FALSE),
(2, '2', 'true', 25, TRUE);

-- Test cases for Binary Search Tree (exercise id=3, total 300 points)
INSERT INTO test_cases (exercise_id, input, expected_output, points, is_hidden) VALUES
(3, E'5\n5 3 7 1 4\n3', 'true',  100, FALSE),
(3, E'5\n5 3 7 1 4\n6', 'false', 100, FALSE),
(3, E'1\n5\n5', 'true', 100, TRUE);

-- Assign exercises to lessons (no due_date = in class, with due_date = homework)
INSERT INTO lesson_exercises (lesson_id, exercise_id, due_date) VALUES
(1, 1, NULL),
(1, 2, '2024-12-15 23:59:00'),
(2, 3, NULL);

INSERT INTO lesson_students (lesson_id, user_id) VALUES
(1, 2),
(1, 3),
(2, 2),
(3, 3);

-- ============================================
-- VIEWS
-- ============================================

-- Leaderboard view
CREATE VIEW leaderboard AS
SELECT
    u.id,
    u.username,
    u.email,
    COALESCE(SUM(up.best_score), 0) AS total_points,
    COUNT(CASE WHEN up.attempts > 0 THEN 1 END) AS exercises_attempted,
    MAX(s.submitted_at) AS last_submission
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN submissions s ON u.id = s.user_id
WHERE u.role = 'student'
GROUP BY u.id, u.username, u.email
ORDER BY total_points DESC;

-- Exercise overview view
CREATE VIEW exercise_overview AS
SELECT
    e.id,
    e.title,
    COALESCE(SUM(DISTINCT tc.points), 0) AS total_points,
    s.name AS subject_name,
    s.code AS subject_code,
    COUNT(DISTINCT tc.id) AS test_case_count,
    COUNT(DISTINCT sub.id) AS submission_count
FROM exercises e
JOIN subjects s ON e.subject_id = s.id
LEFT JOIN test_cases tc ON e.id = tc.exercise_id
LEFT JOIN submissions sub ON e.id = sub.exercise_id
WHERE e.is_published = TRUE
GROUP BY e.id, e.title, s.name, s.code;

