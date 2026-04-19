using AromaAPI.Helpers;
using Microsoft.AspNetCore.Diagnostics;

namespace AromaAPI.Helpers;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (statusCode, message) = exception switch
        {
            NotFoundException ex => (ex.StatusCode, ex.Message),
            StockException ex => (ex.StatusCode, ex.Message),
            BusinessException ex => (ex.StatusCode, ex.Message),
            _ => (500, "Daxili server xətası baş verdi")
        };

        if (statusCode == 500)
            _logger.LogError(exception, "Xəta baş verdi: {Message}", exception.Message);

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            message,
            statusCode
        }, cancellationToken);

        return true;
    }
}