using AromaAPI.Models;

namespace AromaAPI.Repositories;

public interface IProductRepository : IGenericRepository<Product>
{
    Task<List<Product>> GetAllAsync();
    Task<List<Product>> FilterAsync(string? gender, string? search);
}