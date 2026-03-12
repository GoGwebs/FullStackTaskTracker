using System;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace TaskTrackerWebAPI.src.Services.Filters;

public class ValidationFilter<T> : IEndpointFilter where T : class
{
    private readonly IValidator<T> _validator;

    public ValidationFilter(IValidator<T> validator) => _validator = validator;

    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context, 
        EndpointFilterDelegate next
    )
    {
        var args = context.Arguments.OfType<T>().FirstOrDefault();

        if (args is null)
        {
            return Results.Problem(
                new ProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc7807",
                    Title = "Validation Error",
                    Detail = "Request body is missing or invalid.",
                    Status = StatusCodes.Status400BadRequest
                }
            );
        }

        var validationResult = await _validator.ValidateAsync(args);

        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName.ToLowerInvariant())
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return Results.Problem(
                new HttpValidationProblemDetails(errors)
                {
                    Type = "https://tools.ietf.org/html/rfc7807",
                    Title = "Validation Error",
                    Detail = "One or more validation errors occurred.",
                    Status = StatusCodes.Status400BadRequest
                }
            );
        }

        return await next(context);
    }
}
