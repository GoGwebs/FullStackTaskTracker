import { ITask } from "../models/i_task";

export type SortDirection = 'asc' | 'desc';

export function sortTasksByDate(
  tasks: ITask[],
  direction: SortDirection = 'asc'
): ITask[] {
  return [...tasks].sort((a, b) => {
    const diff = a.createdAt.getTime() - b.createdAt.getTime();
    return direction === 'asc' ? diff : -diff;
  });
}