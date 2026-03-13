using System;
using Microsoft.EntityFrameworkCore;
using TaskTrackerWebAPI.src.Data;

namespace TaskTrackerWebAPI.src.Infrastructure.InMemory;

public class InMemoryDbContext : DbContext
{

    public DbSet<EntityTask> Tasks => Set<EntityTask>();
    public InMemoryDbContext(DbContextOptions<InMemoryDbContext> options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EntityTask>(entity =>
        {
            entity.HasKey(t => t.Id);

            entity.Property(t => t.Id)
                  .ValueGeneratedOnAdd();       // auto-increment

            entity.Property(t => t.Title)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.Property(t => t.Description)
                  .HasMaxLength(1000);

            entity.Property(t => t.Status)
                  .IsRequired()
                  .HasConversion<string>();     // store enum as string

            entity.Property(t => t.Priority)
                  .IsRequired()
                  .HasConversion<string>();     // store enum as string

            entity.Property(t => t.CreatedAt)
                  .IsRequired();
        });
    }
}
