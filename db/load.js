// db/load.js
// Creates the app tables in your own database and fills them with made-up data.
// Run with: node db/load.js
//
// This script:
// 1. Connects to the database named in .env (your <NetID>_myapp database).
// 2. Runs db/schema.sql to drop old tables and create fresh ones.
// 3. Inserts 20 companies and 20 job applications.

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const dbConfig = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT || 1433),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: { encrypt: true, trustServerCertificate: true }
};

const companies = [
  'Microsoft',
  'Amazon',
  'Google',
  'Meta',
  'Apple',
  'Salesforce',
  'Tableau',
  'Adobe',
  'Netflix',
  'Airbnb',
  'Stripe',
  'Snowflake',
  'LinkedIn',
  'Spotify',
  'Uber',
  'TikTok',
  'Pinterest',
  'Dropbox',
  'Redfin',
  'Zillow'
];

const applications = [
  { companyIndex: 0, role: 'Product Manager Intern', date: '2026-10-02', status: 'Applied', notes: 'Submitted through company career site.' },
  { companyIndex: 1, role: 'Software Development Engineer Intern', date: '2026-09-24', status: 'Interview', notes: 'Phone screen scheduled for next week.' },
  { companyIndex: 2, role: 'Associate Product Manager Intern', date: '2026-09-18', status: 'Applied', notes: 'Referral submitted by alumni contact.' },
  { companyIndex: 3, role: 'Data Engineer Intern', date: '2026-09-30', status: 'Rejected', notes: 'Received rejection email after resume screen.' },
  { companyIndex: 4, role: 'UX Design Intern', date: '2026-10-05', status: 'Applied', notes: 'Portfolio link included in application.' },
  { companyIndex: 5, role: 'Software Engineering Intern', date: '2026-09-12', status: 'Interview', notes: 'Completed first-round technical interview.' },
  { companyIndex: 6, role: 'Data Analyst Intern', date: '2026-09-10', status: 'Offer', notes: 'Offer received; deciding by Friday.' },
  { companyIndex: 7, role: 'Product Marketing Intern', date: '2026-09-28', status: 'Applied', notes: 'Waiting for recruiter response.' },
  { companyIndex: 8, role: 'Backend Engineering Intern', date: '2026-09-15', status: 'Rejected', notes: 'Position filled before interview stage.' },
  { companyIndex: 9, role: 'Data Science Intern', date: '2026-10-01', status: 'Applied', notes: 'Applied with updated resume and cover letter.' },
  { companyIndex: 10, role: 'Platform Engineering Intern', date: '2026-09-20', status: 'Interview', notes: 'Preparing for onsite coding interview.' },
  { companyIndex: 11, role: 'Analytics Engineering Intern', date: '2026-09-22', status: 'Applied', notes: 'Recruiter viewed application on LinkedIn.' },
  { companyIndex: 12, role: 'Technical Program Manager Intern', date: '2026-09-08', status: 'Offer', notes: 'Verbal offer received; written offer pending.' },
  { companyIndex: 13, role: 'Machine Learning Intern', date: '2026-09-25', status: 'Rejected', notes: 'Team moved forward with other candidates.' },
  { companyIndex: 14, role: 'Mobile Engineering Intern', date: '2026-09-27', status: 'Applied', notes: 'Submitted coding assessment.' },
  { companyIndex: 15, role: 'Frontend Engineering Intern', date: '2026-09-14', status: 'Interview', notes: 'Second round scheduled with hiring manager.' },
  { companyIndex: 16, role: 'Product Analyst Intern', date: '2026-10-03', status: 'Applied', notes: 'Application submitted after info session.' },
  { companyIndex: 17, role: 'Security Engineering Intern', date: '2026-09-11', status: 'Rejected', notes: 'Not selected after technical screen.' },
  { companyIndex: 18, role: 'Business Intelligence Intern', date: '2026-09-19', status: 'Interview', notes: 'Case interview completed; awaiting feedback.' },
  { companyIndex: 19, role: 'Software Engineering Intern', date: '2026-09-16', status: 'Offer', notes: 'Accepted offer and signed paperwork.' }
];

async function main() {
  let pool;
  try {
    console.log('Connecting to database...');
    pool = await sql.connect(dbConfig);
    console.log('Connected to', process.env.DB_NAME);

    // Read the schema file and run it to create fresh tables.
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Creating tables from db/schema.sql...');
    await pool.request().batch(schemaSql);
    console.log('Tables created.');

    // Insert companies. We insert one at a time so IDs stay in a predictable order.
    console.log('Inserting companies...');
    for (const name of companies) {
      await pool.request()
        .input('CompanyName', sql.NVarChar(100), name)
        .query('INSERT INTO dbo.Companies (CompanyName) VALUES (@CompanyName)');
    }
    console.log(`Inserted ${companies.length} companies.`);

    // Insert applications. CompanyIndex + 1 matches the IDENTITY IDs created above.
    console.log('Inserting applications...');
    for (const app of applications) {
      await pool.request()
        .input('CompanyID', sql.Int, app.companyIndex + 1)
        .input('RoleTitle', sql.NVarChar(100), app.role)
        .input('DateApplied', sql.NVarChar(10), app.date)
        .input('Status', sql.NVarChar(20), app.status)
        .input('Notes', sql.NVarChar(255), app.notes)
        .query(`
          INSERT INTO dbo.Applications (CompanyID, RoleTitle, DateApplied, Status, Notes)
          VALUES (@CompanyID, @RoleTitle, @DateApplied, @Status, @Notes)
        `);
    }
    console.log(`Inserted ${applications.length} applications.`);

    console.log('Done. Your tables are ready.');
  } catch (err) {
    console.error('Error loading data:', err.message);
    process.exitCode = 1;
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

main();
