import { ClinicalNote } from '../pages/ClinicalNotesPage';

function randomName(idx: number) {
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Hank'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Moore'];
  return `${firstNames[idx % firstNames.length]} ${lastNames[idx % lastNames.length]}`;
}

function randomNote(idx: number) {
  const notes = [
    'Patient reported mild headache and fatigue.',
    'Follow-up visit for hypertension management.',
    'Discussed lab results and next steps.',
    'Routine check-up, no issues found.',
    'Prescribed medication for seasonal allergies.',
    'Patient requested information about diet.',
    'Scheduled next appointment.',
    'Blood pressure within normal range.',
    'Patient recovering well post-surgery.',
    'Recommended physical therapy.'
  ];
  return notes[idx % notes.length];
}

export const mockNotes: ClinicalNote[] = Array.from({ length: 5000 }, (_, idx) => {
  const date = new Date(2025, 8, 1 + (idx % 30), 8 + (idx % 12), (idx * 7) % 60);
  return {
    id: (idx + 1).toString(),
    patientName: randomName(idx),
    noteText: randomNote(idx),
    createdAt: date.toISOString(),
  };
});
