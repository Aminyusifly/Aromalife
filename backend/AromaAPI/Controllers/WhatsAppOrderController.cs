using AromaAPI.DTOs.WhatsApp;
using AromaAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AromaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WhatsAppOrderController : ControllerBase
{
    private readonly IWhatsAppOrderService _whatsAppOrderService;

    public WhatsAppOrderController(IWhatsAppOrderService whatsAppOrderService)
    {
        _whatsAppOrderService = whatsAppOrderService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePendingWhatsAppOrderDto dto)
    {
        try
        {
            var order = await _whatsAppOrderService.CreateAsync(dto);
            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _whatsAppOrderService.GetAllAsync());

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _whatsAppOrderService.GetByIdAsync(id);
        return order == null ? NotFound() : Ok(order);
    }

    [Authorize]
    [HttpPost("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        try
        {
            var result = await _whatsAppOrderService.ApproveAsync(id);
            return result ? Ok(new { message = "Sifariş təsdiqləndi" }) : BadRequest(new { message = "Sifariş təsdiqlənə bilmədi" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("{id}/reject")]
    public async Task<IActionResult> Reject(int id)
    {
        var result = await _whatsAppOrderService.RejectAsync(id);
        return result ? Ok(new { message = "Sifariş rədd edildi" }) : NotFound();
    }
}