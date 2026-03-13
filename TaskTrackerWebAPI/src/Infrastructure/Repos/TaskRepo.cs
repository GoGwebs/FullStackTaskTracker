using System;
using Microsoft.EntityFrameworkCore;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Features.Tasks.TaskDtos;
using TaskTrackerWebAPI.src.Features.Tasks.TaskMapper;
using TaskTrackerWebAPI.src.Infrastructure.InMemory;
using TaskTrackerWebAPI.src.Services.Dtos;

namespace TaskTrackerWebAPI.src.Infrastructure.Repos;

public class TaskRepo : ITaskRepo
{
    private readonly InMemoryDbContext _context;

    public TaskRepo(InMemoryDbContext context) => _context = context;

    public async Task<TaskResponse> Create(TaskRequest task)
    {
        var taskEntity = _context.Tasks.Add(task.ToEntityTask());
        await _context.SaveChangesAsync();
        return taskEntity.Entity.ToTaskResponse();
    }

    public async Task<bool> Delete(int id)
    {
        var task = await _context.Tasks.FindAsync(id);

        if (task is null) return false;

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<TaskResponse>> GetAll(TaskQuery query)
    {
        IQueryable<EntityTask> tasks = _context.Tasks.AsQueryable();

        if (!string.IsNullOrEmpty(query.Q))
        {
            tasks = tasks.Where(t => 
            t.Title != null &&
            t.Title.Contains(query.Q, StringComparison.OrdinalIgnoreCase));
        }

        tasks = query.IsAscending
            ? tasks.OrderBy(t => t.DueDate)
            : tasks.OrderByDescending(t => t.DueDate);

        return await tasks.Select(t => t.ToTaskResponse()).ToListAsync();
    }

    public async Task<TaskResponse?> GetById(int id)
    {
        return await _context.Tasks
            .Where(t => t.Id == id)
            .Select(t => t.ToTaskResponse())
            .FirstOrDefaultAsync();
    }

    public async Task<TaskResponse?> Update(int id, TaskRequest task)
    {
        var taskToUpdate = await _context.Tasks.FindAsync(id);
        if (taskToUpdate is null) return null;

        var taskWithNewValues = task.ToEntityTask(id);

        taskToUpdate.Title = taskWithNewValues.Title ?? taskToUpdate.Title;
        taskToUpdate.Description = taskWithNewValues.Description ?? taskToUpdate.Description;
        taskToUpdate.Status = taskWithNewValues.Status ?? taskToUpdate.Status;
        taskToUpdate.Priority = taskWithNewValues.Priority ?? taskToUpdate.Priority;
        taskToUpdate.DueDate = taskWithNewValues.DueDate ?? taskToUpdate.DueDate;

        var taskEntity = _context.Tasks.Update(taskToUpdate);
        await _context.SaveChangesAsync();
        return taskEntity.Entity.ToTaskResponse();
    }
}
