using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace AromaAPI.Helpers;

public class CloudinaryHelper
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryHelper(IConfiguration configuration)
    {
        var account = new Account(
            configuration["Cloudinary:CloudName"],
            configuration["Cloudinary:ApiKey"],
            configuration["Cloudinary:ApiSecret"]);

        _cloudinary = new Cloudinary(account);
    }

    public async Task<string?> UploadImageAsync(IFormFile file)
    {
        if (file.Length == 0) return null;

        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "aromalife/products",
            Transformation = new Transformation()
                .Width(800).Height(800)
                .Crop("fill")
                .Quality("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);
        return result.SecureUrl?.ToString();
    }

    public async Task<bool> DeleteImageAsync(string imageUrl)
    {
        var publicId = ExtractPublicId(imageUrl);
        if (string.IsNullOrEmpty(publicId)) return false;

        var deleteParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deleteParams);
        return result.Result == "ok";
    }

    private static string ExtractPublicId(string imageUrl)
    {
        var uri = new Uri(imageUrl);
        var path = uri.AbsolutePath;
        var startIndex = path.IndexOf("aromalife/");
        if (startIndex == -1) return string.Empty;

        var publicIdWithExtension = path[startIndex..];
        var dotIndex = publicIdWithExtension.LastIndexOf('.');
        return dotIndex == -1 ? publicIdWithExtension : publicIdWithExtension[..dotIndex];
    }
}