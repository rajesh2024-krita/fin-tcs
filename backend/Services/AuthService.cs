using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Data;
using MemberManagementAPI.Models;
using MemberManagementAPI.Controllers;

namespace MemberManagementAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;

        public AuthService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Society)
                .FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Society)
                .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);
        }

        public async Task<object> CreateUserAsync(RegisterRequest request)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Mobile = request.Mobile,
                Role = request.Role,
                SocietyId = request.SocietyId,
                IsActive = true,
                CreatedDate = DateTime.UtcNow,
                PasswordHash = "simple-hash" // Simple placeholder
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new
            {
                id = user.Id,
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email,
                mobile = user.Mobile,
                role = user.Role,
                societyId = user.SocietyId,
                message = "User created successfully"
            };
        }
    }
}