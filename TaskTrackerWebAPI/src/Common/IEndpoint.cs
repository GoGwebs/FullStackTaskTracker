using System;

namespace TaskTrackerWebAPI.src.Common;

public interface IEndpoint
{
    static abstract void MapEndpoints(IEndpointRouteBuilder app);
}
