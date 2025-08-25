// This file represents the backend part of the application and is organized within a 'backend' folder.
// For example, if you were creating a full project, you might have:
// project_root/
// ├── backend/
// │   ├── Controllers/
// │   ├── Data/
// │   ├── Migrations/
// │   ├── Properties/
// │   ├── Repositories/
// │   ├── Services/
// │   ├── appsettings.json
// │   ├── backend.csproj
// │   └── Program.cs
// ├── frontend/
// │   └── ...
// └── .gitignore
// └── README.md

// The following code simulates a backend file that would reside within the 'backend' folder.

using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using MemberManagementAPI.Data;
using MemberManagementAPI.Repositories;
using MemberManagementAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IMemberRepository, MemberRepository>();
builder.Services.AddScoped<IMemberService, MemberService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:4200", "https://localhost:4200")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();