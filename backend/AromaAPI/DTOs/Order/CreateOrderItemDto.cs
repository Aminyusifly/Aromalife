namespace AromaAPI.DTOs.Order;

public class CreateOrderItemDto
{
    public int ProductId { get; set; }
    public int Ml { get; set; }
    public int Quantity { get; set; } = 1;
}