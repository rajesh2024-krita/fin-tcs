
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using MemberManagementAPI.Models;

namespace MemberManagementAPI.Data
{
    public static class SqliteDbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // Check if we already have data
            if (context.Societies.Any())
            {
                return; // DB has been seeded
            }

            // Create Societies
            var societies = new Society[]
            {
                new Society
                {
                    Name = "ABC Cooperative Society",
                    Code = "ABC001",
                    Address = "123 Main Street",
                    City = "Mumbai",
                    State = "Maharashtra",
                    PinCode = "400001",
                    Phone = "022-12345678",
                    Email = "info@abcsociety.com",
                    RegistrationNo = "REG001",
                    EstablishedDate = new DateTime(2010, 1, 1),
                    IsActive = true
                },
                new Society
                {
                    Name = "XYZ Credit Society",
                    Code = "XYZ002",
                    Address = "456 Oak Avenue",
                    City = "Delhi",
                    State = "Delhi",
                    PinCode = "110001",
                    Phone = "011-87654321",
                    Email = "contact@xyzsociety.com",
                    RegistrationNo = "REG002",
                    EstablishedDate = new DateTime(2015, 6, 15),
                    IsActive = true
                }
            };

            context.Societies.AddRange(societies);
            context.SaveChanges();

            // Create Users
            var users = new User[]
            {
                new User
                {
                    FirstName = "Super",
                    LastName = "Admin",
                    Email = "superadmin@system.com",
                    Mobile = "9999999999",
                    PasswordHash = HashPassword("SuperAdmin123!"),
                    Role = "SuperAdmin",
                    SocietyId = null,
                    IsActive = true
                },
                new User
                {
                    FirstName = "ABC",
                    LastName = "Admin",
                    Email = "admin@abcsociety.com",
                    Mobile = "9888888888",
                    PasswordHash = HashPassword("Admin123!"),
                    Role = "SocietyAdmin",
                    SocietyId = societies[0].Id,
                    IsActive = true
                },
                new User
                {
                    FirstName = "XYZ",
                    LastName = "Admin",
                    Email = "admin@xyzsociety.com",
                    Mobile = "9777777777",
                    PasswordHash = HashPassword("Admin123!"),
                    Role = "SocietyAdmin",
                    SocietyId = societies[1].Id,
                    IsActive = true
                },
                new User
                {
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@abcsociety.com",
                    Mobile = "9666666666",
                    PasswordHash = HashPassword("User123!"),
                    Role = "User",
                    SocietyId = societies[0].Id,
                    IsActive = true
                },
                new User
                {
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane.smith@xyzsociety.com",
                    Mobile = "9555555555",
                    PasswordHash = HashPassword("User123!"),
                    Role = "Accountant",
                    SocietyId = societies[1].Id,
                    IsActive = true
                }
            };

            context.Users.AddRange(users);
            context.SaveChanges();

