namespace TaskTrackerWebAPI.src.Services.Dtos;

public record class TaskQuery
{

    public string? Q { get; init; }
    public string? Sort { get; init; } = "dueDate:asc";

    public bool IsAscending => Sort?.EndsWith(
        "dueDate:asc", StringComparison.OrdinalIgnoreCase) ?? true;

}
