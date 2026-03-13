using System;
using TaskTrackerWebAPI.src.Data;

namespace TaskTrackerWebAPI.src.Infrastructure.InMemory;

public class InMemorySeeder
{

    public static void Seed(InMemoryDbContext context)
    {
        if (context.Tasks.Any()) return;

        context.Tasks.AddRange(
            new ()
            {
                Id = 1,
                Title = "Task 1",
                Description = "Description for Task 1",
                Status = EStatus.New,
                Priority = EPriority.Medium,
                DueDate = DateTimeOffset.UtcNow.AddDays(7),
                CreatedAt = DateTimeOffset.UtcNow
            },
            new ()
            {
                Id = 2,
                Title = "Task 2",
                Description = "Description for Task 2",
                Status = EStatus.InProgress,
                Priority = EPriority.High,
                DueDate = DateTimeOffset.UtcNow.AddDays(3),
                CreatedAt = DateTimeOffset.UtcNow
            },
            new ()
            {
                Id = 3,
                Title = "Task 3",
                Description = "Description for Task 3",
                Status = EStatus.Done,
                Priority = EPriority.Low,
                DueDate = DateTimeOffset.UtcNow.AddDays(14),
                CreatedAt = DateTimeOffset.UtcNow
            }
            
        );
        context.SaveChanges();
    }

}
