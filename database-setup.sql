-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'MemberManagementDB')
BEGIN
    CREATE DATABASE MemberManagementDB;
END
GO

USE MemberManagementDB;
GO

-- Create Members Table
CREATE TABLE Members (
   Id INT IDENTITY(1,1) PRIMARY KEY,
   MemberNo NVARCHAR(50) NOT NULL UNIQUE,
   Name NVARCHAR(100) NOT NULL,
   FHName NVARCHAR(100) NOT NULL,
   DateOfBirth DATETIME2 NULL,
   Mobile NVARCHAR(10) NULL,
   Email NVARCHAR(100) NULL,
   Designation NVARCHAR(100) NULL,
   DOJJob DATETIME2 NULL,
   DORetirement DATETIME2 NULL,
   Branch NVARCHAR(100) NULL,
   DOJSociety DATETIME2 NULL,
   OfficeAddress NVARCHAR(500) NULL,
   ResidenceAddress NVARCHAR(500) NULL,
   City NVARCHAR(100) NULL,
   PhoneOffice NVARCHAR(15) NULL,
   PhoneResidence NVARCHAR(15) NULL,
   Nominee NVARCHAR(100) NULL,
   NomineeRelation NVARCHAR(50) NULL,
   ShareAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
   CDAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
   BankName NVARCHAR(100) NULL,
   PayableAt NVARCHAR(100) NULL,
   AccountNo NVARCHAR(50) NULL,
   Status NVARCHAR(20) NULL DEFAULT 'Active',
   Date DATETIME2 NULL,
   PhotoPath NVARCHAR(500) NULL,
   SignaturePath NVARCHAR(500) NULL,
   ShareDeduction DECIMAL(18,2) NULL,
   Withdrawal DECIMAL(18,2) NULL,
   GLoanInstalment DECIMAL(18,2) NULL,
   ELoanInstalment DECIMAL(18,2) NULL,
   CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
   UpdatedDate DATETIME2 NULL
);
GO

-- Create Index on MemberNo for better performance
CREATE UNIQUE INDEX IX_Members_MemberNo ON Members(MemberNo);
GO

-- Add Email validation constraint
ALTER TABLE Members ADD CONSTRAINT CK_Members_Email CHECK (Email LIKE '%@%.%' OR Email IS NULL);
GO

-- Insert sample data (optional)
INSERT INTO Members (MemberNo, Name, FHName, Email, Mobile, ShareAmount, CDAmount, Status, CreatedDate)
VALUES
    ('MEM001', 'John Doe', 'Robert Doe', 'john.doe@email.com', '1234567890', 1000.00, 500.00, 'Active', GETUTCDATE()),
    ('MEM002', 'Jane Smith', 'William Smith', 'jane.smith@email.com', '0987654321', 1500.00, 750.00, 'Active', GETUTCDATE()),
    ('MEM003', 'Michael Johnson', 'David Johnson', 'michael.j@email.com', '5551234567', 2000.00, 1000.00, 'Active', GETUTCDATE());
GO

-- Verify the table structure
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Members'
ORDER BY ORDINAL_POSITION;
GO
-- Member Management System Database Setup Script

-- Create Users Table
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL, -- Changed to allow plain password
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('SuperAdmin', 'SocietyAdmin', 'User')),
    SocietyId INT NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

-- Create Societies Table
CREATE TABLE Societies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    RegistrationNo NVARCHAR(50) NOT NULL UNIQUE,
    Address NVARCHAR(500) NULL,
    City NVARCHAR(100) NULL,
    State NVARCHAR(100) NULL,
    PinCode NVARCHAR(10) NULL,
    Phone NVARCHAR(15) NULL,
    Email NVARCHAR(100) NULL,
    ContactPerson NVARCHAR(100) NULL,
    EstablishedDate DATETIME2 NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL
);

-- Create SocietyChangeRequests Table
CREATE TABLE SocietyChangeRequests (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SocietyId INT NOT NULL,
    ChangedData NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Approved', 'Rejected')),
    RequestedBy INT NOT NULL,
    RequestedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Remarks NVARCHAR(500) NULL,
    FOREIGN KEY (SocietyId) REFERENCES Societies(Id),
    FOREIGN KEY (RequestedBy) REFERENCES Users(Id)
);

-- Create ChangeApprovalLogs Table
CREATE TABLE ChangeApprovalLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ChangeRequestId INT NOT NULL,
    ApprovedBy INT NOT NULL,
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Approved', 'Rejected')),
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Remarks NVARCHAR(500) NULL,
    FOREIGN KEY (ChangeRequestId) REFERENCES SocietyChangeRequests(Id),
    FOREIGN KEY (ApprovedBy) REFERENCES Users(Id)
);

