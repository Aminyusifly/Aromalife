using System.ComponentModel.DataAnnotations;

namespace AromaAPI.DTOs.Auth;

public class LoginRequestDto
{
    [Required(ErrorMessage = "İstifadəçi adı tələb olunur")]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Şifrə tələb olunur")]
    [MinLength(6, ErrorMessage = "Şifrə minimum 6 simvol olmalıdır")]
    public string Password { get; set; } = string.Empty;
}