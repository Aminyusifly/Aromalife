using AromaAPI.Models;

namespace AromaAPI.Repositories;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<List<Order>> GetAllWithItemsAsync();
    Task<Order?> GetByIdWithItemsAsync(int id);
}