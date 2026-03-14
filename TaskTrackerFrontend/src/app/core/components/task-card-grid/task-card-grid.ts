import { Component, inject } from '@angular/core';
import { ITask, TASKS } from '../../../models/i_task';
import { TaskCard } from '../task-card/task-card';
import { SearchField } from '../search-field/search-field';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task/task-service';

@Component({
  selector: 'app-task-card-grid',
  imports: [TaskCard, SearchField,],
  templateUrl: './task-card-grid.html',
  styleUrl: './task-card-grid.scss',
})
export class TaskCardGrid {
  taskService = inject(TaskService);
  router = inject(Router);

  ngOnInit() {
    this.taskService.loadAllTasks(null, 'asc');
  }

  onSearch(searchTerm: string): void {
    console.log('Search term:', searchTerm);
  }

  goToCreate() {
    this.router.navigate(['/tasks/new']);
  }

}
