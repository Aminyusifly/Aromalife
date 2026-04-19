using AromaAPI.Data;
using AromaAPI.DTOs.Order;
using AromaAPI.DTOs.WhatsApp;
using AromaAPI.Helpers;
using AromaAPI.Models;
using AromaAPI.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AromaAPI.Services;

public class WhatsAppOrderService : IWhatsAppOrderService
{
    private readonly IPendingWhatsAppOrderRepository _pendingRepository;
    private readonly IOrderService _orderService;
    private readonly AppDbContext _context;

    public WhatsAppOrderService(
        IPendingWhatsAppOrderRepository pendingRepository,
        IOrderService orderService,
        AppDbContext context)
    {
        _pendingRepository = pendingRepository;
        _orderService = orderService;
        _context = context;
    }

    public async Task<List<PendingWhatsAppOrderDto>> GetAllAsync()
    {
        var orders = await _pendingRepository.GetAllWithItemsAsync();
        return orders.Select(MapToDto).ToList();
    }

    public async Task<PendingWhatsAppOrderDto?> GetByIdAsync(int id)
    {
        var order = await _pendingRepository.GetByIdWithItemsAsync(id);
        return order == null ? null : MapToDto(order);
    }

    public async Task<PendingWhatsAppOrderDto> CreateAsync(CreatePendingWhatsAppOrderDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CustomerName))
            throw new BusinessException("Müştəri adı boş ola bilməz");

        if (string.IsNullOrWhiteSpace(dto.CustomerPhone))
            throw new BusinessException("Telefon nömrəsi boş ola bilməz");

        if (dto.Items == null || dto.Items.Count == 0)
            throw new BusinessException("Sifariş ən az bir məhsul içərməlidir");

        decimal total = 0;
        var items = new List<PendingWhatsAppOrderItem>();

        foreach (var item in dto.Items)
        {
            if (item.Ml <= 0)
                throw new BusinessException("Ml miqdarı 0-dan böyük olmalıdır");

            var product = await _context.Products.FindAsync(item.ProductId)
                ?? throw new NotFoundException($"Məhsul tapılmadı: {item.ProductId}");

            var unitPrice = (item.Ml / 2m) * product.PricePerMl;
            total += unitPrice * item.Quantity;

            items.Add(new PendingWhatsAppOrderItem
            {
                ProductId = item.ProductId,
                Ml = item.Ml,
                Quantity = item.Quantity,
                UnitPrice = unitPrice,
                PricePerMl = product.PricePerMl,
                ProductName = product.Name
            });
        }

        var code = $"WP-{Random.Shared.Next(1000, 9999)}";

        var order = new PendingWhatsAppOrder
        {
            Code = code,
            CustomerName = dto.CustomerName.Trim(),
            CustomerPhone = dto.CustomerPhone.Trim(),
            Note = dto.Note?.Trim(),
            TotalAmount = total,
            Items = items
        };

        await _pendingRepository.AddAsync(order);
        await _pendingRepository.SaveAsync();

        return MapToDto(order);
    }

    public async Task<bool> ApproveAsync(int id)
    {
        var pending = await _pendingRepository.GetByIdWithItemsAsync(id);
        if (pending == null || pending.Status != "Gözləyir") return false;

        await _orderService.CreateAsync(new CreateOrderDto
        {
            CustomerName = pending.CustomerName,
            CustomerPhone = pending.CustomerPhone,
            Note = pending.Note,
            Source = "WhatsApp",
            Items = pending.Items.Select(i => new CreateOrderItemDto
            {
                ProductId = i.ProductId,
                Ml = i.Ml,
                Quantity = i.Quantity
            }).ToList()
        });

        pending.Status = "Təsdiqləndi";
        await _pendingRepository.UpdateAsync(pending);
        await _pendingRepository.SaveAsync();
        return true;
    }

    public async Task<bool> RejectAsync(int id)
    {
        var pending = await _pendingRepository.GetByIdAsync(id);
        if (pending == null) return false;

        pending.Status = "Rədd edildi";
        await _pendingRepository.UpdateAsync(pending);
        await _pendingRepository.SaveAsync();
        return true;
    }

    public async Task ExpireOldOrdersAsync() =>
        await _pendingRepository.ExpireOldOrdersAsync();

    private static PendingWhatsAppOrderDto MapToDto(PendingWhatsAppOrder o) => new()
    {
        Id = o.Id,
        Code = o.Code,
        CustomerName = o.CustomerName,
        CustomerPhone = o.CustomerPhone,
        Note = o.Note,
        TotalAmount = o.TotalAmount,
        Status = o.Status,
        CreatedAt = o.CreatedAt,
        ExpiresAt = o.ExpiresAt,
        Items = o.Items.Select(i => new PendingWhatsAppOrderItemDto
        {
            ProductId = i.ProductId,
            ProductName = i.ProductName,
            Ml = i.Ml,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            PricePerMl = i.PricePerMl
        }).ToList()
    };
}