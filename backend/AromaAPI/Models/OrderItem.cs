namespace AromaAPI.Models;

public class OrderItem
{
    public int Id { get; set; }
    public int Ml { get; set; } // Müştərinin seçdiyi ml miqdarı
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; } // Hesablanmış qiymət (ml/2 * pricePerMl)
    public decimal PricePerMl { get; set; } // Sifarış anındakı 1ml qiyməti

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
}