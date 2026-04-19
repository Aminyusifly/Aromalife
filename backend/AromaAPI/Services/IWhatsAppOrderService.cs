using AromaAPI.DTOs.WhatsApp;

namespace AromaAPI.Services;

public interface IWhatsAppOrderService
{
    Task<List<PendingWhatsAppOrderDto>> GetAllAsync();
    Task<PendingWhatsAppOrderDto?> GetByIdAsync(int id);
    Task<PendingWhatsAppOrderDto> CreateAsync(CreatePendingWhatsAppOrderDto dto);
    Task<bool> ApproveAsync(int id);
    Task<bool> RejectAsync(int id);
    Task ExpireOldOrdersAsync();
}