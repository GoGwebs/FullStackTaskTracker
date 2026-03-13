using System;
using TaskTrackerWebAPI.src.Common;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Infrastructure.InMemory;
using TaskTrackerWebAPI.src.Services.Dtos;

namespace TaskTrackerWebAPI.src.Features.Tasks.Endpoints;

public class GetAllTaskEndpoint: IEndpoint
{
    public static void MapEndpoints(IEndpointRouteBuilder app)
    {
        app.MapGet("/", Handler)
            .WithName("GetAllTasks")
            .Produces<List<TaskDto>>(StatusCodes.Status200OK);
    }   

    public static async Task<IResult> Handler([AsParameters] TaskQuery query, ITaskRepo context)
    {
        var tasks = await context.GetAll(query);
        return Results.Ok(tasks);
    }

}