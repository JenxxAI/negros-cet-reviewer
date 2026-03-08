// Pure utility functions shared across exam components and unit tests.

/**
 * Fisher-Yates shuffle — returns a new shuffled array, does not mutate input.
 */
export function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Count correct answers given a questions array and an answers map.
 * @param {Array<{answer: number}>} questions
 * @param {Object<number, number>} answers - index → selected choice index
 */
export function calculateScore(questions, answers) {
  return questions.filter((q, i) => answers[i] === q.answer).length
}
