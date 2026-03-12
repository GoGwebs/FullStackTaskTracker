using System;
using TaskTrackerWebAPI.src.Data;
using TaskModel = TaskTrackerWebAPI.src.Data.Task;

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
                DueDate = DateTime.Now.AddDays(7)
            },
            new ()
            {
                Id = 2,
                Title = "Task 2",
                Description = "Description for Task 2",
                Status = EStatus.InProgress,
                Priority = EPriority.High,
                DueDate = DateTime.Now.AddDays(3)
            },
            new ()
            {
                Id = 3,
                Title = "Task 3",
                Description = "Description for Task 3",
                Status = EStatus.Done,
                Priority = EPriority.Low,
                DueDate = DateTime.Now.AddDays(14)
            }
            
        );
        context.SaveChanges();
    }

}
