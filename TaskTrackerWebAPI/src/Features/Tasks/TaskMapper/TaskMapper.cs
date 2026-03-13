using System;
using System.Globalization;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Features.Tasks.TaskDtos;
using TaskTrackerWebAPI.src.Services.Dtos;

namespace TaskTrackerWebAPI.src.Features.Tasks.TaskMapper;

public static class TaskMapper
{
    public static TaskResponse ToTaskResponse(this EntityTask task)
    {
        return new TaskResponse
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

    public static EntityTask ToEntityTask(this TaskRequest task)
    {
        return new EntityTask
        {
            Title = task.Title,
            Description = task.Description,
            Status = Enum.TryParse(task.Status, out EStatus status) ? status : null,
            Priority = Enum.TryParse(task.Priority, out EPriority priority) ? priority : null,
            DueDate = DateTimeOffset.TryParse(
                    task.DueDate,
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.RoundtripKind,
                    out var parsedDate)
                ? parsedDate.ToUniversalTime()
                : null,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    public static EntityTask ToEntityTask(this TaskRequest task, int id)
    {
        return new EntityTask
        {
            Id = id,
            Title = task.Title,
            Description = task.Description,
            Status = Enum.TryParse(task.Status, out EStatus status) ? status : null,
            Priority = Enum.TryParse(task.Priority, out EPriority priority) ? priority : null,
            DueDate = DateTimeOffset.TryParse(
                    task.DueDate,
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.RoundtripKind,
                    out var parsedDate)
                ? parsedDate.ToUniversalTime()
                : null,
            CreatedAt = null
        };
    }

}
