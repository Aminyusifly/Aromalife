namespace AromaAPI.Models;

public class PendingWhatsAppOrder
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty; // WP-2047
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? Note { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Gözləyir"; // Gözləyir, Təsdiqləndi, Rədd edildi, Müddəti bitdi
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddHours(48);

    public ICollection<PendingWhatsAppOrderItem> Items { get; set; } = new List<PendingWhatsAppOrderItem>();
}