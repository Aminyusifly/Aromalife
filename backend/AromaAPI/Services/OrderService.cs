using AromaAPI.Data;
using AromaAPI.DTOs.Order;
using AromaAPI.Helpers;
using AromaAPI.Models;
using AromaAPI.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AromaAPI.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly AppDbContext _context;

    public OrderService(IOrderRepository orderRepository, AppDbContext context)
    {
        _orderRepository = orderRepository;
        _context = context;
    }

    public async Task<List<OrderDto>> GetAllAsync()
    {
        var orders = await _orderRepository.GetAllWithItemsAsync();
        return orders.Select(MapToDto).ToList();
    }

    public async Task<OrderDto?> GetByIdAsync(int id)
    {
        var order = await _orderRepository.GetByIdWithItemsAsync(id);
        return order == null ? null : MapToDto(order);
    }

    public async Task<OrderDto> CreateAsync(CreateOrderDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CustomerName))
            throw new BusinessException("Müştəri adı boş ola bilməz");

        if (string.IsNullOrWhiteSpace(dto.CustomerPhone))
            throw new BusinessException("Telefon nömrəsi boş ola bilməz");

        if (dto.Items == null || dto.Items.Count == 0)
            throw new BusinessException("Sifariş ən az bir məhsul içərməlidir");

        var items = new List<OrderItem>();
        decimal total = 0;

        foreach (var item in dto.Items)
        {
            if (item.Quantity <= 0)
                throw new BusinessException("Miqdar 0-dan böyük olmalıdır");

            if (item.Ml <= 0)
                throw new BusinessException("Ml miqdarı 0-dan böyük olmalıdır");

            var product = await _context.Products.FindAsync(item.ProductId)
                ?? throw new NotFoundException($"Məhsul tapılmadı: {item.ProductId}");

            // Fiyat hesaplama: (ml / 2) * pricePerMl
            var unitPrice = (item.Ml / 2m) * product.PricePerMl;
            total += unitPrice * item.Quantity;

            items.Add(new OrderItem
            {
                ProductId = item.ProductId,
                Ml = item.Ml,
                Quantity = item.Quantity,
                UnitPrice = unitPrice,
                PricePerMl = product.PricePerMl
            });
        }

        var order = new Order
        {
            CustomerName = dto.CustomerName.Trim(),
            CustomerPhone = dto.CustomerPhone.Trim(),
            Address = dto.Address?.Trim(),
            Note = dto.Note?.Trim(),
            Source = dto.Source,
            TotalAmount = total,
            Items = items
        };

        await _orderRepository.AddAsync(order);
        await _orderRepository.SaveAsync();

        var created = await _orderRepository.GetByIdWithItemsAsync(order.Id);
        return MapToDto(created!);
    }

    public async Task<bool> UpdateStatusAsync(int id, string status)
    {
        var validStatuses = new[] { "Yeni", "Hazırlanır", "Yoldadır", "Tamamlandı", "İptal" };

        if (!validStatuses.Contains(status))
            throw new BusinessException($"Yanlış status: {status}");

        var order = await _orderRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Sifariş tapılmadı: {id}");

        order.Status = status;
        await _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Sifariş tapılmadı: {id}");

        await _orderRepository.DeleteAsync(order);
        await _orderRepository.SaveAsync();
        return true;
    }

    private static OrderDto MapToDto(Order o) => new()
    {
        Id = o.Id,
        CustomerName = o.CustomerName,
        CustomerPhone = o.CustomerPhone,
        Address = o.Address,
        Note = o.Note,
        Source = o.Source,
        Status = o.Status,
        TotalAmount = o.TotalAmount,
        CreatedAt = o.CreatedAt,
        Items = o.Items.Select(i => new OrderItemDto
        {
            ProductId = i.ProductId,
            ProductName = i.Product?.Name ?? string.Empty,
            Ml = i.Ml,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            PricePerMl = i.PricePerMl
        }).ToList()
    };
}