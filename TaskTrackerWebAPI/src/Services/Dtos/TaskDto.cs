using System;
using TaskTrackerWebAPI.src.Data;

namespace TaskTrackerWebAPI.src.Services.Dtos;

public record TaskDto
{

    public int? Id { get; set; }
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? Status { get; set; } = string.Empty;
    public string? Priority { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public DateTime? CreatedAt { get; set; }

}
