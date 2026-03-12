using System;
using TaskTrackerWebAPI.src.Services.Dtos;

namespace TaskTrackerWebAPI.src.Services.Validators;

public class TaskQueryValidator
{
    private static readonly string[] AllowedSortValues =  [ "dueDate:asc", "dueDate:desc" ];

    public static (bool IsValid, string? ErrorMessage) Validate(TaskQuery query)
    {
        if (query == null)
        {
            return (false, "Query cannot be null.");
        }

        if (!AllowedSortValues.Contains(query.Sort, StringComparer.OrdinalIgnoreCase))
        {
            return (false, $"Invalid sort value. Allowed values are: {string.Join(", ", AllowedSortValues)}.");
        }

        return (true, null);
    }

}
