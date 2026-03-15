using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TaskTrackerWebAPI.src.Infrastructure.InMemory;

namespace TaskTracker.IntergrationTests.Fixtures;

public class TaskTrackerApiFactory : WebApplicationFactory<Program>
{

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove the app's real InMemoryDbContext registration
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<InMemoryDbContext>));

            if (descriptor is not null)
                services.Remove(descriptor);

            // Add a fresh InMemory database with a unique name per factory instance
            // so tests don't share state
            var dbName = $"TestDb-{Guid.NewGuid()}";
            services.AddDbContext<InMemoryDbContext>(options =>
                options.UseInMemoryDatabase(dbName));
        });

        builder.UseEnvironment("Development");
    }

}
