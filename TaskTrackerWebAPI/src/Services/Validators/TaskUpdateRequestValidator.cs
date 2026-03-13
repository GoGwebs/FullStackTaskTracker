// using System;
// using FluentValidation;
// using TaskTrackerWebAPI.src.Data;
// using TaskTrackerWebAPI.src.Features.Tasks.TaskDtos;

// namespace TaskTrackerWebAPI.src.Services.Validators;

// public class TaskUpdateRequestValidator : AbstractValidator<TaskUpdateRequest>
// {
//     public TaskUpdateRequestValidator()
//     {
//         RuleFor(x => x.Title)
//             .NotEmpty().WithMessage("'title' is required.")
//             .MaximumLength(100).WithMessage("'title' must not exceed 100 characters.");

//         RuleFor(x => x.Description)
//             .MaximumLength(500).WithMessage("'description' must not exceed 500 characters.");

//         RuleFor(x => x.Status)
//             .Must(s => string.IsNullOrEmpty(s) || Enum.TryParse(s, out EStatus _))
//             .WithMessage("'status' must be one of the following: NotStarted, InProgress, Completed.");

//         RuleFor(x => x.Priority)
//             .Must(p => string.IsNullOrEmpty(p) || Enum.TryParse(p, out EPriority _))
//             .WithMessage("'priority' must be one of the following: Low, Medium, High.");

//         RuleFor(x => x.DueDate)
//             .Must(d => string.IsNullOrEmpty(d) || DateTime.TryParse(d, null, System.Globalization.DateTimeStyles.RoundtripKind, out _))
//             .WithMessage("'dueDate' must be a valid ISO-8601 date (e.g. 2025-12-31T00:00:00Z).");
//     }
// }
