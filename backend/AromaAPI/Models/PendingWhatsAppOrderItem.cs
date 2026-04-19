namespace AromaAPI.Models;

public class PendingWhatsAppOrderItem
{
    public int Id { get; set; }
    public int Ml { get; set; } // Müştərinin seçdiyi ml miqdarı
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; } // Hesablanmış qiymət
    public decimal PricePerMl { get; set; } // Sifarış anındakı 1ml qiyməti
    public string ProductName { get; set; } = string.Empty;

    public int PendingWhatsAppOrderId { get; set; }
    public PendingWhatsAppOrder PendingWhatsAppOrder { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
}