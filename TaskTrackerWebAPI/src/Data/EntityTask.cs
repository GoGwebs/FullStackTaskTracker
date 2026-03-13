namespace TaskTrackerWebAPI.src.Data;

public class EntityTask
{
    public int? Id { get; set; }
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public EStatus? Status { get; set; }
    public EPriority? Priority { get; set; }
    public DateTimeOffset? DueDate { get; set; }
    public DateTimeOffset? CreatedAt { get; set; }
}

public static class AllowedValues
{
    public static readonly string[] Statuses = ["New", "InProgress", "Done"];
    public static readonly string[] Priorities = ["Low", "Medium", "High"];
}
