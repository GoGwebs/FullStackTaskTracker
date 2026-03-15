import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormTask } from '../../models/task';
import { TaskForm } from '../../core/components/task-form/task-form';
import { TaskService } from '../../services/task/task-service';
import { mapToFormTask } from '../../mappers/task_mapper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateTaskPayload, ITask } from '../../models/i_task';
import { CreateTaskDTO } from '../../models/task_dto';

@Component({
  selector: 'app-create-task',
  imports: [TaskForm],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss',
})
export class CreateTask {
  taskService = inject(TaskService);
  destroyRef = inject(DestroyRef);  
  router = inject(Router);


  onCreate(task: CreateTaskDTO): void {
    console.log('Task created:', task);
    this.taskService
      .createTask(task)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => { /* error already set on service signal */ }
      });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
