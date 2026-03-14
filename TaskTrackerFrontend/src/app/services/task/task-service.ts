import { Injectable, signal } from '@angular/core';
import { ITask, TASKS } from '../../models/i_task';
import { IFormTask } from '../../models/task';
import { map } from 'rxjs';
import { mapToITask } from '../../mappers/task_mapper';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private _tasks = signal<ITask[]>([]);

  tasks = this._tasks.asReadonly();

  addTask(task: IFormTask): void {
    const newTask = mapToITask(task, this._tasks().length + 1);
    this._tasks.update(tasks => [...tasks, newTask]);
  }

  loadAllTasks(titleFilter: string | null, sortByDueDate: "asc" | "desc"): void {
    // Simulate loading tasks from an API
    let mockTasks: ITask[] = TASKS;
    if (titleFilter) {
      mockTasks = mockTasks.filter(task => task.title.toLowerCase().includes(titleFilter.toLowerCase()));
    }

    if (sortByDueDate === 'asc') {
      mockTasks = mockTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else {
      mockTasks = mockTasks.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    }

    this._tasks.set(mockTasks);
  }

  getTaskById(id: number): ITask | undefined {
    return this._tasks().find(task => task.id === id);
  }

  updateTask(updatedTask: ITask): void {
    this._tasks.update(tasks => tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  }

  deleteTask(id: number): void {
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));
  }
  
}
