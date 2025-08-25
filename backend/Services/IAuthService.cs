
using MemberManagementAPI.Models;
using MemberManagementAPI.Controllers;

namespace MemberManagementAPI.Services
{
    public interface IAuthService
    {
        Task<object?> LoginAsync(string email, string password);
        Task<object> RegisterAsync(RegisterRequest request, int currentUserId, string currentUserRole);
        Task<User?> GetUserByIdAsync(int userId);
    }
}
