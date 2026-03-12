using System;
using Microsoft.EntityFrameworkCore;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Infrastructure.InMemory;
using TaskTrackerWebAPI.src.Services.Dtos;
using TaskTrackerWebAPI.src.Services.Mappers;

namespace TaskTrackerWebAPI.src.Infrastructure.Repos;

public class TaskRepo : ITaskRepo
{

    private readonly InMemoryDbContext _context;

    public TaskRepo(InMemoryDbContext context) => _context = context;

    public async Task<TaskDto> Create(TaskDto task)
    {
        var taskEntity = _context.Tasks.Add(task.ToTaskModel());
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

    public async Task<List<TaskDto>> GetAll(TaskQuery query)
    {
        var tasks = _context.Tasks.AsQueryable();
        if (!string.IsNullOrEmpty(query.Q))
        {
            tasks = tasks.Where(t => t.Title.Contains(query.Q, StringComparison.OrdinalIgnoreCase));
        }

        tasks = query.IsAscending
            ? tasks.OrderBy(t => t.DueDate)
            : tasks.OrderByDescending(t => t.DueDate);

        return await tasks.Select(t => t.ToTaskResponse()).ToListAsync();
    }

    public async Task<TaskDto?> GetById(int id)
    {
        return await _context.Tasks
            .Where(t => t.Id == id)
            .Select(t => t.ToTaskResponse())
            .FirstOrDefaultAsync();
    }

    public async Task<TaskDto?> Update(int id, TaskDto task)
    {
        var taskEntity = _context.Tasks.Update(task.ToTaskModel());
        await _context.SaveChangesAsync();
        return taskEntity.Entity.ToTaskResponse();
    }
}
