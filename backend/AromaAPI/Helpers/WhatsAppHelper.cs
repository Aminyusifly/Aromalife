namespace AromaAPI.Helpers;

public class WhatsAppHelper
{
    private readonly IConfiguration _configuration;

    public WhatsAppHelper(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateOrderMessage(string code, string customerName, List<(string ProductName, int Volume, int Quantity, decimal UnitPrice)> items, decimal total)
    {
        var lines = new List<string>
        {
            $"Salam! Sifariş vermək istəyirəm.",
            $"",
            $"Ad: {customerName}",
            $"Sifariş kodu: {code}",
            $""
        };

        foreach (var item in items)
            lines.Add($"📦 {item.ProductName} {item.Volume}ml x{item.Quantity} — {item.UnitPrice * item.Quantity:F2} AZN");

        lines.Add($"");
        lines.Add($"💰 Cəmi: {total:F2} AZN");
        lines.Add($"");
        lines.Add($"Zəhmət olmasa təsdiq edin.");

        return string.Join("\n", lines);
    }

    public string GenerateWhatsAppUrl(string message)
    {
        var phone = _configuration["WhatsApp:PhoneNumber"]
            ?? throw new Exception("WhatsApp nömrəsi tapılmadı");

        var encoded = Uri.EscapeDataString(message);
        return $"https://wa.me/{phone}?text={encoded}";
    }
}