-- Re-create Members Table (redundant but present in original)
CREATE TABLE Members (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SocietyId INT NULL,
    MemberNo NVARCHAR(50) NOT NULL UNIQUE,
    Name NVARCHAR(100) NOT NULL,
    FHName NVARCHAR(100) NOT NULL,
    DateOfBirth DATETIME2 NULL,
    Mobile NVARCHAR(10) NULL,
    Email NVARCHAR(100) NULL,
    Designation NVARCHAR(100) NULL,
    DOJJob DATETIME2 NULL,
    DORetirement DATETIME2 NULL,
    Branch NVARCHAR(100) NULL,
    DOJSociety DATETIME2 NULL,
    OfficeAddress NVARCHAR(500) NULL,
    ResidenceAddress NVARCHAR(500) NULL,
    City NVARCHAR(100) NULL,
    PhoneOffice NVARCHAR(15) NULL,
    PhoneResidence NVARCHAR(15) NULL,
    Nominee NVARCHAR(100) NULL,
    NomineeRelation NVARCHAR(50) NULL,
    ShareAmount DECIMAL(18,2) NOT NULL,
    CDAmount DECIMAL(18,2) NOT NULL,
    BankName NVARCHAR(100) NULL,
    PayableAt NVARCHAR(100) NULL,
    AccountNo NVARCHAR(50) NULL,
    Status NVARCHAR(20) NULL,
    Date DATETIME2 NULL,
    PhotoPath NVARCHAR(500) NULL,
    SignaturePath NVARCHAR(500) NULL,
    ShareDeduction DECIMAL(18,2) NULL,
    Withdrawal DECIMAL(18,2) NULL,
    GLoanInstalment DECIMAL(18,2) NULL,
    ELoanInstalment DECIMAL(18,2) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    FOREIGN KEY (SocietyId) REFERENCES Societies(Id)
);

-- Create Loans Table
CREATE TABLE Loans (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    MemberId INT NOT NULL,
    SocietyId INT NOT NULL,
    LoanNo NVARCHAR(50) NOT NULL UNIQUE,
    Amount DECIMAL(18,2) NOT NULL,
    InterestRate DECIMAL(5,2) NOT NULL,
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (Status IN ('Active', 'Closed', 'Defaulted')),
    LoanType NVARCHAR(100) NULL,
    Purpose NVARCHAR(500) NULL,
    Guarantor NVARCHAR(100) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    FOREIGN KEY (MemberId) REFERENCES Members(Id),
    FOREIGN KEY (SocietyId) REFERENCES Societies(Id)
);

-- Create Demands Table
CREATE TABLE Demands (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SocietyId INT NOT NULL,
    DemandNo NVARCHAR(50) NOT NULL UNIQUE,
    DemandType NVARCHAR(100) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    DueDate DATETIME2 NOT NULL,
    Description NVARCHAR(500) NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Paid', 'Overdue')),
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    FOREIGN KEY (SocietyId) REFERENCES Societies(Id)
);

-- Create Vouchers Table
CREATE TABLE Vouchers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SocietyId INT NOT NULL,
    VoucherNo NVARCHAR(50) NOT NULL UNIQUE,
    VoucherType NVARCHAR(100) NOT NULL CHECK (VoucherType IN ('Receipt', 'Payment', 'Journal')),
    Details NVARCHAR(500) NOT NULL,
    Debit DECIMAL(18,2) NULL,
    Credit DECIMAL(18,2) NULL,
    VoucherDate DATETIME2 NOT NULL,
    Reference NVARCHAR(100) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    FOREIGN KEY (SocietyId) REFERENCES Societies(Id)
);

-- Create LoanReceipts Table
CREATE TABLE LoanReceipts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    LoanId INT NOT NULL,
    ReceiptNo NVARCHAR(50) NOT NULL UNIQUE,
    AmountPaid DECIMAL(18,2) NOT NULL,
    PrincipalAmount DECIMAL(18,2) NULL,
    InterestAmount DECIMAL(18,2) NULL,
    PaymentDate DATETIME2 NOT NULL,
    PaymentMode NVARCHAR(100) NULL,
    Remarks NVARCHAR(500) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    FOREIGN KEY (LoanId) REFERENCES Loans(Id)
);

-- Add Foreign Key Constraints
ALTER TABLE Users ADD CONSTRAINT FK_Users_Societies FOREIGN KEY (SocietyId) REFERENCES Societies(Id);

-- Create Indexes for better performance
CREATE INDEX IX_Members_SocietyId ON Members(SocietyId);
CREATE INDEX IX_Loans_MemberId ON Loans(MemberId);
CREATE INDEX IX_Loans_SocietyId ON Loans(SocietyId);
CREATE INDEX IX_LoanReceipts_LoanId ON LoanReceipts(LoanId);
CREATE INDEX IX_Demands_SocietyId ON Demands(SocietyId);
CREATE INDEX IX_Vouchers_SocietyId ON Vouchers(SocietyId);
CREATE INDEX IX_Users_SocietyId ON Users(SocietyId);

