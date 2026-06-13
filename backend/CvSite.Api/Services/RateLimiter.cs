using System.Collections.Concurrent;

namespace CvSite.Api.Services;

/// <summary>Simple in-memory sliding-window rate limiter keyed by client IP.</summary>
public sealed class RateLimiter
{
    private readonly ConcurrentDictionary<string, List<DateTimeOffset>> _hits = new();
    private readonly int _limitPerHour;

    public RateLimiter(IConfiguration config)
    {
        _limitPerHour = int.TryParse(config["AI_CHAT_RATE_LIMIT_PER_HOUR"], out var v) ? v : 10;
    }

    public bool Allow(string key)
    {
        var now = DateTimeOffset.UtcNow;
        var windowStart = now.AddHours(-1);
        var list = _hits.GetOrAdd(key, _ => new List<DateTimeOffset>());
        lock (list)
        {
            list.RemoveAll(t => t < windowStart);
            if (list.Count >= _limitPerHour)
            {
                return false;
            }
            list.Add(now);
            return true;
        }
    }
}
