using AromaAPI.DTOs.Product;

namespace AromaAPI.Services;

public interface IProductService
{
    Task<List<ProductListDto>> GetAllAsync();
    Task<ProductDetailDto?> GetByIdAsync(int id);
    Task<List<ProductListDto>> FilterAsync(string? gender, string? search);
    Task<ProductDetailDto> CreateAsync(CreateProductDto dto);
    Task<ProductDetailDto?> UpdateAsync(int id, UpdateProductDto dto);
    Task<bool> DeleteAsync(int id);
}