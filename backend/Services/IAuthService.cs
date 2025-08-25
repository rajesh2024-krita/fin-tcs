
using MemberManagementAPI.Models.DTOs;

namespace MemberManagementAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<UserDto> CreateUserAsync(CreateUserDto createUserDto, int currentUserId);
        Task<string> GenerateJwtTokenAsync(UserDto user);
        Task<bool> ValidateUserRoleAsync(int userId, string requiredRole);
        Task<UserDto?> GetUserByIdAsync(int userId);
    }
}
