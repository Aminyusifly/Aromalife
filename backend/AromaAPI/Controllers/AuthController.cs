    using AromaAPI.DTOs.Auth;
using AromaAPI.Helpers;
using AromaAPI.Models;
using AromaAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace AromaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IGenericRepository<Admin> _adminRepository;
    private readonly JwtHelper _jwtHelper;
    private readonly IMemoryCache _cache;
    private readonly ILogger<AuthController> _logger;
    private const int MaxFailedAttempts = 5;
    private const int LockoutMinutes = 15;

    public AuthController(
        IGenericRepository<Admin> adminRepository,
        JwtHelper jwtHelper,
        IMemoryCache cache,
        ILogger<AuthController> logger)
    {
        _adminRepository = adminRepository;
        _jwtHelper = jwtHelper;
        _cache = cache;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "İstifadəçi adı və şifrə boş ola bilməz" });

        if (dto.Username.Length > 50 || dto.Password.Length > 100)
            return BadRequest(new { message = "Yanlış giriş məlumatları" });

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var cacheKey = $"failed_login_{ip}";
        var lockKey = $"locked_{ip}";

        if (_cache.TryGetValue(lockKey, out _))
        {
            _logger.LogWarning("Kilidlənmiş IP giriş cəhdi: {IP}", ip);
            return StatusCode(429, new
            {
                message = $"Çox sayda uğursuz cəhd. {LockoutMinutes} dəqiqə gözləyin."
            });
        }

        var admins = await _adminRepository.GetAllAsync();
        var admin = admins.FirstOrDefault(a =>
            a.Username.Equals(dto.Username, StringComparison.OrdinalIgnoreCase));

        if (admin == null || !PasswordHelper.VerifyPassword(dto.Password, admin.PasswordHash))
        {
            var attempts = _cache.GetOrCreate(cacheKey, e =>
            {
                e.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(LockoutMinutes);
                return 0;
            });

            attempts++;
            _cache.Set(cacheKey, attempts, TimeSpan.FromMinutes(LockoutMinutes));

            _logger.LogWarning("Uğursuz giriş cəhdi: {Username}, IP: {IP}, Cəhd: {Attempts}",
                dto.Username, ip, attempts);

            if (attempts >= MaxFailedAttempts)
            {
                _cache.Set(lockKey, true, TimeSpan.FromMinutes(LockoutMinutes));
                _cache.Remove(cacheKey);
                return StatusCode(429, new
                {
                    message = $"{MaxFailedAttempts} uğursuz cəhddən sonra hesab {LockoutMinutes} dəqiqə kilidləndi."
                });
            }

            var remaining = MaxFailedAttempts - attempts;
            return Unauthorized(new
            {
                message = $"İstifadəçi adı və ya şifrə yanlışdır. {remaining} cəhd qalıb."
            });
        }

        _cache.Remove(cacheKey);
        _cache.Remove(lockKey);

        _logger.LogInformation("Uğurlu giriş: {Username}, IP: {IP}", admin.Username, ip);

        var token = _jwtHelper.GenerateToken(admin);
        return Ok(new LoginResponseDto { Token = token, Username = admin.Username });
    }

    // İlk admin yoksa açık, varsa token gerekir
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] LoginRequestDto dto)
    {
        var admins = await _adminRepository.GetAllAsync();

        // Admin varsa sadece mevcut admin yeni admin ekleyebilir
        if (admins.Any())
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return StatusCode(403, new { message = "Qeydiyyat bağlıdır" });
        }

        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "İstifadəçi adı və şifrə boş ola bilməz" });

        if (dto.Username.Length < 3 || dto.Username.Length > 50)
            return BadRequest(new { message = "İstifadəçi adı 3-50 simvol arası olmalıdır" });

        if (dto.Password.Length < 8)
            return BadRequest(new { message = "Şifrə ən az 8 simvol olmalıdır" });

        if (admins.Any(a => a.Username.Equals(dto.Username, StringComparison.OrdinalIgnoreCase)))
            return BadRequest(new { message = "Bu istifadəçi adı artıq mövcuddur" });

        var admin = new Admin
        {
            Username = dto.Username.Trim(),
            PasswordHash = PasswordHelper.HashPassword(dto.Password),
            Email = $"{dto.Username.Trim()}@aromalife.az"
        };

        await _adminRepository.AddAsync(admin);
        await _adminRepository.SaveAsync();

        _logger.LogInformation("Yeni admin yaradıldı: {Username}", admin.Username);

        return Ok(new { message = "Admin uğurla yaradıldı" });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
            return BadRequest(new { message = "Şifrə boş ola bilməz" });

        if (dto.NewPassword.Length < 8)
            return BadRequest(new { message = "Yeni şifrə ən az 8 simvol olmalıdır" });

        var username = User.Identity?.Name;
        var admins = await _adminRepository.GetAllAsync();
        var admin = admins.FirstOrDefault(a => a.Username == username);

        if (admin == null)
            return NotFound(new { message = "Admin tapılmadı" });

        if (!PasswordHelper.VerifyPassword(dto.CurrentPassword, admin.PasswordHash))
            return BadRequest(new { message = "Cari şifrə yanlışdır" });

        admin.PasswordHash = PasswordHelper.HashPassword(dto.NewPassword);
        await _adminRepository.UpdateAsync(admin);
        await _adminRepository.SaveAsync();

        _logger.LogInformation("Şifrə dəyişdirildi: {Username}", admin.Username);

        return Ok(new { message = "Şifrə uğurla dəyişdirildi" });
    }
}