-- db/queries.sql
-- Query that answers the app's user story:
-- "As a college student applying for jobs, I need to track my submitted
-- applications and statuses in one place, so that I can stay organized."
--
-- The user picks a status filter: Applied, Interview, Offer, Rejected, or All.
-- @Status is a parameter. In the real app, the server sends the user's choice
-- as a parameter instead of pasting it into the SQL string.

DECLARE @Status NVARCHAR(20) = 'All';

SELECT TOP (100)
  a.ApplicationID,
  c.CompanyName,
  a.RoleTitle,
  CONVERT(char(10), a.DateApplied, 23) AS DateApplied,
  a.Status,
  a.Notes
FROM dbo.Applications AS a
JOIN dbo.Companies AS c
  ON a.CompanyID = c.CompanyID
WHERE @Status = 'All' OR a.Status = @Status
ORDER BY a.DateApplied DESC, a.ApplicationID DESC;
