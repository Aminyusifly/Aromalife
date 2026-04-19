namespace AromaAPI.DTOs.Product;

public class ProductDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public decimal PricePerMl { get; set; }
    public bool IsActive { get; set; }

    // Sabit ml seçenekləri və qiymətlər
    public List<MlOptionDto> MlOptions => new()
    {
        new() { Ml = 10, Price = (10 / 2m) * PricePerMl },
        new() { Ml = 20, Price = (20 / 2m) * PricePerMl },
        new() { Ml = 30, Price = (30 / 2m) * PricePerMl },
        new() { Ml = 50, Price = (50 / 2m) * PricePerMl },
        new() { Ml = 100, Price = (100 / 2m) * PricePerMl },
    };
}

public class MlOptionDto
{
    public int Ml { get; set; }
    public decimal Price { get; set; }
}