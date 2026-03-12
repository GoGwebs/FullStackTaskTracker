using System;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Services.Dtos;
using TaskModel = TaskTrackerWebAPI.src.Data.Task;

namespace TaskTrackerWebAPI.src.Services.Mappers;

public static class TaskMapper
{
    public static TaskDto ToTaskResponse(this TaskModel task)
    {
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status.ToString(),
            Priority = task.Priority.ToString(),
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt
        };
    }

    public static TaskModel ToTaskModel(this TaskDto task)
    {
        return new TaskModel
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = Enum.TryParse(task.Status, out EStatus status) ? status : null,
            Priority = Enum.TryParse(task.Priority, out EPriority priority) ? priority : null,
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt
        };
    }

}
