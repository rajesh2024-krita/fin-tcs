
using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Models;

namespace MemberManagementAPI.Data
{
    public static class SqliteDbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Check if we already have data
            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            // Add initial data
            var defaultUser = new User
            {
                Username = "superadmin",
                PasswordHash = "password", // Plain password as requested
                Role = "SuperAdmin",
                SocietyId = null,
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            };

            context.Users.Add(defaultUser);

            var defaultSociety = new Society
            {
                Name = "Default Society",
                RegistrationNo = "REG001",
                Address = "123 Society Street",
                Phone = "9876543210",
                Email = "admin@society.com",
                EstablishedDate = DateTime.UtcNow,
                CreatedDate = DateTime.UtcNow
            };

            context.Societies.Add(defaultSociety);

            context.SaveChanges();
        }
    }
}
