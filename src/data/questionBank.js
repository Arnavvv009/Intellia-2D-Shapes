const SHAPES = ['square', 'rectangle', 'triangle', 'circle'];

function createQuestion(id, type, questionText, options, correctIndex, visualShape, visualShapeSet) {
  return { id, type, questionText, options, correctIndex, visualShape, visualShapeSet };
}

export const QUESTION_BANK = [];

// World 0 - Square Street: 10 varied square questions
const SQUARE_QUESTIONS = [
  "What shape is this?",
  "Which shape is this?",
  "Can you identify this shape?",
  "What do we call this shape?",
  "This is a...",
  "Tell me the name of this shape!",
  "What shape do you see here?",
  "Identify this shape!",
  "What's this shape called?",
  "Which shape is shown here?"
];
for (let i = 0; i < 10; i++) {
  const qId = i;
  QUESTION_BANK.push(
    createQuestion(
      qId,
      'identify',
      SQUARE_QUESTIONS[i],
      ['Square', 'Rectangle', 'Triangle', 'Circle'],
      0,
      'square',
      null
    )
  );
}

// World 1 - Rectangle Row: 10 varied rectangle questions
const RECTANGLE_QUESTIONS = [
  "What shape is this?",
  "Which shape do you see?",
  "Can you name this shape?",
  "This shape is a...",
  "What's the name of this shape?",
  "Tell me what shape this is!",
  "Identify this shape, please!",
  "Which shape is this?",
  "What do we call this?",
  "Name this shape!"
];
for (let i = 10; i < 20; i++) {
  QUESTION_BANK.push(
    createQuestion(
      i,
      'identify',
      RECTANGLE_QUESTIONS[i - 10],
      ['Square', 'Rectangle', 'Triangle', 'Circle'],
      1,
      'rectangle',
      null
    )
  );
}

// World 2 - Triangle Town: 10 varied triangle questions
const TRIANGLE_QUESTIONS = [
  "What shape is this?",
  "Can you tell what shape this is?",
  "This is a...",
  "Identify this shape!",
  "What's this shape?",
  "Name this shape, please!",
  "Which shape do you see here?",
  "Tell me the shape!",
  "What is this shape called?",
  "Can you name this shape?"
];
for (let i = 20; i < 30; i++) {
  QUESTION_BANK.push(
    createQuestion(
      i,
      'identify',
      TRIANGLE_QUESTIONS[i - 20],
      ['Square', 'Rectangle', 'Triangle', 'Circle'],
      2,
      'triangle',
      null
    )
  );
}

// World 3 - Circle City: 10 varied circle questions
const CIRCLE_QUESTIONS = [
  "What shape is this?",
  "Which shape is shown here?",
  "This is a...",
  "What's the name of this shape?",
  "Identify the shape!",
  "Tell me what this shape is!",
  "What shape do you see?",
  "Name this shape!",
  "Can you identify this shape?",
  "What's this shape called?"
];
for (let i = 30; i < 40; i++) {
  QUESTION_BANK.push(
    createQuestion(
      i,
      'identify',
      CIRCLE_QUESTIONS[i - 30],
      ['Square', 'Rectangle', 'Triangle', 'Circle'],
      3,
      'circle',
      null
    )
  );
}

// World 4 - Shape Sorting Yard: mixed identification
for (let i = 40; i < 50; i++) {
  const targetIdx = (i - 40) % 4;
  QUESTION_BANK.push(
    createQuestion(
      i,
      'identify',
      "Pick the correct shape!",
      ['Square', 'Rectangle', 'Triangle', 'Circle'],
      targetIdx,
      SHAPES[targetIdx],
      null
    )
  );
}

