
using MemberManagementAPI.Models;
using MemberManagementAPI.Controllers;

namespace MemberManagementAPI.Services
{
    public interface IAuthService
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByIdAsync(int userId);
        Task<object> CreateUserAsync(RegisterRequest request);
    }
}
