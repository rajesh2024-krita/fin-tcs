
-- Create Database
CREATE DATABASE MemberManagementDB;
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
