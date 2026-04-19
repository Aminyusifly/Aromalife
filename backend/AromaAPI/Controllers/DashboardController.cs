using AromaAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AromaAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetStats()
    {
        var totalOrders = await _context.Orders.CountAsync();
        var totalRevenue = await _context.Orders
            .Where(o => o.Status != "İptal")
            .SumAsync(o => o.TotalAmount);
        var pendingWpOrders = await _context.PendingWhatsAppOrders
            .CountAsync(p => p.Status == "Gözləyir");
        var totalProducts = await _context.Products
            .CountAsync(p => p.IsActive);

        var recentOrders = await _context.Orders
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .Select(o => new
            {
                o.Id,
                o.CustomerName,
                o.CustomerPhone,
                o.TotalAmount,
                o.Status,
                o.Source,
                o.CreatedAt
            })
            .ToListAsync();

        var monthlySales = await _context.Orders
            .Where(o => o.CreatedAt >= DateTime.UtcNow.AddMonths(-6))
            .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Total = g.Sum(o => o.TotalAmount),
                Count = g.Count()
            })
            .OrderBy(g => g.Year).ThenBy(g => g.Month)
            .ToListAsync();

        return Ok(new
        {
            totalOrders,
            totalRevenue,
            pendingWpOrders,
            totalProducts,
            recentOrders,
            monthlySales
        });
    }

    [HttpGet("extended")]
    public async Task<IActionResult> GetExtendedStats()
    {
        // En çox satan məhsullar
        var topProducts = await _context.OrderItems
            .Include(i => i.Product)
            .GroupBy(i => i.Product.Name)
            .Select(g => new
            {
                ProductName = g.Key,
                TotalMl = g.Sum(i => i.Ml * i.Quantity),
                TotalRevenue = g.Sum(i => i.UnitPrice * i.Quantity)
            })
            .OrderByDescending(x => x.TotalMl)
            .Take(5)
            .ToListAsync();

        // Günlük satış trendi (son 14 gün)
        var dailySales = await _context.Orders
            .Where(o => o.CreatedAt >= DateTime.UtcNow.AddDays(-14))
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new
            {
                Date = g.Key.ToString("MM-dd"),
                Total = g.Sum(o => o.TotalAmount),
                Count = g.Count()
            })
            .OrderBy(g => g.Date)
            .ToListAsync();

        return Ok(new { topProducts, dailySales });
    }
}