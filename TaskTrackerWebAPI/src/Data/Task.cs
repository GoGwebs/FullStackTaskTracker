namespace TaskTrackerWebAPI.src.Data;

public class Task
{
    public int? Id { get; set; }
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public EStatus? Status { get; set; }
    public EPriority? Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
}

public static class AllowedValues
{
    public static readonly string[] Statuses = ["New", "InProgress", "Done"];
    public static readonly string[] Priorities = ["Low", "Medium", "High"];
}
