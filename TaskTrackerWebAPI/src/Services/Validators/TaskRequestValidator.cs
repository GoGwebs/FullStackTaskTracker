using System;
using FluentValidation;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Features.Tasks.TaskDtos;
using TaskTrackerWebAPI.src.Services.Dtos;


namespace TaskTrackerWebAPI.src.Services.Validators;

public class TaskRequestValidator : AbstractValidator<TaskRequest>
{
    public TaskRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .NotNull().WithMessage("Title cannot be null.");

        RuleFor(x => x.Status)
            .NotNull().WithMessage("Status is required.")
            .Must(s => AllowedValues.Statuses.Contains(s))
            .WithMessage("Invalid status value.");

        RuleFor(x => x.Priority)
            .NotNull().WithMessage("Priority is required.")
            .Must(p => AllowedValues.Priorities.Contains(p))
            .WithMessage("Invalid priority value.");

        When(x => x.DueDate is not null, () => {
            RuleFor(x => x.DueDate)
                .Must(d => DateTime.TryParse(d, null,
                    System.Globalization.DateTimeStyles.RoundtripKind, out _))
                .WithMessage("'dueDate' must be a valid ISO-8601 date (e.g. 2025-12-31T00:00:00Z).");
        });
    }

}
