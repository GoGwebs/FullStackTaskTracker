import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ITask, TASKS } from '../../../models/i_task';
import { Task, TaskCard } from '../task-card/task-card';
import { SearchField } from '../search-field/search-field';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task/task-service';
import { TaskQueryParams } from '../../../models/task_state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-task-card-grid',
  imports: [TaskCard, ReactiveFormsModule],
  templateUrl: './task-card-grid.html',
  styleUrl: './task-card-grid.scss',
})
export class TaskCardGrid {
  taskService = inject(TaskService);
  private destroyRef = inject(DestroyRef)
  router = inject(Router);

  searchControl = new FormControl('');
  sortOrder     = signal<'dueDate:asc' | 'dueDate:desc'>('dueDate:asc');

  sortLabel = computed(() => this.sortOrder() === 'dueDate:asc' ? 'Ascending' : 'Descending');

  ngOnInit() {
    this.loadTasks();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),          // wait 400ms after user stops typing
      distinctUntilChanged(),     // only fire if value actually changed
      switchMap(search =>         // cancel previous request if a new one comes in
        this.taskService.getAllTask(this.buildQuery())
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(tasks => {
      console.log('Tasks loaded:', tasks);
    });
  }

  onSearch(search: string): void {
    this.loadTasks({ search });
    console.log('Search term:', search);
  }

  goToCreate() {
    this.router.navigate(['/tasks/new']);
  }

  private loadTasks(params: TaskQueryParams = {}) {
    this.taskService
      .getAllTask(this.buildQuery())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  onSortToggle(): void {
    // Flip the sort order
    this.sortOrder.update(current => current === 'dueDate:asc' ? 'dueDate:desc' : 'dueDate:asc');
    // Immediately trigger a new request
    this.loadTasks();
  }

  private buildQuery(): TaskQueryParams {
    return {
      search:    this.searchControl.value ?? '',
      sortOrder: this.sortOrder(),
    };
  }

  onTaskDeleted(taskId: number): void {
  // Remove the task from the list or call the service to delete it
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.loadTasks();
    });
  }

}
