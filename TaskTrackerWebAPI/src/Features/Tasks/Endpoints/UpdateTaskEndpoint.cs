using System;
using TaskTrackerWebAPI.src.Common;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Features.Tasks.TaskDtos;
using TaskTrackerWebAPI.src.Services.Dtos;
using TaskTrackerWebAPI.src.Services.Filters;

namespace TaskTrackerWebAPI.src.Features.Tasks.Endpoints;

public class UpdateTaskEndpoint: IEndpoint
{
    public static void MapEndpoints(IEndpointRouteBuilder app)
    {
        app.MapPut("/{id}", Handler)
            .AddEndpointFilter<ValidationFilter<TaskRequest>>()
            .WithName("UpdateTask")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
    }   

    public static async Task<IResult> Handler(int id, TaskRequest task, ITaskRepo context)
    {
        var updated = await context.Update(id, task);
        if (updated is null) return Results.NotFound();
        return Results.NoContent();
    }

}