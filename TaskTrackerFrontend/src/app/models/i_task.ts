export interface ITask {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
}

export const TASKS: ITask[] = [
  {
    id: 1,
    title: 'Complete project documentation',
    description: 'Write and review the documentation for the project.',
    status: 'InProgress',
    priority: 'High',
    dueDate: '2026-06-19T08:30:00',
    createdAt: '2024-06-01',
  },
  {
    id: 2,
    title: 'Fix login bug',
    description: 'Resolve the issue preventing users from logging in.',
    status: 'New',
    priority: 'Medium',
    dueDate: '2026-06-15T05:30:00',
    createdAt: '2024-06-02',
  },
  {
    id: 3,
    title: 'Update UI theme',
    description: 'Apply new color scheme and update UI components.',
    status: 'Done',
    priority: 'Low',
    dueDate: '2026-01-15T18:30:00',
    createdAt: '2024-06-03',
  },
  {
    id: 4,
    title: 'Prepare release notes',
    description: 'Draft and finalize release notes for the upcoming version.',
    status: 'New',
    priority: 'High',
    dueDate: '2026-06-15T14:30:00',
    createdAt: '2024-06-04',
  },
  {
    id: 5,
    title: 'Code review',
    description: 'Review code submissions from team members.',
    status: 'InProgress',
    priority: 'Medium',
    dueDate: '2026-07-15T17:00:00',
    createdAt: '2024-06-05',
  },
];