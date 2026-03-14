import { Component, inject, signal } from '@angular/core';
import { IFormTask } from '../../models/task';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskForm } from '../../core/components/task-form/task-form';
import { TaskService } from '../../services/task/task-service';
import { mapTo } from 'rxjs';
import { mapToFormTask } from '../../mappers/task_mapper';

@Component({
  selector: 'app-edit-task',
  imports: [TaskForm],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.scss',
})
export class EditTask {
  taskService = inject(TaskService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  task = signal<IFormTask | null>(null);
  private taskId!: number;

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id') );
    const task = this.taskService.getTaskById(this.taskId);
    if (task) {
      this.task.set(mapToFormTask(task));
    }
  }

  onUpdate(updatedTask: IFormTask): void {
    console.log('Updating task:', updatedTask);
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }

}
