using MemberManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace MemberManagementAPI.Data
{
    public static class SqliteDbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            try
            {
                // Ensure database is created
                context.Database.EnsureCreated();

                // Check if data already exists
                if (context.Users.Any())
                {
                    return; // Database has been seeded
                }

                // Seed data
                SeedData(context);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database initialization error: {ex.Message}");
                throw;
            }
        }

        private static void SeedData(ApplicationDbContext context)
        {
            try
            {
                // Add Societies first
                var societies = new[]
                {
                    new Society
                    {
                        Name = "Main Society",
                        RegistrationNo = "REG001",
                        Address = "123 Main Street",
                        Phone = "9876543210",
                        Email = "info@mainsociety.com",
                        EstablishedDate = DateTime.Now.AddYears(-5)
                    }
                };

                context.Societies.AddRange(societies);
                context.SaveChanges();

                // Add Users
                var users = new[]
                {
                    new User
                    {
                        Username = "superadmin",
                        PasswordHash = "password",
                        Role = "SuperAdmin",
                        SocietyId = 1,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    },
                    new User
                    {
                        Username = "societyadmin",
                        PasswordHash = "password",
                        Role = "SocietyAdmin",
                        SocietyId = 1,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    },
                    new User
                    {
                        Username = "accountant1",
                        PasswordHash = "password",
                        Role = "Accountant",
                        SocietyId = 1,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    },
                    new User
                    {
                        Username = "member1",
                        PasswordHash = "password",
                        Role = "Member",
                        SocietyId = 1,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    }
                };

                context.Users.AddRange(users);
                context.SaveChanges();

                // Add sample members
                var members = new[]
                {
                    new Member
                    {
                        MemberNo = "M001",
                        Name = "John Doe",
                        FatherName = "Robert Doe",
                        Address = "123 Sample Street",
                        Mobile = "9876543210",
                        Email = "john@example.com",
                        AadharNo = "123456789012",
                        PanNo = "ABCDE1234F",
                        ShareAmount = 1000,
                        CdAmount = 500,
                        JoiningDate = DateTime.Now,
                        Status = "Active",
                        SocietyId = 1,
                        CreatedDate = DateTime.Now
                    }
                };

                context.Members.AddRange(members);
                context.SaveChanges();

                Console.WriteLine("Database seeded successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Seeding error: {ex.Message}");
                throw;
            }
        }
    }
}