            // Create Members
            var members = new Member[]
            {
                new Member
                {
                    MemberNo = "ABC001",
                    Name = "Rajesh Kumar",
                    FHName = "Ram Kumar",
                    DateOfBirth = new DateTime(1980, 5, 15),
                    Mobile = "9876543210",
                    Email = "rajesh.kumar@email.com",
                    Designation = "Software Engineer",
                    DOJJob = new DateTime(2005, 3, 1),
                    Branch = "IT Department",
                    DOJSociety = new DateTime(2010, 6, 1),
                    OfficeAddress = "Tech Park, Sector 5",
                    ResidenceAddress = "123 Residential Complex",
                    City = "Mumbai",
                    PhoneOffice = "022-11111111",
                    PhoneResidence = "022-22222222",
                    Nominee = "Priya Kumar",
                    NomineeRelation = "Wife",
                    ShareAmount = 50000.00m,
                    CDAmount = 25000.00m,
                    BankName = "HDFC Bank",
                    PayableAt = "Mumbai Branch",
                    AccountNo = "123456789",
                    Status = "Active",
                    Date = DateTime.UtcNow,
                    SocietyId = societies[0].Id
                },
                new Member
                {
                    MemberNo = "ABC002",
                    Name = "Priya Sharma",
                    FHName = "Suresh Sharma",
                    DateOfBirth = new DateTime(1985, 8, 20),
                    Mobile = "9876543211",
                    Email = "priya.sharma@email.com",
                    Designation = "Manager",
                    DOJJob = new DateTime(2008, 7, 1),
                    Branch = "HR Department",
                    DOJSociety = new DateTime(2011, 4, 15),
                    OfficeAddress = "Business Center, Floor 3",
                    ResidenceAddress = "456 Garden Society",
                    City = "Mumbai",
                    PhoneOffice = "022-33333333",
                    PhoneResidence = "022-44444444",
                    Nominee = "Rahul Sharma",
                    NomineeRelation = "Husband",
                    ShareAmount = 75000.00m,
                    CDAmount = 40000.00m,
                    BankName = "ICICI Bank",
                    PayableAt = "Mumbai Branch",
                    AccountNo = "987654321",
                    Status = "Active",
                    Date = DateTime.UtcNow,
                    SocietyId = societies[0].Id
                },
                new Member
                {
                    MemberNo = "XYZ001",
                    Name = "Amit Patel",
                    FHName = "Vijay Patel",
                    DateOfBirth = new DateTime(1982, 12, 10),
                    Mobile = "9876543212",
                    Email = "amit.patel@email.com",
                    Designation = "Senior Analyst",
                    DOJJob = new DateTime(2006, 1, 15),
                    Branch = "Finance Department",
                    DOJSociety = new DateTime(2015, 8, 1),
                    OfficeAddress = "Corporate Tower, Level 8",
                    ResidenceAddress = "789 Metro Heights",
                    City = "Delhi",
                    PhoneOffice = "011-55555555",
                    PhoneResidence = "011-66666666",
                    Nominee = "Sita Patel",
                    NomineeRelation = "Wife",
                    ShareAmount = 60000.00m,
                    CDAmount = 30000.00m,
                    BankName = "SBI",
                    PayableAt = "Delhi Branch",
                    AccountNo = "456789123",
                    Status = "Active",
                    Date = DateTime.UtcNow,
                    SocietyId = societies[1].Id
                },
                new Member
                {
                    MemberNo = "XYZ002",
                    Name = "Sunita Gupta",
                    FHName = "Mohan Gupta",
                    DateOfBirth = new DateTime(1978, 3, 25),
                    Mobile = "9876543213",
                    Email = "sunita.gupta@email.com",
                    Designation = "Team Lead",
                    DOJJob = new DateTime(2003, 9, 1),
                    Branch = "Operations",
                    DOJSociety = new DateTime(2016, 2, 20),
                    OfficeAddress = "IT Complex, Block A",
                    ResidenceAddress = "321 New Colony",
                    City = "Delhi",
                    PhoneOffice = "011-77777777",
                    PhoneResidence = "011-88888888",
                    Nominee = "Ravi Gupta",
                    NomineeRelation = "Son",
                    ShareAmount = 45000.00m,
                    CDAmount = 20000.00m,
                    BankName = "Axis Bank",
                    PayableAt = "Delhi Branch",
                    AccountNo = "789123456",
                    Status = "Active",
                    Date = DateTime.UtcNow,
                    SocietyId = societies[1].Id
                },
                new Member
                {
                    MemberNo = "ABC003",
                    Name = "Vikram Singh",
                    FHName = "Jagdish Singh",
                    DateOfBirth = new DateTime(1987, 11, 5),
                    Mobile = "9876543214",
                    Email = "vikram.singh@email.com",
                    Designation = "Executive",
                    DOJJob = new DateTime(2010, 4, 1),
                    Branch = "Sales",
                    DOJSociety = new DateTime(2012, 10, 1),
                    OfficeAddress = "Sales Center, Ground Floor",
                    ResidenceAddress = "654 Park View",
                    City = "Mumbai",
                    PhoneOffice = "022-99999999",
                    PhoneResidence = "022-10101010",
                    Nominee = "Neha Singh",
                    NomineeRelation = "Wife",
                    ShareAmount = 35000.00m,
                    CDAmount = 15000.00m,
                    BankName = "Bank of Baroda",
                    PayableAt = "Mumbai Branch",
                    AccountNo = "147258369",
                    Status = "Active",
                    Date = DateTime.UtcNow,
                    SocietyId = societies[0].Id
                }
            };

            context.Members.AddRange(members);
            context.SaveChanges();
        }

        private static string HashPassword(string password)
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
    }
}
