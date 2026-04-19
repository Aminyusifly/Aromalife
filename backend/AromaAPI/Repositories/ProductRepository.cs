using Microsoft.EntityFrameworkCore;
using AromaAPI.Data;
using AromaAPI.Models;

namespace AromaAPI.Repositories;

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context) { }

    public async Task<List<Product>> GetAllAsync() =>
        await _context.Products
            .Where(p => p.IsActive)
            .OrderBy(p => p.Name)
            .ToListAsync();

    public async Task<List<Product>> FilterAsync(string? gender, string? search)
    {
        var query = _context.Products
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(gender))
            query = query.Where(p => p.Gender == gender);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search));

        return await query.OrderBy(p => p.Name).ToListAsync();
    }
}