using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TaskTrackerWebAPI;
using TaskTrackerWebAPI.src.Data;
using TaskTrackerWebAPI.src.Infrastructure.InMemory;
using TaskTrackerWebAPI.src.Infrastructure.Repos;
using TaskTrackerWebAPI.src.Services.Middleware;
using TaskTrackerWebAPI.src.Services.Validators;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddValidatorsFromAssemblyContaining<TaskRequestValidator>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddHttpLogging(o => { });
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<InMemoryDbContext>(options =>
    options.UseInMemoryDatabase("TaskTrackerDb"));

builder.Services.AddScoped<ITaskRepo, TaskRepo>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseHttpLogging();
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<InMemoryDbContext>();
    InMemorySeeder.Seed(context);
}

app.MapEndpoints();

app.Run();


public partial class Program { }