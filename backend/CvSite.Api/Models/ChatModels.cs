namespace CvSite.Api.Models;

public sealed class ChatMessage
{
    public string Role { get; set; } = "user";
    public string Content { get; set; } = string.Empty;
}

public sealed class ChatRequest
{
    /// <summary>"tr" or "en" — controls the assistant's response language.</summary>
    public string Lang { get; set; } = "tr";

    /// <summary>Conversation so far (the last few turns are used as context).</summary>
    public List<ChatMessage> Messages { get; set; } = new();
}
