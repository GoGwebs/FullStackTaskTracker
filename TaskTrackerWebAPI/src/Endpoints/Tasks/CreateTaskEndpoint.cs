using System;
using TaskTrackerWebAPI.src.Common;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Services.Dtos;

namespace TaskTrackerWebAPI.src.Endpoints.Tasks;

public class CreateTaskEndpoint : IEndpoint
{
    public static void MapEndpoints(IEndpointRouteBuilder app)
    {
        app.MapPost("/", Handler)
            .WithName("CreateTask")
            .Produces<TaskDto>(StatusCodes.Status201Created);
    }

    public static async Task<IResult> Handler(TaskDto task, ITaskRepo context)
    {
        var createdTask = await context.Create(task);
        return Results.CreatedAtRoute("GetTaskById", new { id = createdTask.Id }, createdTask);
    }
    
}
