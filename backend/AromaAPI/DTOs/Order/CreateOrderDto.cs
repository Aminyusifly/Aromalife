using System.ComponentModel.DataAnnotations;

namespace AromaAPI.DTOs.Order;

public class CreateOrderDto
{
    [Required(ErrorMessage = "Ad tələb olunur")]
    [MaxLength(100)]
    public string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Telefon tələb olunur")]
    [MaxLength(20)]
    public string CustomerPhone { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Address { get; set; }

    [MaxLength(500)]
    public string? Note { get; set; }

    public string Source { get; set; } = "Form";

    [MinLength(1, ErrorMessage = "Ən az bir məhsul seçilməlidir")]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}