namespace AromaAPI.DTOs.WhatsApp;

public class PendingWhatsAppOrderDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? Note { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public List<PendingWhatsAppOrderItemDto> Items { get; set; } = new();
}