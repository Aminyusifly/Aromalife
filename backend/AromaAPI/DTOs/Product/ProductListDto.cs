namespace AromaAPI.DTOs.Product;

public class ProductListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public decimal PricePerMl { get; set; }
    public bool IsActive { get; set; }
    public decimal MinPrice => (10 / 2m) * PricePerMl; // 10ml minimum qiymət
}