using System.ComponentModel.DataAnnotations;

namespace AromaAPI.DTOs.Product;

public class CreateProductVariantDto
{
    [Range(1, 10000, ErrorMessage = "Həcm düzgün deyil")]
    public int Volume { get; set; }

    [Range(0.01, 99999, ErrorMessage = "Qiymət düzgün deyil")]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Stok mənfi ola bilməz")]
    public int Stock { get; set; }
}