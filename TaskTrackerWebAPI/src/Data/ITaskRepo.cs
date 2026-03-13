using System;
using TaskTrackerWebAPI.src.Features.Tasks.TaskDtos;
using TaskTrackerWebAPI.src.Services.Dtos;

namespace TaskTrackerWebAPI.src.Data;

public interface ITaskRepo
{
    Task<List<TaskResponse>> GetAll(TaskQuery query);
    Task<TaskResponse?> GetById(int id);
    Task<TaskResponse> Create(TaskRequest task);
    Task<TaskResponse?> Update(int id, TaskRequest task);
    Task<bool> Delete(int id);
}
