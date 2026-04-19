using Microsoft.EntityFrameworkCore;
using AromaAPI.Data;
using AromaAPI.Models;

namespace AromaAPI.Repositories;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context) { }

    public async Task<List<Order>> GetAllWithItemsAsync() =>
        await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

    public async Task<Order?> GetByIdWithItemsAsync(int id) =>
        await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
}