namespace AromaAPI.DTOs.Order;

public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Ml { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal PricePerMl { get; set; }
}