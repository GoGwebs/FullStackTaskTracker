import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { CreateTask } from './features/create-task/create-task';
import { EditTask } from './features/edit-task/edit-task';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'tasks/new', component: CreateTask},
    {path: 'tasks/:id/edit', component: EditTask}
];
