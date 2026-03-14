import { Component } from '@angular/core';
import { TaskCardGrid } from '../../core/components/task-card-grid/task-card-grid';

@Component({
  selector: 'app-home',
  imports: [TaskCardGrid],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
}
