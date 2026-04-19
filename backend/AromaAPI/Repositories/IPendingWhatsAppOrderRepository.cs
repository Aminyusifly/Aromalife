using AromaAPI.Models;

namespace AromaAPI.Repositories;

public interface IPendingWhatsAppOrderRepository : IGenericRepository<PendingWhatsAppOrder>
{
    Task<List<PendingWhatsAppOrder>> GetAllWithItemsAsync();
    Task<PendingWhatsAppOrder?> GetByIdWithItemsAsync(int id);
    Task<PendingWhatsAppOrder?> GetByCodeAsync(string code);
    Task ExpireOldOrdersAsync();
}