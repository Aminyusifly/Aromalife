using AromaAPI.DTOs.Product;
using AromaAPI.Helpers;
using AromaAPI.Models;
using AromaAPI.Repositories;
using AromaAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace AromaAPI.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductListDto>> GetAllAsync()
    {
        var products = await _context.Products
            .OrderBy(p => p.Name)
            .ToListAsync();
        return products.Select(MapToListDto).ToList();
    }

    public async Task<ProductDetailDto?> GetByIdAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        return product == null ? null : MapToDetailDto(product);
    }

    public async Task<List<ProductListDto>> FilterAsync(string? gender, string? search)
    {
        var query = _context.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(gender))
            query = query.Where(p => p.Gender == gender);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search));

        var products = await query.OrderBy(p => p.Name).ToListAsync();
        return products.Select(MapToListDto).ToList();
    }

    public async Task<ProductDetailDto> CreateAsync(CreateProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new BusinessException("Məhsul adı boş ola bilməz");

        if (dto.PricePerMl <= 0)
            throw new BusinessException("1ml qiyməti 0-dan böyük olmalıdır");

        var product = new Product
        {
            Name = dto.Name.Trim(),
            Gender = dto.Gender,
            PricePerMl = dto.PricePerMl,
            IsActive = true
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return MapToDetailDto(product);
    }

    public async Task<ProductDetailDto?> UpdateAsync(int id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return null;

        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new BusinessException("Məhsul adı boş ola bilməz");

        if (dto.PricePerMl <= 0)
            throw new BusinessException("1ml qiyməti 0-dan böyük olmalıdır");

        product.Name = dto.Name.Trim();
        product.Gender = dto.Gender;
        product.PricePerMl = dto.PricePerMl;
        product.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return MapToDetailDto(product);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    private static ProductListDto MapToListDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Gender = p.Gender,
        PricePerMl = p.PricePerMl,
        IsActive = p.IsActive
    };

    private static ProductDetailDto MapToDetailDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Gender = p.Gender,
        PricePerMl = p.PricePerMl,
        IsActive = p.IsActive
    };
}