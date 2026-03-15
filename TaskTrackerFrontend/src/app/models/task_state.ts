import { ITask } from "./i_task";

export interface TasksState {
  tasks:   ITask[];
  total:   number;
  loading: boolean;
  error:   string | null;
}

export interface TaskQueryParams {
  page?:      number;
  pageSize?:  number;
  search?:    string;
  sortOrder?: 'dueDate:asc' | 'dueDate:desc';
}