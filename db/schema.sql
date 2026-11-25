-- db/schema.sql
-- Creates the tables for the Job Application Tracker app.
-- Run this in your own database (<NetID>_myapp), not in the class datasets.

-- Drop child table first because it has a foreign key pointing to Companies.
IF OBJECT_ID('dbo.Applications', 'U') IS NOT NULL
  DROP TABLE dbo.Applications;

IF OBJECT_ID('dbo.Companies', 'U') IS NOT NULL
  DROP TABLE dbo.Companies;

-- Companies stores one row per company the student applied to.
CREATE TABLE dbo.Companies (
  CompanyID INT IDENTITY(1,1) PRIMARY KEY,
  CompanyName NVARCHAR(100) NOT NULL
);

-- Applications stores one row per job application.
-- CompanyID is a foreign key: it must match a CompanyID in Companies.
CREATE TABLE dbo.Applications (
  ApplicationID INT IDENTITY(1,1) PRIMARY KEY,
  CompanyID INT NOT NULL,
  RoleTitle NVARCHAR(100) NOT NULL,
  DateApplied DATE NOT NULL,
  Status NVARCHAR(20) NOT NULL,
  Notes NVARCHAR(255) NULL,
  CONSTRAINT FK_Applications_Companies
    FOREIGN KEY (CompanyID) REFERENCES dbo.Companies(CompanyID)
);
