using System.ComponentModel.DataAnnotations;

namespace AromaAPI.DTOs.Product;

public class CreateProductDto
{
    [Required(ErrorMessage = "Məhsul adı tələb olunur")]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Cins tələb olunur")]
    public string Gender { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "1ml qiyməti 0-dan böyük olmalıdır")]
    public decimal PricePerMl { get; set; }
}