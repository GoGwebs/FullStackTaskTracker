import { Component, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormTask } from '../../models/task';
import { TaskForm } from '../../core/components/task-form/task-form';
import { TaskService } from '../../services/task/task-service';
import { mapToFormTask } from '../../mappers/task_mapper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateTaskPayload, ITask } from '../../models/i_task';
import { CreateTaskDTO } from '../../models/task_dto';
import { applyApiErrors } from '../../utils/form-error.mapper';
import { ApiValidationError } from '../../models/api.error.model';

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

  @ViewChild(TaskForm) taskForm!: TaskForm;


  onCreate(task: CreateTaskDTO): void {
    console.log('Task created:', task);
    this.taskService
      .createTask(task)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: ApiValidationError) => {
          // Apply field-level errors directly onto the form
          applyApiErrors(this.taskForm.form, err);
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
