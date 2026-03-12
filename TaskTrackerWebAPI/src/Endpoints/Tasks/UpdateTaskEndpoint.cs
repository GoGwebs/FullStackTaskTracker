using System;
using TaskTrackerWebAPI.src.Common;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Services.Dtos;

namespace TaskTrackerWebAPI.src.Endpoints.Tasks;

public class UpdateTaskEndpoint: IEndpoint
{
    public static void MapEndpoints(IEndpointRouteBuilder app)
    {
        app.MapPut("/{id}", Handler)
            .WithName("UpdateTask")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
    }   

    public static async Task<IResult> Handler(int id, TaskDto task, ITaskRepo context)
    {
        var updated = await context.Update(id, task);
        if (updated is null) return Results.NotFound();
        return Results.NoContent();
    }

}