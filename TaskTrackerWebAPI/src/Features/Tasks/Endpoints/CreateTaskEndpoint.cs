using System;
using TaskTrackerWebAPI.src.Common;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Features.Tasks.TaskDtos;
using TaskTrackerWebAPI.src.Services.Dtos;
using TaskTrackerWebAPI.src.Services.Filters;
using TaskTrackerWebAPI.src.Services.Validators;

namespace TaskTrackerWebAPI.src.Features.Tasks.Endpoints;

public class CreateTaskEndpoint : IEndpoint
{
    public static void MapEndpoints(IEndpointRouteBuilder app)
    {
        app.MapPost("/", Handler)
            .AddEndpointFilter<ValidationFilter<TaskRequest>>()
            .WithName("CreateTask")
            .Produces<TaskResponse>(StatusCodes.Status201Created);
    }

    public static async Task<IResult> Handler(TaskRequest task, ITaskRepo context)
    {
        var createdTask = await context.Create(task);
        return Results.CreatedAtRoute("GetTaskById", new { id = createdTask.Id }, createdTask);
    }
    
}
