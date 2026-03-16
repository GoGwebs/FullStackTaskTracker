import { inject, Injectable, signal } from '@angular/core';
import { CreateTaskPayload, ITask, TASKS, UpdateTaskPayload } from '../../models/i_task';
import { IFormTask } from '../../models/task';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { mapToITask } from '../../mappers/task_mapper';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { TaskMapper } from '../task_mapper/task-mapper';
import { TaskQueryParams } from '../../models/task_state';
import { CreateTaskDTO, TaskDTO } from '../../models/task_dto';
import { environment } from '../../../environments/environment';
import { ApiValidationError } from '../../models/api.error.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private mapper = inject(TaskMapper);

  private _tasks = signal<ITask[]>([]);
  private _task = signal<ITask | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private apiUrl  = `${environment.apiUrl}/api/tasks`;

  tasks = this._tasks.asReadonly();
  task = this._task.asReadonly();

  loading = this._loading.asReadonly()
  error = this._error.asReadonly();

  getAllTask(params: TaskQueryParams): Observable<ITask[]> {
    this._loading.set(true);
    this._error.set(null);

    const httpParams = this.buildParams(params);

    return this.http.get<TaskDTO[]>(this.apiUrl, { params: httpParams })
      .pipe(
        map(dtos => {
          const tasks = dtos.map(dto => this.mapper.fromDTO(dto));
          this._tasks.set(tasks);
          return tasks;
        }), 
        catchError(err => this.handleError(err)), 
        finalize(() => this._loading.set(false))
      );   
  }

  getTaskById(id: number): Observable<ITask> {
    this._loading.set(true);
    this._error.set(null);
    
    return this.http.get<TaskDTO>(`${this.apiUrl}/${id}`)
      .pipe(
        map(dto => {
          const task = this.mapper.fromDTO(dto);
          this._task.set(task);
          return task;
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this._loading.set(false))
      );
  }


  createTask(payload: CreateTaskDTO): Observable<ITask> {
    this._loading.set(true);
    this._error.set(null);


    return this.http.post<TaskDTO>(this.apiUrl, payload)
      .pipe(
        map(createdDto => this.mapper.fromDTO(createdDto)),
        tap(createdTask => {
          console.log('Created task from API:', createdTask);
          this._tasks.update(tasks => [...tasks, createdTask]);
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this._loading.set(false))
      );
  }

  updateTask(id: number, payload: CreateTaskDTO): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.put<TaskDTO>(`${this.apiUrl}/${id}`, payload, { observe: 'response' })
      .pipe(
        map(updatedDto => void 0), 
        catchError(err => this.handleError(err)),
        finalize(() => this._loading.set(false))
      );
  }


  deleteTask(id: number): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this._tasks.update(tasks => tasks.filter(t => t.id !== id));
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this._loading.set(false))
      );
  }


  private buildParams(query: TaskQueryParams): HttpParams {
    let params = new HttpParams();
    if (query.page      != null) params = params.set('page',      query.page);
    if (query.pageSize  != null) params = params.set('page_size', query.pageSize);
    if (query.search)            params = params.set('q',    query.search);
    if (query.sortOrder)       params = params.set('sort', query.sortOrder);
    return params;
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    console.error('API error:', err.error);

    let message = 'An unexpected error occurred.';

    if (err.status === 0)   message = 'No internet connection.';
    if (err.status === 401) message = 'Unauthorised. Please log in again.';
    if (err.status === 403) message = 'You do not have permission to do this.';
    if (err.status === 404) message = 'Task not found.';
    if (err.status >= 500)  message = 'Server error. Please try again later.';

    if (err.status === 400) {
      // Pass the full error body so the component can apply field errors
      return throwError(() => err.error as ApiValidationError);
    }

    this._error.set(message);
    return throwError(() => new Error(message));
  }



  // private handleError(err: HttpErrorResponse) {
  //   let message : string;

  //   switch (true) {
  //     case err.status === 0:
  //       message = 'Network error: Please check your connection';
  //       break;
  //     case err.status === 400:
  //       message = 'Bad request: Please check the data you sent';
  //       break;
  //     case err.status === 401:
  //       message = 'Unauthorized: Please log in to access this resource';
  //       break;
  //     case err.status === 403:
  //       message = 'Forbidden: You do not have permission to access this resource';
  //       break;
  //     case err.status === 404:
  //       message = 'Resource not found';
  //       break;
  //     case err.status === 500:
  //       message = 'Internal server error';
  //       break;
  //     default:
  //       message = 'An unknown error occurred';
  //   }

  //   this._error.set(message);
  //   return throwError(() => new Error(message));
  // }
  
}
