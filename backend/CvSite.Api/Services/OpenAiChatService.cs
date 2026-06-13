using System.Net.Http.Headers;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using CvSite.Api.Models;

namespace CvSite.Api.Services;

/// <summary>
/// Streams a chat completion from OpenAI token-by-token. When no API key is
/// configured it yields a single graceful demo message so the UI keeps working.
/// </summary>
public sealed class OpenAiChatService
{
    private readonly HttpClient _http;
    private readonly CvContextService _cv;
    private readonly string _apiKey;
    private readonly string _model;

    public OpenAiChatService(HttpClient http, CvContextService cv, IConfiguration config)
    {
        _http = http;
        _cv = cv;
        _apiKey = config["OPENAI_API_KEY"] ?? string.Empty;
        _model = config["OPENAI_MODEL"] ?? "gpt-4o-mini";
    }

    public bool HasKey => !string.IsNullOrWhiteSpace(_apiKey);

    public async IAsyncEnumerable<string> StreamAsync(
        ChatRequest request,
        [EnumeratorCancellation] CancellationToken ct)
    {
        var lang = request.Lang == "en" ? "en" : "tr";

        if (!HasKey)
        {
            yield return lang == "tr"
                ? "AI asistan şu an demo modunda (sunucuda OPENAI_API_KEY tanımlı değil). Yine de: Hasan, 4+ yıl deneyimli, .NET · Angular · OpenAI odaklı bir Full Stack geliştiricidir. Sorularınız için lütfen iletişim bölümünü kullanın."
                : "The AI assistant is in demo mode (no OPENAI_API_KEY set on the server). In short: Hasan is a Full Stack developer with 4+ years of experience focused on .NET · Angular · OpenAI. Please use the contact section for questions.";
            yield break;
        }

        var recent = request.Messages.TakeLast(8)
            .Select(m => new { role = m.Role, content = m.Content })
            .ToList();

        var payload = new
        {
            model = _model,
            stream = true,
            temperature = 0.3,
            max_tokens = 500,
            messages = new object[]
                {
                    new { role = "system", content = _cv.BuildSystemPrompt(lang) },
                }
                .Concat(recent.Cast<object>())
                .ToArray(),
        };

        using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        req.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        HttpResponseMessage? resp = null;
        var failed = false;
        try
        {
            resp = await _http.SendAsync(req, HttpCompletionOption.ResponseHeadersRead, ct);
        }
        catch
        {
            failed = true;
        }

        if (failed || resp is null || !resp.IsSuccessStatusCode)
        {
            yield return lang == "tr" ? "Asistana ulaşılamadı." : "Could not reach the assistant.";
            yield break;
        }

        await using var stream = await resp.Content.ReadAsStreamAsync(ct);
        using var reader = new StreamReader(stream);

        while (!reader.EndOfStream && !ct.IsCancellationRequested)
        {
            var line = await reader.ReadLineAsync(ct);
            if (string.IsNullOrWhiteSpace(line) || !line.StartsWith("data:", StringComparison.Ordinal))
            {
                continue;
            }

            var data = line["data:".Length..].Trim();
            if (data == "[DONE]")
            {
                break;
            }

            string? delta = null;
            try
            {
                using var doc = JsonDocument.Parse(data);
                delta = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("delta")
                    .TryGetProperty("content", out var c) ? c.GetString() : null;
            }
            catch
            {
                // ignore partial / non-JSON keep-alive lines
            }

            if (!string.IsNullOrEmpty(delta))
            {
                yield return delta;
            }
        }
    }
}
