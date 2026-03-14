import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormTask } from '../../models/task';
import { TaskForm } from '../../core/components/task-form/task-form';
import { TaskService } from '../../services/task/task-service';
import { mapToFormTask } from '../../mappers/task_mapper';

@Component({
  selector: 'app-create-task',
  imports: [TaskForm],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss',
})
export class CreateTask {
  taskService = inject(TaskService);
  router = inject(Router);


  onCreate(task: IFormTask): void {
    this.taskService.addTask(task);
    console.log('Task created:', task);
    this.router.navigate(['/']);
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
