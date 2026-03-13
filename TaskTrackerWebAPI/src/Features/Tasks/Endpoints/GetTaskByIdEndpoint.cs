using System;
using TaskTrackerWebAPI.src.Common;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Services.Dtos;

namespace TaskTrackerWebAPI.src.Features.Tasks.Endpoints;

public class GetTaskByIdEndpoint: IEndpoint
{
    public static void MapEndpoints(IEndpointRouteBuilder app)
    {
        app.MapGet("/{id}", Handler)
            .WithName("GetTaskById")
            .Produces<TaskDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }   

    public static async Task<IResult> Handler(int id, ITaskRepo context)
    {
        var task = await context.GetById(id);
        if (task is null) return Results.NotFound();
        return Results.Ok(task);
    }

}
