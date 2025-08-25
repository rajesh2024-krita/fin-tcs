using MemberManagementAPI.Models;
using MemberManagementAPI.Controllers;

namespace MemberManagementAPI.Services
{
    public interface IAuthService
    {
        Task<User?> ValidateUserAsync(string email, string password);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> CreateUserAsync(User user, string password);
        Task<bool> UpdatePasswordAsync(int userId, string newPassword);
    }
}