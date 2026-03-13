using System;

namespace TaskTrackerWebAPI.src.Features.Tasks.TaskDtos;

public class TaskResponse
{
    public int? Id { get; set; }
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? Status { get; set; } = string.Empty;
    public string? Priority { get; set; } = string.Empty;
    public DateTimeOffset? DueDate { get; set; }
    public DateTimeOffset? CreatedAt { get; set; }
}
