using AromaAPI.DTOs.Product;
using AromaAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AromaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductController> _logger;

    public ProductController(IProductService productService, ILogger<ProductController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _productService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (id <= 0) return BadRequest(new { message = "Yanlış ID" });
        var product = await _productService.GetByIdAsync(id);
        return product == null
            ? NotFound(new { message = $"Məhsul tapılmadı: {id}" })
            : Ok(product);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> Filter(
        [FromQuery] string? gender,
        [FromQuery] string? search) =>
        Ok(await _productService.FilterAsync(gender, search));

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Məhsul adı boş ola bilməz" });

        if (dto.PricePerMl <= 0)
            return BadRequest(new { message = "1ml qiyməti 0-dan böyük olmalıdır" });

        var product = await _productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [Authorize]
    [HttpPost("bulk")]
    public async Task<IActionResult> CreateBulk([FromBody] List<CreateProductDto> dtos)
    {
        if (dtos == null || dtos.Count == 0)
            return BadRequest(new { message = "Boş siyahı göndərildi" });

        if (dtos.Count > 100)
            return BadRequest(new { message = "Birdən çox 100 məhsul əlavə edilə bilməz" });

        var results = new List<ProductDetailDto>();
        foreach (var dto in dtos)
        {
            var product = await _productService.CreateAsync(dto);
            results.Add(product);
        }
        return Ok(results);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        if (id <= 0) return BadRequest(new { message = "Yanlış ID" });

        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Məhsul adı boş ola bilməz" });

        if (dto.PricePerMl <= 0)
            return BadRequest(new { message = "1ml qiyməti 0-dan böyük olmalıdır" });

        var product = await _productService.UpdateAsync(id, dto);
        return product == null
            ? NotFound(new { message = $"Məhsul tapılmadı: {id}" })
            : Ok(product);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0) return BadRequest(new { message = "Yanlış ID" });
        var result = await _productService.DeleteAsync(id);
        return result
            ? Ok(new { message = "Məhsul silindi" })
            : NotFound(new { message = $"Məhsul tapılmadı: {id}" });
    }
}