namespace AromaAPI.Models;

public class Order
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Note { get; set; }
    public string Source { get; set; } = string.Empty; // Form, WhatsApp
    public string Status { get; set; } = "Yeni"; // Yeni, Hazırlanıyor, Tamamlandı, İptal
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}