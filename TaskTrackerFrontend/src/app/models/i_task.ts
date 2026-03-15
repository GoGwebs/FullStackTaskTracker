export interface ITask {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
  createdAt: Date;
}

export type CreateTaskPayload = Omit<ITask, 'id' | 'createdAt'>;
export type UpdateTaskPayload = Partial<CreateTaskPayload> & { id: number };

export const TASKS: ITask[] = [];