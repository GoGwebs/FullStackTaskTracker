import { Injectable } from '@angular/core';
import { CreateTaskDTO, TaskDTO } from '../../models/task_dto';
import { CreateTaskPayload, ITask } from '../../models/i_task';

@Injectable({
  providedIn: 'root',
})
export class TaskMapper {

  fromDTO(dto: TaskDTO): ITask {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: new Date(dto.dueDate),
      createdAt: new Date(dto.createdAt),
    };
  }

  toCreateTaskDTO(payload: CreateTaskPayload): CreateTaskDTO {
    return {
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      dueDate: payload.dueDate.toISOString(),
    }
  }
}
