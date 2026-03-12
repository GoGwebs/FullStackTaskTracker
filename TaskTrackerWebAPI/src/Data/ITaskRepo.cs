using System;
using TaskTrackerWebAPI.src.Services.Dtos;

namespace TaskTrackerWebAPI.src.Data;

public interface ITaskRepo
{
    Task<List<TaskDto>> GetAll(TaskQuery query);
    Task<TaskDto?> GetById(int id);
    Task<TaskDto> Create(TaskDto task);
    Task<TaskDto?> Update(int id, TaskDto task);
    Task<bool> Delete(int id);
}
