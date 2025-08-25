
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using MemberManagementAPI.Data;
using MemberManagementAPI.Models;
using MemberManagementAPI.Controllers;

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

        public async Task<object?> LoginAsync(string email, string password)
        {
            var user = await _context.Users
                .Include(u => u.Society)
                .FirstOrDefaultAsync(u => u.Email == email && u.IsActive);

            if (user == null || !VerifyPassword(password, user.PasswordHash))
            {
                return null;
            }

            var token = GenerateJwtToken(user);

            return new
            {
                token,
                user = new
                {
                    id = user.Id,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email,
                    mobile = user.Mobile,
                    role = user.Role,
                    societyId = user.SocietyId,
                    society = user.Society?.Name
                }
            };
        }

        public async Task<object> RegisterAsync(RegisterRequest request, int currentUserId, string currentUserRole)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            // Role-based validation
            ValidateRolePermission(currentUserRole, request.Role, request.SocietyId);

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Mobile = request.Mobile,
                PasswordHash = HashPassword(request.Password),
                Role = request.Role,
                SocietyId = request.SocietyId,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
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
                message = "User registered successfully"
            };
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Society)
                .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);
        }

        private void ValidateRolePermission(string currentUserRole, string targetRole, int? societyId)
        {
            if (currentUserRole == "SuperAdmin")
            {
                // SuperAdmin can create any role
                return;
            }

            if (currentUserRole == "SocietyAdmin")
            {
                // SocietyAdmin can create User, Accountant, Member roles only
                var allowedRoles = new[] { "User", "Accountant", "Member" };
                if (!allowedRoles.Contains(targetRole))
                {
                    throw new UnauthorizedAccessException("You cannot create users with this role");
                }

                if (societyId == null)
                {
                    throw new ArgumentException("Society ID is required");
                }
            }
            else
            {
                throw new UnauthorizedAccessException("You do not have permission to create users");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Key"] ?? "your-secret-key");
            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new List<Claim>
            {
                new Claim("sub", user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("role", user.Role),
                new Claim(ClaimTypes.Name, user.FullName)
            };

            if (user.SocietyId.HasValue)
            {
                claims.Add(new Claim("SocietyId", user.SocietyId.Value.ToString()));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            byte[] salt = new byte[16];
            rng.GetBytes(salt);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            byte[] hash = pbkdf2.GetBytes(32);

            byte[] hashBytes = new byte[48];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);

            return Convert.ToBase64String(hashBytes);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            byte[] hashBytes = Convert.FromBase64String(storedHash);
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            byte[] hash = pbkdf2.GetBytes(32);

            for (int i = 0; i < 32; i++)
            {
                if (hashBytes[i + 16] != hash[i])
                    return false;
            }
            return true;
        }
    }
}
