using AromaAPI.Repositories;

namespace AromaAPI.Helpers;

public class ExpireOrdersJob : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ExpireOrdersJob> _logger;

    public ExpireOrdersJob(IServiceScopeFactory scopeFactory, ILogger<ExpireOrdersJob> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var repo = scope.ServiceProvider.GetRequiredService<IPendingWhatsAppOrderRepository>();
                await repo.ExpireOldOrdersAsync();
                _logger.LogInformation("Müddəti bitmiş sifarişlər yeniləndi");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ExpireOrdersJob xətası");
            }

            await Task.Delay(TimeSpan.FromHours(1), ct);
        }
    }
}   