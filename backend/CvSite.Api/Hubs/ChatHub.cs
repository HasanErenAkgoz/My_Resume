using System.Runtime.CompilerServices;
using CvSite.Api.Models;
using CvSite.Api.Services;
using Microsoft.AspNetCore.SignalR;

namespace CvSite.Api.Hubs;

/// <summary>
/// SignalR hub streaming AI answers token-by-token to the client via
/// <c>IAsyncEnumerable</c>. CV-only context + per-IP rate limiting.
/// </summary>
public sealed class ChatHub : Hub
{
    private readonly OpenAiChatService _ai;
    private readonly RateLimiter _rateLimiter;

    public ChatHub(OpenAiChatService ai, RateLimiter rateLimiter)
    {
        _ai = ai;
        _rateLimiter = rateLimiter;
    }

    public async IAsyncEnumerable<string> StreamChat(
        ChatRequest request,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var lang = request.Lang == "en" ? "en" : "tr";
        var ip = ResolveClientIp();

        if (!_rateLimiter.Allow(ip))
        {
            yield return lang == "tr"
                ? "Saatlik mesaj limitine ulaştınız. Lütfen daha sonra tekrar deneyin."
                : "You have reached the hourly message limit. Please try again later.";
            yield break;
        }

        await foreach (var token in _ai.StreamAsync(request, cancellationToken))
        {
            yield return token;
        }
    }

    private string ResolveClientIp()
    {
        var http = Context.GetHttpContext();
        if (http is null)
        {
            return "unknown";
        }

        var forwarded = http.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(forwarded))
        {
            return forwarded.Split(',')[0].Trim();
        }

        return http.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}