// World5 - Corner counting
for (let i = 50; i < 60; i++) {
  const targetIdx = (i - 50) % 4;
  const shape = SHAPES[targetIdx];
  const corners = shape === 'square' ? 4 : shape === 'rectangle' ? 4 : shape === 'triangle' ? 3 : 0;
  const options = ['0', '3', '4', '5'];
  const correctIndex = options.indexOf(String(corners));
  QUESTION_BANK.push(
    createQuestion(
      i,
      'count-corners',
      `How many corners does this shape have?`,
      options,
      correctIndex,
      shape,
      null
    )
  );
}

// World6 - Side counting
for (let i = 60; i < 70; i++) {
  const targetIdx = (i - 60) % 4;
  const shape = SHAPES[targetIdx];
  const sides = shape === 'square' ? 4 : shape === 'rectangle' ? 4 : shape === 'triangle' ? 3 : 0;
  const options = ['0', '3', '4', '5'];
  const correctIndex = options.indexOf(String(sides));
  QUESTION_BANK.push(
    createQuestion(
      i,
      'count-sides',
      `How many sides does this shape have?`,
      options,
      correctIndex,
      shape,
      null
    )
  );
}

// World7 - Square vs Rectangle
for (let i = 70; i < 80; i++) {
  const isSquare = (i - 70) % 2 === 0;
  QUESTION_BANK.push(
    createQuestion(
      i,
      'square-vs-rect',
      isSquare ? "Is this a square?" : "Is this a rectangle?",
      ['Yes', 'No', 'Maybe', 'Not sure'],
      0,
      isSquare ? 'square' : 'rectangle',
      null
    )
  );
}

// World8 - Real-world objects
const REAL_WORLD_QS = [
  { q: "A pizza is shaped like a...", a: 3, shape: 'circle' },
  { q: "A book cover is usually a...", a: 1, shape: 'rectangle' },
  { q: "A slice of pizza is like a...", a: 2, shape: 'triangle' },
  { q: "A chess board square is a...", a: 0, shape: 'square' },
  { q: "A clock face is a...", a: 3, shape: 'circle' },
  { q: "A door is usually a...", a: 1, shape: 'rectangle' },
  { q: "A yield sign is a...", a: 2, shape: 'triangle' },
  { q: "A Post-it note is often a...", a: 0, shape: 'square' },
  { q: "A wheel is a...", a: 3, shape: 'circle' },
  { q: "A TV screen is a...", a: 1, shape: 'rectangle' },
];
for (let i = 0; i < 10; i++) {
  const q = REAL_WORLD_QS[i];
  QUESTION_BANK.push(
    createQuestion(
      80 + i,
      'real-world',
      q.q,
      ['Square', 'Rectangle', 'Triangle', 'Circle'],
      q.a,
      null,
      null
    )
  );
}

// World9 - Mystery palace (mixed, attribute-based)
const ATTRIBUTE_QS = [
  { q: "I have 3 sides and 3 corners. What am I?", a: 2 },
  { q: "I have 0 sides and 0 corners. What am I?", a: 3 },
  { q: "I have 4 equal sides and 4 corners. What am I?", a: 0 },
  { q: "I have 4 sides, opposite equal. What am I?", a: 1 },
  { q: "Which shape has no straight sides?", a: 3 },
  { q: "Which shape has 3 corners?", a: 2 },
  { q: "Which shape is perfectly round?", a: 3 },
  { q: "Which shape has 4 equal sides?", a: 0 },
  { q: "Which shape has 3 straight sides?", a: 2 },
  { q: "Square, Circle, Square, Circle, ___", a: 0 }
];
for (let i = 0; i < 10; i++) {
  const q = ATTRIBUTE_QS[i];
  QUESTION_BANK.push(
    createQuestion(
      90 + i,
      'attribute',
      q.q,
      ['Square', 'Rectangle', 'Triangle', 'Circle'],
      q.a,
      null,
      null
    )
  );
}

// Shuffle options for each question
QUESTION_BANK.forEach(q => {
  if (q.options) {
    const correctOption = q.options[q.correctIndex];
    const shuffled = [...q.options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    q.options = shuffled;
    q.correctIndex = shuffled.indexOf(correctOption);
  }
});
