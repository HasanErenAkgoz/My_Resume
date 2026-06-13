namespace CvSite.Api.Services;

/// <summary>
/// Loads the bilingual CV JSON once and builds the CV-only system prompt that
/// constrains the assistant to answer strictly from this data (anti-hallucination).
/// </summary>
public sealed class CvContextService
{
    private readonly string _cvJson;

    public CvContextService(IWebHostEnvironment env, ILogger<CvContextService> logger)
    {
        var path = Path.Combine(env.ContentRootPath, "Data", "cv.data.json");
        try
        {
            _cvJson = File.ReadAllText(path);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Could not read CV data at {Path}", path);
            _cvJson = "{}";
        }
    }

    public string BuildSystemPrompt(string lang)
    {
        var persona = lang == "en"
            ? "You are the AI assistant on Hasan Eren Akgöz's personal CV website. Answer visitors' questions (especially recruiters and hiring managers) about Hasan STRICTLY from the CV data below, concisely and professionally. If something is not in the data, politely say you don't know — never invent. Answer in English."
            : "Sen Hasan Eren Akgöz'ün kişisel CV sitesindeki yapay zeka asistanısın. Görevin, ziyaretçilerin (özellikle İK ve işe alım yöneticilerinin) Hasan hakkındaki sorularını YALNIZCA aşağıdaki CV verisine dayanarak, kısa ve profesyonel biçimde yanıtlamaktır. Veride olmayan bir şey sorulursa kibarca bilmediğini söyle ve uydurma. Türkçe yanıt ver.";

        return $"{persona}\n\nCV_DATA (JSON):\n{_cvJson}";
    }
}
