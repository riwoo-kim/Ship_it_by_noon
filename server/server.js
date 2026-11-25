// server/server.js
// This file starts the Express web server for the Job Application Tracker.
// It does two jobs:
// 1. Serves the files in the web/ folder (the page, CSS, and browser JS).
// 2. Provides /api/applications, which runs a SQL query and returns JSON.

require('dotenv').config();
const express = require('express');
const path = require('path');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 3000;

// These settings come from .env. They tell the app how to connect to SQL Server.
// The password stays in .env, not in this file.
const dbConfig = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT || 1433),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: { encrypt: true, trustServerCertificate: true }
};

// Create one connection pool when the server starts.
// A pool reuses connections so each request does not open a brand new one.
let poolPromise = sql.connect(dbConfig)
  .then((pool) => {
    console.log('Connected to database:', process.env.DB_NAME);
    return pool;
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    throw err;
  });

// API route: returns job applications, optionally filtered by status.
// Example: /api/applications?status=Interview
app.get('/api/applications', async (req, res) => {
  // Read the status value the user picked. Default to "All".
  const status = req.query.status || 'All';

  // Only allow known status values. This keeps the input predictable.
  const allowedStatuses = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status filter.' });
  }

  try {
    const pool = await poolPromise;

    // The @Status value is sent as a parameter, not pasted into the SQL string.
    // This is important for safety: user input should never be concatenated into SQL.
    const result = await pool.request()
      .input('Status', sql.NVarChar(20), status)
      .query(`
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
        ORDER BY a.DateApplied DESC, a.ApplicationID DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error running query:', err.message);
    res.status(500).json({ error: 'Could not load applications.' });
  }
});

// Serve everything inside the web/ folder as static files.
// When someone visits /, Express will send web/index.html.
const webDir = path.join(__dirname, '..', 'web');
app.use(express.static(webDir));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
