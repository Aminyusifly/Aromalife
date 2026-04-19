using System.ComponentModel.DataAnnotations;
using AromaAPI.DTOs.Order;

namespace AromaAPI.DTOs.WhatsApp;

public class CreatePendingWhatsAppOrderDto
{
    [Required(ErrorMessage = "Ad tələb olunur")]
    [MaxLength(100)]
    public string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Telefon tələb olunur")]
    [MaxLength(20)]
    public string CustomerPhone { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Note { get; set; }

    [MinLength(1, ErrorMessage = "Ən az bir məhsul seçilməlidir")]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}