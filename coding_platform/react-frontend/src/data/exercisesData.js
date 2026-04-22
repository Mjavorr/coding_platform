export const exercises = [
  {
    id: 1,
    title: 'Sorting Algorithms',
    subtitle: 'Arrays, swaps',
    difficulty: 'Medium',
    points: 200,
    status: 'completed',
    description: 'Implement a function that sorts an array of numbers using any sorting algorithm.',
    instructions: [
      'Create a function called sortArray(arr)',
      'The function should return a sorted array in ascending order',
      'You can use any sorting algorithm (bubble sort, merge sort, quick sort, etc.)',
      'Time complexity should be O(n log n) or better for optimal solution'
    ],
    examples: [
      { input: '[5, 2, 8, 1, 9]', output: '[1, 2, 5, 8, 9]' },
      { input: '[3, 3, 1, 2]', output: '[1, 2, 3, 3]' },
      { input: '[10]', output: '[10]' }
    ],
    testCases: [
      {
        name: 'Test Case 1: Basic sorting',
        input: '5\n5 2 8 1 9',
        expectedOutput: '1 2 5 8 9',
        points: 20
      },
      {
        name: 'Test Case 2: Already sorted',
        input: '5\n1 2 3 4 5',
        expectedOutput: '1 2 3 4 5',
        points: 20
      },
      {
        name: 'Test Case 3: Reverse sorted',
        input: '5\n9 7 5 3 1',
        expectedOutput: '1 3 5 7 9',
        points: 20
      },
      {
        name: 'Test Case 4: Duplicates',
        input: '5\n3 3 1 2 3',
        expectedOutput: '1 2 3 3 3',
        points: 20
      },
      {
        name: 'Test Case 5: Large array',
        input: '10\n10 9 8 7 6 5 4 3 2 1',
        expectedOutput: '1 2 3 4 5 6 7 8 9 10',
        points: 20
      }
    ],
    // Update starter code to match test format
    starterCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    
    int arr[n];
    for(int i = 0; i < n; i++) {
      int temp,o = 0;
      scanf("%d", &temp);
      if (i == 0){
        arr[0] = temp;
      } else {
        int temp2;
        while (o < i){
          if (arr[o] > temp){
            temp2 = arr[o];
            arr[o] = temp;
            temp = temp2;
          }
          o++;
        }
        arr[o] = temp;
      }
    }
    
    // Print the sorted array
    for(int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if(i < n-1) printf(" ");
    }
    printf("\\n");
    
    return 0;
}`
  },
  {
    id: 2,
    title: 'Prime Number Checker',
    subtitle: 'Math basics',
    difficulty: 'Easy',
    points: 100,
    status: 'completed',
    description: 'Write a function that checks if a number is prime.',
    instructions: [
      'Create a function called isPrime(num)',
      'Return true if the number is prime, false otherwise',
      'Handle edge cases (negative numbers, 0, 1, 2)',
      'Optimize for large numbers if possible'
    ],
    examples: [
      { input: '7', output: 'true' },
      { input: '4', output: 'false' },
      { input: '1', output: 'false' }
    ],
    starterCode: '// Write your solution here\n\nfunction isPrime(num) {\n  // Your code here\n  \n}\n\n// Test your function\nconsole.log(isPrime(7));',
    testCases: [
    {
      name: 'Test Case 1: Prime number',
      input: '7',
      expectedOutput: 'true',
      points: 25
    },
    {
      name: 'Test Case 2: Not prime',
      input: '4',
      expectedOutput: 'false',
      points: 25
    },
    {
      name: 'Test Case 3: Edge case - 1',
      input: '1',
      expectedOutput: 'false',
      points: 25
    },
    {
      name: 'Test Case 4: Edge case - 2',
      input: '2',
      expectedOutput: 'true',
      points: 25
    }
  ]
  },
  {
    id: 3,
    title: 'Binary Search Tree',
    subtitle: 'Trees, recursion',
    difficulty: 'Hard',
    points: 300,
    status: 'started',
    description: 'Implement basic BST operations including insert and search.',
    instructions: [
      'Create a BST class with insert and search methods',
      'Handle duplicate values appropriately',
      'Implement recursive or iterative solutions',
      'Maintain BST property: left < parent < right'
    ],
    examples: [
      { input: 'insert(5), insert(3), search(3)', output: 'true' },
      { input: 'insert(5), insert(7), search(3)', output: 'false' }
    ],
    starterCode: '// Write your solution here\n\nclass BST {\n  constructor() {\n    // Your code here\n  }\n  \n  insert(value) {\n    // Your code here\n  }\n  \n  search(value) {\n    // Your code here\n  }\n}',
    testCases: [
      {
        name: 'Test Case 1: Insert and search',
        input: 'tree.insert(5), tree.search(5)',
        expectedOutput: 'true',
        points: 25
      },
      {
        name: 'Test Case 2: Search non-existent',
        input: 'tree.insert(5), tree.search(10)',
        expectedOutput: 'false',
        points: 25
      }
    ]
  },
  {
    id: 4,
    title: 'String Manipulation',
    subtitle: 'Strings, loops',
    difficulty: 'Easy',
    points: 100,
    status: 'uncompleted',
    description: 'Reverse a string without using built-in reverse methods.',
    instructions: [
      'Create a function called reverseString(str)',
      'Return the reversed string',
      'Do not use .reverse() or similar built-in methods',
      'Handle empty strings and single characters'
    ],
    examples: [
      { input: '"hello"', output: '"olleh"' },
      { input: '"a"', output: '"a"' },
      { input: '""', output: '""' }
    ],
    starterCode: '// Write your solution here\n\nfunction reverseString(str) {\n  // Your code here\n  \n}\n\n// Test your function\nconsole.log(reverseString("hello"));',
    testCases: [
      {
        name: 'Test Case 1: Normal string',
        input: '"hello"',
        expectedOutput: '"olleh"',
        points: 25
      },
      {
        name: 'Test Case 2: Single character',
        input: '"a"',
        expectedOutput: '"a"',
        points: 25
      },
      {
        name: 'Test Case 3: Empty string',
        input: '""',
        expectedOutput: '""',
        points: 25
      }
    ]
  },
  {
    id: 5,
    title: 'Graph Traversal',
    subtitle: 'Graphs, BFS/DFS',
    difficulty: 'Hard',
    points: 300,
    status: 'uncompleted',
    description: 'Implement BFS (Breadth-First Search) for graph traversal.',
    instructions: [
      'Create a function called BFS(graph, start)',
      'Return the order of visited nodes',
      'Use a queue for traversal',
      'Handle disconnected graphs'
    ],
    examples: [
      { input: 'graph={A:[B,C], B:[D], C:[D], D:[]}, start=A', output: '[A,B,C,D]' }
    ],
    starterCode: '// Write your solution here\n\nfunction BFS(graph, start) {\n  // Your code here\n  \n}\n\n// Test your function\nconst graph = {A:["B","C"], B:["D"], C:["D"], D:[]};\nconsole.log(BFS(graph, "A"));',
    testCases: [
      {
        name: 'Test Case 1: Simple graph',
        input: 'graph={A:[B,C], B:[D], C:[D], D:[]}, start=A',
        expectedOutput: '[A,B,C,D]',
        points: 25
      }
    ]
  },
  {
    id: 6,
    title: 'Dynamic Programming',
    subtitle: 'Optimization, memoization',
    difficulty: 'Hard',
    points: 300,
    status: 'started',
    description: 'Solve the fibonacci sequence using dynamic programming.',
    instructions: [
      'Create a function called fibonacci(n)',
      'Use memoization to optimize',
      'Return the nth fibonacci number',
      'Time complexity should be O(n)'
    ],
    examples: [
      { input: '5', output: '5' },
      { input: '10', output: '55' }
    ],
    starterCode: '// Write your solution here\n\nfunction fibonacci(n) {\n  // Your code here\n  \n}\n\n// Test your function\nconsole.log(fibonacci(10));',
    testCases: [
      {
        name: 'Test Case 1: Small number',
        input: '5',
        expectedOutput: '5',
        points: 25
      },
      {
        name: 'Test Case 2: Larger number',
        input: '10',
        expectedOutput: '55',
        points: 25
      }
    ]
  },
  {
    id: 7,
    title: 'Hash Tables',
    subtitle: 'Data structures, lookup',
    difficulty: 'Medium',
    points: 200,
    status: 'uncompleted',
    description: 'Implement a simple hash table with basic operations.',
    instructions: [
      'Create a HashTable class',
      'Implement set(key, value) and get(key) methods',
      'Handle collisions using chaining or linear probing',
      'Implement a simple hash function'
    ],
    examples: [
      { input: 'set("name", "John"), get("name")', output: '"John"' }
    ],
    starterCode: '// Write your solution here\n\nclass HashTable {\n  constructor(size = 50) {\n    // Your code here\n  }\n  \n  set(key, value) {\n    // Your code here\n  }\n  \n  get(key) {\n    // Your code here\n  }\n}',
    testCases: [
      {
        name: 'Test Case 1: Set and get',
        input: 'ht.set("name", "John"), ht.get("name")',
        expectedOutput: '"John"',
        points: 25
      }
    ]
  },
  {
    id: 8,
    title: 'Linked Lists',
    subtitle: 'Pointers, traversal',
    difficulty: 'Medium',
    points: 200,
    status: 'completed',
    description: 'Implement a singly linked list with basic operations.',
    instructions: [
      'Create a LinkedList class',
      'Implement append(value) and find(value) methods',
      'Handle edge cases (empty list, single node)',
      'Properly manage node pointers'
    ],
    examples: [
      { input: 'append(1), append(2), find(2)', output: 'true' }
    ],
    starterCode: '// Write your solution here\n\nclass Node {\n  constructor(value) {\n    this.value = value;\n    this.next = null;\n  }\n}\n\nclass LinkedList {\n  constructor() {\n    this.head = null;\n  }\n  \n  append(value) {\n    // Your code here\n  }\n  \n  find(value) {\n    // Your code here\n  }\n}',
    testCases: [
      {
        name: 'Test Case 1: Append and find',
        input: 'll.append(1), ll.append(2), ll.find(2)',
        expectedOutput: 'true',
        points: 25
      }
    ]
  }
];

// Helper function to get exercise by ID
export const getExerciseById = (id) => {
  return exercises.find(ex => ex.id === parseInt(id));
};

// Helper function to get exercises by status
export const getExercisesByStatus = (status) => {
  if (status === 'all') return exercises;
  return exercises.filter(ex => ex.status === status);
};

// Helper function to get exercises by difficulty
export const getExercisesByDifficulty = (difficulty) => {
  if (difficulty === 'all') return exercises;
  return exercises.filter(ex => ex.difficulty === difficulty);
};

// Helper function to calculate total points earned
export const calculateTotalPoints = () => {
  return exercises
    .filter(ex => ex.status === 'completed')
    .reduce((total, ex) => total + ex.points, 0);
};

// Helper function to calculate maximum possible points
export const calculateMaxPoints = () => {
  return exercises.reduce((total, ex) => total + ex.points, 0);
};