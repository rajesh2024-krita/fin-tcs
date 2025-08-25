
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
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

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            var userDto = MapToUserDto(user);
            var token = await GenerateJwtTokenAsync(userDto);

            return new AuthResponseDto
            {
                Token = token,
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
                PasswordHash = HashPassword(createUserDto.Password),
                Role = createUserDto.Role,
                SocietyId = createUserDto.SocietyId
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return await GetUserByIdAsync(user.Id) ?? throw new InvalidOperationException("Failed to create user");
        }

        public async Task<string> GenerateJwtTokenAsync(UserDto user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "your-secret-key-that-is-long-enough-for-security");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            if (user.SocietyId.HasValue)
            {
                claims.Add(new Claim("SocietyId", user.SocietyId.Value.ToString()));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
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

        private string HashPassword(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[16];
            rng.GetBytes(salt);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(32);

            var hashBytes = new byte[48];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);

            return Convert.ToBase64String(hashBytes);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hashBytes = Convert.FromBase64String(storedHash);
            var salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(32);

            for (int i = 0; i < 32; i++)
            {
                if (hashBytes[i + 16] != hash[i])
                    return false;
            }

            return true;
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
