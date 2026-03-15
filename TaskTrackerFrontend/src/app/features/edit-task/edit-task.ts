import { Component, DestroyRef, inject, signal } from '@angular/core';
import { IFormTask } from '../../models/task';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskForm } from '../../core/components/task-form/task-form';
import { TaskService } from '../../services/task/task-service';
import { mapTo } from 'rxjs';
import { mapToFormTask } from '../../mappers/task_mapper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ITask } from '../../models/i_task';
import { CreateTaskDTO } from '../../models/task_dto';

@Component({
  selector: 'app-edit-task',
  imports: [TaskForm],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.scss',
})
export class EditTask {
  taskService = inject(TaskService);
  private destroyRef  = inject(DestroyRef);
  route = inject(ActivatedRoute);
  router = inject(Router);

  task = signal<ITask | null>(null);
  private taskId!: number;

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id') );
    this.taskService
      .getTaskById(this.taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(task => {
      console.log('Task in edit component:', task);
    });
  }

  onUpdate(payload: CreateTaskDTO) {
    this.taskService
      .updateTask(this.taskId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          console.log('Update successful — navigating...');
          this.router.navigate(['/'])
      },
        error: (err) => { 
          console.error('Update failed:', err);
         }
      });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

}