-- Insert Sample Data
-- Insert Super Admin User with plain password
INSERT INTO Users (Username, PasswordHash, Role, SocietyId, CreatedDate, IsActive)
VALUES ('superadmin', 'password', 'SuperAdmin', 1, GETDATE(), 1);

-- Insert Sample Societies
INSERT INTO Societies (Name, RegistrationNo, Address, Phone, Email, EstablishedDate, ContactNumber, IsActive)
VALUES ('Default Society', 'REG001', '123 Society Street', '9876543210', 'admin@society.com', GETDATE(), '9876543210', 1);

-- Insert Society Admin Users (Password: Admin@123) - Keeping original structure for other users if needed
INSERT INTO Users (Username, PasswordHash, Role, SocietyId, IsActive) VALUES
('abcadmin', 'AQAAAAEAACcQAAAAEGJZmEqXNzXZ1s8G3J8iNOXHZX9XL2YhQa3JWMK8JMZaNvWlJ8wEz3s1KF4cGD9tpw==', 'SocietyAdmin', 1, 1),
('xyzadmin', 'AQAAAAEAACcQAAAAEGJZmEqXNzXZ1s8G3J8iNOXHZX9XL2YhQa3JWMK8JMZaNvWlJ8wEz3s1KF4cGD9tpw==', 'SocietyAdmin', 2, 1);

-- Insert Regular Users (Password: User@123)
INSERT INTO Users (Username, PasswordHash, Role, SocietyId, IsActive) VALUES
('user1', 'AQAAAAEAACcQAAAAEBJZmEqXNzXZ1s8G3J8iNOXHZX9XL2YhQa3JWMK8JMZaNvWlJ8wEz3s1KF4cGD9tpw==', 'User', 1, 1),
('user2', 'AQAAAAEAACcQAAAAEBJZmEqXNzXZ1s8G3J8iNOXHZX9XL2YhQa3JWMK8JMZaNvWlJ8wEz3s1KF4cGD9tpw==', 'User', 2, 1);

-- Insert Sample Members (using existing data)
INSERT INTO Members (SocietyId, MemberNo, Name, FHName, DateOfBirth, Mobile, Email, ShareAmount, CDAmount, Status) VALUES
(1, 'MEM001', 'Rajesh Kumar', 'S/O Ramesh Kumar', '1985-05-15', '9876543212', 'rajesh@email.com', 10000.00, 5000.00, 'Active'),
(1, 'MEM002', 'Priya Sharma', 'D/O Suresh Sharma', '1990-08-20', '9876543213', 'priya@email.com', 15000.00, 8000.00, 'Active'),
(2, 'MEM003', 'Amit Singh', 'S/O Vijay Singh', '1988-12-10', '9876543214', 'amit@email.com', 12000.00, 6000.00, 'Active');

-- Insert Sample Loans (using existing data)
INSERT INTO Loans (MemberId, SocietyId, LoanNo, Amount, InterestRate, StartDate, LoanType, Purpose) VALUES
(1, 1, 'LOAN001', 100000.00, 12.00, '2024-01-01', 'Personal Loan', 'Home renovation'),
(2, 1, 'LOAN002', 50000.00, 10.00, '2024-02-01', 'Education Loan', 'Child education'),
(3, 2, 'LOAN003', 75000.00, 11.00, '2024-03-01', 'Business Loan', 'Business expansion');

-- Insert Sample Demands (using existing data)
INSERT INTO Demands (SocietyId, DemandNo, DemandType, Amount, DueDate, Description) VALUES
(1, 'DEM001', 'Monthly Contribution', 5000.00, '2024-12-31', 'Monthly society contribution'),
(2, 'DEM002', 'Maintenance Fee', 3000.00, '2024-12-31', 'Society maintenance fee');

-- Insert Sample Vouchers (using existing data)
INSERT INTO Vouchers (SocietyId, VoucherNo, VoucherType, Details, Debit, Credit, VoucherDate) VALUES
(1, 'VOUCH001', 'Receipt', 'Member contribution received', NULL, 5000.00, '2024-01-15'),
(2, 'VOUCH002', 'Payment', 'Office rent payment', 10000.00, NULL, '2024-01-20');

-- Insert Sample Loan Receipts (using existing data)
INSERT INTO LoanReceipts (LoanId, ReceiptNo, AmountPaid, PrincipalAmount, InterestAmount, PaymentDate, PaymentMode) VALUES
(1, 'REC001', 10000.00, 8000.00, 2000.00, '2024-02-01', 'Bank Transfer'),
(2, 'REC002', 5000.00, 4000.00, 1000.00, '2024-03-01', 'Cash'),
(3, 'REC003', 7500.00, 6000.00, 1500.00, '2024-04-01', 'Cheque');

PRINT 'Database setup completed successfully!';