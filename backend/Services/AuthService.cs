
using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Data;
using MemberManagementAPI.Models;
using MemberManagementAPI.Models.DTOs;

namespace MemberManagementAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .Include(u => u.Society)
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username && u.IsActive);

            if (user == null || user.PasswordHash != loginDto.Password)
            {
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            var userDto = MapToUserDto(user);

            return new AuthResponseDto
            {
                Token = "simple-auth-token",
                User = userDto
            };
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto, int currentUserId)
        {
            var currentUser = await GetUserByIdAsync(currentUserId);
            if (currentUser == null)
            {
                throw new UnauthorizedAccessException("Current user not found");
            }

            // Role-based access control
            if (currentUser.Role == "SocietyAdmin")
            {
                if (createUserDto.Role == "SuperAdmin" || createUserDto.SocietyId != currentUser.SocietyId)
                {
                    throw new UnauthorizedAccessException("Society admin can only create users for their society");
                }
            }
            else if (currentUser.Role != "SuperAdmin")
            {
                throw new UnauthorizedAccessException("Insufficient permissions");
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == createUserDto.Username);
            if (existingUser != null)
            {
                throw new InvalidOperationException("Username already exists");
            }

            var user = new User
            {
                Username = createUserDto.Username,
                PasswordHash = createUserDto.Password,
                Role = createUserDto.Role,
                SocietyId = createUserDto.SocietyId
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return await GetUserByIdAsync(user.Id) ?? throw new InvalidOperationException("Failed to create user");
        }

        public Task<string> GenerateJwtTokenAsync(UserDto user)
        {
            return Task.FromResult("simple-auth-token");
        }

        public async Task<bool> ValidateUserRoleAsync(int userId, string requiredRole)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);
            return user?.Role == requiredRole;
        }

        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Society)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user != null ? MapToUserDto(user) : null;
        }

        

        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                SocietyId = user.SocietyId,
                SocietyName = user.Society?.Name,
                IsActive = user.IsActive,
                CreatedDate = user.CreatedDate
            };
        }
    }
}
