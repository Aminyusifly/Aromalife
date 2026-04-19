using Microsoft.EntityFrameworkCore;
using AromaAPI.Data;
using AromaAPI.Models;

namespace AromaAPI.Repositories;

public class PendingWhatsAppOrderRepository : GenericRepository<PendingWhatsAppOrder>, IPendingWhatsAppOrderRepository
{
    public PendingWhatsAppOrderRepository(AppDbContext context) : base(context) { }

    public async Task<List<PendingWhatsAppOrder>> GetAllWithItemsAsync() =>
        await _context.PendingWhatsAppOrders
            .Include(p => p.Items)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

    public async Task<PendingWhatsAppOrder?> GetByIdWithItemsAsync(int id) =>
        await _context.PendingWhatsAppOrders
            .Include(p => p.Items)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<PendingWhatsAppOrder?> GetByCodeAsync(string code) =>
        await _context.PendingWhatsAppOrders
            .Include(p => p.Items)
            .FirstOrDefaultAsync(p => p.Code == code);

    public async Task ExpireOldOrdersAsync()
    {
        var expired = await _context.PendingWhatsAppOrders
            .Where(p => p.Status == "Gözləyir" && p.ExpiresAt < DateTime.UtcNow)
            .ToListAsync();

        foreach (var order in expired)
            order.Status = "Müddəti bitdi";

        await _context.SaveChangesAsync();
    }
}