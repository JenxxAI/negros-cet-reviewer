import { describe, it, expect } from 'vitest'
import { shuffleArray, calculateScore } from '../lib/examHelpers.js'

describe('shuffleArray', () => {
  it('returns array of same length', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffleArray(arr)).toHaveLength(arr.length)
  })

  it('contains all original elements', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(arr)
    expect([...shuffled].sort((a, b) => a - b)).toEqual([...arr].sort((a, b) => a - b))
  })

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3]
    const original = [...arr]
    shuffleArray(arr)
    expect(arr).toEqual(original)
  })

  it('handles empty array', () => {
    expect(shuffleArray([])).toEqual([])
  })

  it('handles single-element array', () => {
    expect(shuffleArray([42])).toEqual([42])
  })
})

describe('calculateScore', () => {
  it('counts all correct answers', () => {
    const questions = [{ answer: 0 }, { answer: 1 }, { answer: 2 }]
    const answers = { 0: 0, 1: 1, 2: 2 }
    expect(calculateScore(questions, answers)).toBe(3)
  })

  it('counts mixed correct and incorrect answers', () => {
    const questions = [{ answer: 0 }, { answer: 1 }, { answer: 2 }]
    const answers = { 0: 0, 1: 1, 2: 3 } // last is wrong
    expect(calculateScore(questions, answers)).toBe(2)
  })

  it('returns 0 with no answers provided', () => {
    const questions = [{ answer: 0 }, { answer: 1 }]
    expect(calculateScore(questions, {})).toBe(0)
  })

  it('returns 0 with all wrong answers', () => {
    const questions = [{ answer: 0 }, { answer: 1 }]
    const answers = { 0: 3, 1: 3 }
    expect(calculateScore(questions, answers)).toBe(0)
  })

  it('handles empty questions array', () => {
    expect(calculateScore([], {})).toBe(0)
  })
})
