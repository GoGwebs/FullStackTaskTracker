import { ITask } from "../models/i_task";
import { IFormTask } from "../models/task";

export function mapToFormTask(task: ITask): IFormTask {
  return {
    title: task.title,
    description: task.description,
    dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString().split('T')[0] : task.dueDate,
    status: task.status,
    priority: task.priority,
  };
}

export function mapToITask(formTask: IFormTask, id: number): ITask {
    return {
        id: id,
        title: formTask.title,
        description: formTask.description,
        dueDate: new Date(formTask.dueDate),
        status: formTask.status,
        priority: formTask.priority,
        createdAt: new Date(),
    };
}