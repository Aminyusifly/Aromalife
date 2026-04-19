using Microsoft.EntityFrameworkCore;
using AromaAPI.Models;

namespace AromaAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<PendingWhatsAppOrder> PendingWhatsAppOrders => Set<PendingWhatsAppOrder>();
    public DbSet<PendingWhatsAppOrderItem> PendingWhatsAppOrderItems => Set<PendingWhatsAppOrderItem>();
    public DbSet<Admin> Admins => Set<Admin>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Product
        modelBuilder.Entity<Product>()
            .Property(p => p.PricePerMl)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Name);

        // OrderItem
        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.UnitPrice)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.PricePerMl)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId);

        // Order
        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Order>()
            .HasIndex(o => o.CreatedAt);

        // PendingWhatsAppOrder
        modelBuilder.Entity<PendingWhatsAppOrder>()
            .Property(p => p.TotalAmount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<PendingWhatsAppOrder>()
            .HasIndex(p => p.Code)
            .IsUnique();

        // PendingWhatsAppOrderItem
        modelBuilder.Entity<PendingWhatsAppOrderItem>()
            .Property(p => p.UnitPrice)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<PendingWhatsAppOrderItem>()
            .Property(p => p.PricePerMl)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<PendingWhatsAppOrderItem>()
            .HasOne(i => i.Product)
            .WithMany()
            .HasForeignKey(i => i.ProductId);

        modelBuilder.Entity<PendingWhatsAppOrderItem>()
            .HasOne(i => i.PendingWhatsAppOrder)
            .WithMany(o => o.Items)
            .HasForeignKey(i => i.PendingWhatsAppOrderId);

        // Admin
        modelBuilder.Entity<Admin>()
            .HasIndex(a => a.Username)
            .IsUnique();

        modelBuilder.Entity<Admin>()
            .HasIndex(a => a.Email)
            .IsUnique();
    }
}