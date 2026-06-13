using CvSite.Api.Hubs;
using CvSite.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// CORS: allow the SSR/dev frontend origins to open the SignalR connection.
// Override with the CORS_ORIGINS env var (comma-separated) in production.
var origins = (builder.Configuration["CORS_ORIGINS"]
        ?? "http://localhost:4000,http://localhost:4200,http://localhost:5080")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod().AllowCredentials());
});

builder.Services.AddSignalR();
builder.Services.AddSingleton<CvContextService>();
builder.Services.AddSingleton<RateLimiter>();
builder.Services.AddHttpClient<OpenAiChatService>(c =>
{
    c.Timeout = TimeSpan.FromSeconds(60);
});

var app = builder.Build();

app.UseCors();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", service = "CvSite.Api" }));

app.MapHub<ChatHub>("/hubs/chat");

app.Run();
