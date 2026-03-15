import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ITask } from '../../../models/i_task';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
}

@Component({
  selector: 'app-task-card',
  imports: [FormsModule, DatePipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {
  task = input.required<ITask>();
  statusChanged = output<{ id: number; status: string }>();
  taskDeleted = output<number>();

  statuses = ['New', 'InProgress', 'Done'];

  constructor(private router: Router) {}

  onStatusChange(newStatus: string): void {
    this.statusChanged.emit({ id: this.task().id, status: newStatus });
  }

  get priorityClass(): string {
    switch (this.task().priority) {
      case 'High': return 'text-bg-danger';
      case 'Medium': return 'text-bg-warning';
      case 'Low': return 'text-bg-success';
      default: return 'text-bg-secondary';
    }
  }

  onRemoveTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskDeleted.emit(this.task().id);
    }
  }

  goToEdit(){
    this.router.navigate([`/tasks/${this.task().id}/edit`]);
  }
}
