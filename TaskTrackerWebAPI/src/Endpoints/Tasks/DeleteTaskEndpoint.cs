using System;
using TaskTrackerWebAPI.src.Common;
using TaskTrackerWebAPI.src.Data;

namespace TaskTrackerWebAPI.src.Endpoints.Tasks;

public class DeleteTaskEndpoint : IEndpoint
{
    public static void MapEndpoints(IEndpointRouteBuilder app)
    {
        app.MapDelete("/{id}", Handler)
            .WithName("DeleteTask")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
    }   

    public static async Task<IResult> Handler(int id, ITaskRepo context)
    {
        var deleted = await context.Delete(id);
        if (!deleted) return Results.NotFound();
        return Results.NoContent();
    }

}
