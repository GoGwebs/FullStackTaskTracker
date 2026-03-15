using System;
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Http;
using TaskTracker.IntergrationTests.Fixtures;
using TaskTrackerWebAPI.src.Features.Tasks.TaskDtos;

namespace TaskTracker.IntergrationTests.EndpointTests;

public class TaskEndpointTests : IClassFixture<TaskTrackerApiFactory>
{

    private readonly HttpClient _client;

    public TaskEndpointTests(TaskTrackerApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetTasks_ReturnsSuccessStatusCode()
    {

        // Act
        var response = await _client.GetAsync("/api/tasks");

        // Assert
        response.EnsureSuccessStatusCode();
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskResponse>>();
        Assert.NotNull(tasks);
        Assert.Equal(3, tasks.Count);
        Assert.Contains(tasks, t => t.Title == "Task 1");
        Assert.Contains(tasks, t => t.Title == "Task 2");
        Assert.Contains(tasks, t => t.Title == "Task 3");
    }


    [Fact]
    public async Task GetTaskById_ReturnsCorrectTask()
    {
        // Arrange - missing required fields will cause validation to fail and return 400 before hitting the endpoint logic
        var invalidTask = new TaskRequest
        {
            Title = "New Task",
            Description = "This task is missing required fields like DueDate and Status.",
            Status = "New", 
            Priority = "Tough",
            DueDate = DateTime.UtcNow.AddDays(7).ToString()
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/tasks", invalidTask);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        
        var problem = await response.Content.ReadFromJsonAsync<HttpValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.Equal(400, problem.Status);
        Assert.Equal("Validation Error", problem.Title);
        Assert.NotEmpty(problem.Errors);
    }

}