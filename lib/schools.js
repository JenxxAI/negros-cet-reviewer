// Single source of truth for school metadata.
// page.js uses SCHOOL_LIST for the homepage display grid.
// exam/page.js imports SCHOOL_META to spread name/full/exam/color into SCHOOL_CONFIG.

export const SCHOOL_META = {
  sunn: {
    name: 'SUNN',
    full: 'State University of Northern Negros',
    exam: 'General Aptitude Test',
    color: '#3fb950',
    displaySubjects: ['Logic', 'Math', 'Gen. Knowledge'],
  },
  tup: {
    name: 'TUP',
    full: 'Technological University of the Philippines',
    exam: 'TUPSTAT',
    color: '#58a6ff',
    displaySubjects: ['Math', 'English', 'Science', 'Technical'],
  },
  chmsu: {
    name: 'CHMSU',
    full: 'Carlos Hilado Memorial State University',
    exam: 'CHMSUET',
    color: '#c9a84c',
    displaySubjects: ['Math', 'English', 'Science'],
  },
  pnu: {
    name: 'PNU',
    full: 'Philippine Normal University',
    exam: 'PNUAT',
    color: '#bc8cff',
    displaySubjects: ['Math', 'English', 'Gen. Info'],
  },
  lasalle: {
    name: 'La Salle',
    full: 'La Salle College',
    exam: 'Entrance Exam',
    color: '#f85149',
    displaySubjects: ['Math', 'English', 'Science', 'Logic'],
  },
  csa: {
    name: 'CSA',
    full: 'Colegio San Agustin',
    exam: 'Entrance Exam',
    color: '#ff9500',
    displaySubjects: ['Math', 'English', 'Science'],
  },
}

// Flat array for homepage school grid — shape: { name, full, exam, color, subjects }
export const SCHOOL_LIST = Object.entries(SCHOOL_META).map(([, s]) => ({
  name: s.name,
  full: s.full,
  exam: s.exam,
  color: s.color,
  subjects: s.displaySubjects,
}))
