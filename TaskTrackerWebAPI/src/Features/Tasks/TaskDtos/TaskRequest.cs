using System;

namespace TaskTrackerWebAPI.src.Features.Tasks.TaskDtos;

public class TaskRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? DueDate { get; set; }
}
