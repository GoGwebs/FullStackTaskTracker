import { describe, it, expect, beforeEach } from 'vitest';
import { sortTasksByDate} from './task-sort.utils';
import { ITask } from '../models/i_task';

describe('sortTasksByDate', () => {
  let tasks: ITask[];

  beforeEach(() => {
    tasks = [
      { 
        id: 1, 
        title: 'Buy groceries',
        status: "InProgress",
        priority: "Medium",
        description: "Milk, Bread, Eggs",
        dueDate: new Date('2024-01-10'),
        createdAt: new Date('2024-01-03') 
      },
      { 
        id: 2, 
        title: 'Fix critical bug', 
        status: "InProgress",
        priority: "High",
        description: "App crashes on login",
        dueDate: new Date('2024-01-05'),
        createdAt: new Date('2024-01-01') 
      },
      { 
        id: 3, 
        title: 'Write docs',       
        status: "InProgress",
        priority: "Low",
        description: "API documentation",
        dueDate: new Date('2024-01-07'),
        createdAt: new Date('2024-01-02') 
      },
    ];
  });

  it('should sort oldest first when direction is asc', () => {
    const result = sortTasksByDate(tasks, 'asc');
    expect(result.map(t => t.id)).toEqual([2, 3, 1]);
  });

  it('should sort newest first when direction is desc', () => {
    const result = sortTasksByDate(tasks, 'desc');
    expect(result.map(t => t.id)).toEqual([1, 3, 2]);
  });

  it('should default to ascending when no direction is provided', () => {
    const result = sortTasksByDate(tasks);
    expect(result.map(t => t.id)).toEqual([2, 3, 1]);
  });

  it('should return an empty array when given an empty array', () => {
    expect(sortTasksByDate([])).toEqual([]);
  });

  it('should not mutate the original array', () => {
    const original = [...tasks];
    sortTasksByDate(tasks, 'asc');
    expect(tasks).toEqual(original);
  });
});