using System;
using TaskTrackerWebAPI.src.Common;
using TaskTrackerWebAPI.src.Endpoints.Tasks;

namespace TaskTrackerWebAPI;

public static class Endpoints
{
    public static void MapEndpoints(this WebApplication app)
    {
        var endpoints = app.MapGroup("/api")
            .WithTags("API");

        endpoints.MapTaskEndpoints();
    }


    private static void MapTaskEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("/tasks")
            .WithTags("Tasks");

        endpoint.MapPublicGroup()
            .MapEndpoint<GetAllTaskEndpoint>()
            .MapEndpoint<GetTaskByIdEndpoint>()
            .MapEndpoint<CreateTaskEndpoint>()
            .MapEndpoint<UpdateTaskEndpoint>()
            .MapEndpoint<DeleteTaskEndpoint>();

    }

    private static RouteGroupBuilder MapPublicGroup(this IEndpointRouteBuilder app, string prefix = "")
    {
        return app.MapGroup(prefix)
        .AllowAnonymous();
    }

    private static IEndpointRouteBuilder MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app) where TEndpoint : IEndpoint
    {
        TEndpoint.MapEndpoints(app);
        return app;
    }

}
