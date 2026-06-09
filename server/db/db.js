const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'mainframehub.db');

// Ensure db directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // 1. Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration to add role column in case table already existed
    db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'", (err) => {
      if (err) {
        if (!err.message.includes('duplicate column name')) {
          console.error('Migration error adding role column:', err.message);
        }
      } else {
        console.log('Migration: Successfully added role column to users table.');
      }
    });

    // Seed default admin user if not exists
    db.get("SELECT id FROM users WHERE username = 'admin'", (err, row) => {
      if (err) {
        console.error('Error checking admin user:', err.message);
        return;
      }
      if (!row) {
        const bcrypt = require('bcryptjs');
        bcrypt.genSalt(10, (err, salt) => {
          if (err) return console.error('Error generating salt for admin:', err.message);
          bcrypt.hash('admin123', salt, (err, hashedPassword) => {
            if (err) return console.error('Error hashing password for admin:', err.message);
            db.run(
              "INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@mainframehub.com', ?, 'admin')",
              [hashedPassword],
              (err) => {
                if (err) {
                  console.error('Error seeding admin user:', err.message);
                } else {
                  console.log('Seeded default admin user (admin / admin123) with role = admin.');
                }
              }
            );
          });
        });
      }
    });

    // Seed primary user specified admin: Dineshsingla08 / dineshsingla08@gmail.com / Abcd1234@5
    db.get("SELECT id FROM users WHERE username = 'Dineshsingla08' OR email = 'dineshsingla08@gmail.com'", (err, row) => {
      if (err) {
        console.error('Error checking Dineshsingla08 admin:', err.message);
        return;
      }
      if (!row) {
        const bcrypt = require('bcryptjs');
        bcrypt.genSalt(10, (err, salt) => {
          if (err) return console.error('Error generating salt for Dineshsingla08:', err.message);
          bcrypt.hash('Abcd1234@5', salt, (err, hashedPassword) => {
            if (err) return console.error('Error hashing password for Dineshsingla08:', err.message);
            db.run(
              "INSERT INTO users (username, email, password, role) VALUES ('Dineshsingla08', 'dineshsingla08@gmail.com', ?, 'admin')",
              [hashedPassword],
              (err) => {
                if (err) {
                  console.error('Error seeding Dineshsingla08 admin:', err.message);
                } else {
                  console.log('Seeded primary admin user (Dineshsingla08 / dineshsingla08@gmail.com) with role = admin.');
                }
              }
            );
          });
        });
      } else {
        db.run("UPDATE users SET role = 'admin' WHERE id = ?", [row.id], (err) => {
          if (err) {
            console.error('Error elevating Dineshsingla08 to admin:', err.message);
          } else {
            console.log('Ensure Dineshsingla08 user is role = admin.');
          }
        });
      }
    });

    // 2. User Progress Table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id INTEGER PRIMARY KEY,
        mastered TEXT DEFAULT '[]',
        needs_review TEXT DEFAULT '[]',
        starred TEXT DEFAULT '[]',
        score INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // 3. Forum Topics Table
    db.run(`
      CREATE TABLE IF NOT EXISTS forum_topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        likes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // 4. Forum Replies Table
    db.run(`
      CREATE TABLE IF NOT EXISTS forum_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (topic_id) REFERENCES forum_topics (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Drop obsolete tables to migrate database schema
    db.run("DROP TABLE IF EXISTS job_applications");
    db.run("DROP TABLE IF EXISTS jobs");

    // 5. Jobs Table
    db.run(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        salary TEXT,
        type TEXT,
        experience TEXT,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        portal TEXT,
        url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed jobs if empty
    db.get("SELECT COUNT(*) as count FROM jobs", (err, row) => {
      if (err) {
        console.error('Error checking jobs count:', err.message);
        return;
      }
      if (row && row.count === 0) {
        const jobsToSeed = [
          {
            title: "Senior Mainframe Developer (COBOL & DB2)",
            company: "Tata Consultancy Services (TCS)",
            location: "Bengaluru, Karnataka (Hybrid)",
            salary: "₹12,00,000 - ₹18,00,000 / yr",
            type: "Hybrid",
            experience: "Senior",
            description: "Core development of banking batch applications. Optimize JCL workflows, debug runtime abends, and develop high-volume COBOL routines referencing Db2 tables.",
            requirements: JSON.stringify([
              "6+ years COBOL and JCL experience",
              "Advanced DB2 SQL and query plan analysis",
              "Familiarity with TWS/Control-M schedulers"
            ]),
            portal: "Naukri",
            url: "https://www.naukri.com/job-listings-mainframe-developer-tata-consultancy-services-bengaluru-5-to-10-years-250524000123"
          },
          {
            title: "Mainframe System Programmer (z/OS & SMP/E)",
            company: "Kyndryl India",
            location: "Pune, Maharashtra (Onsite)",
            salary: "₹18,00,000 - ₹26,00,000 / yr",
            type: "Onsite",
            experience: "Senior",
            description: "Responsible for maintaining and configuring z/OS operating systems. Perform system installation using SMP/E, upgrade software products, and support system IPL runs.",
            requirements: JSON.stringify([
              "8+ years z/OS systems programming experience",
              "In-depth knowledge of SMP/E, HCD, and IODF",
              "Scripting skills in REXX and JCL"
            ]),
            portal: "LinkedIn",
            url: "https://www.linkedin.com/jobs/view/3927641234"
          },
          {
            title: "CICS Technical Specialist",
            company: "Cognizant",
            location: "Chennai, Tamil Nadu (Hybrid)",
            salary: "₹14,00,000 - ₹20,00,000 / yr",
            type: "Hybrid",
            experience: "Senior",
            description: "Technical expert in CICS application design. Manage online regions, define transaction definitions, configure VSAM file allocations, and resolve ASRA/AEIM abends.",
            requirements: JSON.stringify([
              "7+ years of CICS systems administration or development",
              "Strong skills in Command-level COBOL programming",
              "Db2 threads and VSAM tuning experience"
            ]),
            portal: "Naukri",
            url: "https://www.naukri.com/job-listings-mainframe-cics-developer-cognizant-technology-solutions-chennai-4-to-9-years-150624001234"
          },
          {
            title: "Mainframe DevOps Engineer (Git & DBB)",
            company: "IBM India",
            location: "Hyderabad, Telangana (Hybrid)",
            salary: "₹16,00,000 - ₹24,00,000 / yr",
            type: "Hybrid",
            experience: "Senior",
            description: "Implement modern CI/CD pipelines on IBM Z mainframes. Configure Git repositories on z/OS, integrate automated testing, and run Dependency Based Builds (DBB).",
            requirements: JSON.stringify([
              "5+ years mainframe system development or operations",
              "Hands-on experience with IBM z/OS Connect, Git, Jenkins, or DBB",
              "Strong scripting capabilities in REXX/Python"
            ]),
            portal: "LinkedIn",
            url: "https://www.linkedin.com/jobs/view/3889102947"
          },
          {
            title: "Junior COBOL Programmer",
            company: "Infosys",
            location: "Mysuru, Karnataka (Onsite)",
            salary: "₹4,50,000 - ₹7,50,000 / yr",
            type: "Onsite",
            experience: "Junior",
            description: "Assist in writing database batch programs, maintaining code libraries, and analyzing daily JCL outputs under senior developer guidance.",
            requirements: JSON.stringify([
              "1-3 years exposure to COBOL, JCL, and VSAM",
              "Basic SQL knowledge on DB2",
              "Good analytical and problem-solving skills"
            ]),
            portal: "Naukri",
            url: "https://www.naukri.com/job-listings-junior-mainframe-developer-infosys-mysore-1-to-3-years-180724000456"
          },
          {
            title: "z/OS Security Engineer (RACF)",
            company: "Wipro",
            location: "Noida, Uttar Pradesh (Hybrid)",
            salary: "₹13,50,000 - ₹19,00,000 / yr",
            type: "Hybrid",
            experience: "Mid",
            description: "Perform security configuration and administration using RACF. Set up user access permissions, manage security profiles for datasets, and perform compliance audit logs.",
            requirements: JSON.stringify([
              "4+ years experience in RACF security administration",
              "Familiarity with z/OS datasets and CICS transactions permissions",
              "Experience auditing security configurations using Vanguard or CARLa"
            ]),
            portal: "LinkedIn",
            url: "https://www.linkedin.com/jobs/view/3901124578"
          },
          {
            title: "Mainframe DB2 DBA",
            company: "Tech Mahindra",
            location: "Pune, Maharashtra (Hybrid)",
            salary: "₹15,00,000 - ₹22,00,000 / yr",
            type: "Hybrid",
            experience: "Senior",
            description: "Administer development and production DB2 databases on z/OS. Conduct tablespace allocations, query plan tuning, package binds, database REORGs, and database backup runs.",
            requirements: JSON.stringify([
              "6+ years DB2 DBA experience on mainframe platform",
              "Expertise in SQL EXPLAIN and tuning utilities",
              "Understanding of database backup, recovery, and partitioning"
            ]),
            portal: "Naukri",
            url: "https://www.naukri.com/job-listings-mainframe-db2-dba-tech-mahindra-pune-5-to-10-years-110824000789"
          },
          {
            title: "Mainframe Production Support Analyst",
            company: "Capgemini",
            location: "Mumbai, Maharashtra (Onsite)",
            salary: "₹8,00,000 - ₹13,00,000 / yr",
            type: "Onsite",
            experience: "Mid",
            description: "Perform 24/7 batch monitoring and system support. Troubleshoot JCL errors, coordinate catalog updates, release blocked scheduler queues, and execute application restarts.",
            requirements: JSON.stringify([
              "3+ years in mainframe production support environment",
              "Excellent JCL debug skills and understanding of standard system codes",
              "Experience using scheduling software like Control-M or OPC/TWS"
            ]),
            portal: "Naukri",
            url: "https://www.naukri.com/job-listings-mainframe-production-support-capgemini-mumbai-3-to-6-years-020924000999"
          },
          {
            title: "Mainframe Assembler Developer (HLASM)",
            company: "HCLTech",
            location: "Chennai, Tamil Nadu (Hybrid)",
            salary: "₹15,00,000 - ₹23,00,000 / yr",
            type: "Hybrid",
            experience: "Senior",
            description: "Maintain and optimize high-performance assembler (HLASM) code modules. Migrate legacy Assembler routines to structured COBOL and implement performance enhancements.",
            requirements: JSON.stringify([
              "5+ years HLASM (High Level Assembler) programming",
              "Strong debugging skills using IBM IDF or XPEDITER",
              "Deep understanding of z/OS assembly instructions and memory layouts"
            ]),
            portal: "LinkedIn",
            url: "https://www.linkedin.com/jobs/view/3874567812"
          },
          {
            title: "Lead Mainframe Architect",
            company: "Accenture India",
            location: "Bengaluru, Karnataka (Hybrid)",
            salary: "₹25,00,000 - ₹38,00,000 / yr",
            type: "Hybrid",
            experience: "Lead",
            description: "Lead architectural planning and modernization of core mainframe environments. Define integration solutions using z/OS Connect, REST APIs, and microservices models.",
            requirements: JSON.stringify([
              "12+ years of mainframe development and design experience",
              "Proven history of architecting hybrid-cloud z/OS API integrations",
              "Exceptional communications skills for client consultations"
            ]),
            portal: "LinkedIn",
            url: "https://www.linkedin.com/jobs/view/3899123456"
          },
          {
            title: "Mainframe Systems Developer (IMS DB/DC)",
            company: "LTIMindtree",
            location: "Chennai, Tamil Nadu (Hybrid)",
            salary: "₹11,00,000 - ₹16,50,000 / yr",
            type: "Hybrid",
            experience: "Mid",
            description: "Maintenance and development of legacy IMS DB/DC transaction modules. Implement system enhancements, perform database updates, and configure IMS transactions.",
            requirements: JSON.stringify([
              "4+ years mainframe coding using COBOL and JCL",
              "Experience with IMS DB/DC transaction calls",
              "Understanding of VSAM file models and IBM file utilities"
            ]),
            portal: "Naukri",
            url: "https://www.naukri.com/job-listings-mainframe-ims-developer-ltimindtree-chennai-3-to-7-years-220924000888"
          },
          {
            title: "Cobol Specialist (Card Payments)",
            company: "Fiserv India",
            location: "Noida, Uttar Pradesh (Hybrid)",
            salary: "₹13,00,000 - ₹19,50,000 / yr",
            type: "Hybrid",
            experience: "Mid",
            description: "Technical developer for core card processing platforms. Code rate calculation engines, configure card ledger runs, and integrate VSAM layouts with external feeds.",
            requirements: JSON.stringify([
              "5+ years in card processing or banking domains",
              "Advanced COBOL programming and JCL troubleshooting",
              "Strong understanding of VSAM files and file sharing systems"
            ]),
            portal: "Naukri",
            url: "https://www.naukri.com/job-listings-mainframe-developer-cards-fiserv-noida-4-to-8-years-051024001111"
          }
        ];

        const stmt = db.prepare("INSERT INTO jobs (title, company, location, salary, type, experience, description, requirements, portal, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        jobsToSeed.forEach(j => {
          stmt.run(j.title, j.company, j.location, j.salary, j.type, j.experience, j.description, j.requirements, j.portal, j.url);
        });
        stmt.finalize((err) => {
          if (err) {
            console.error('Error seeding jobs table:', err.message);
          } else {
            console.log('Seeded 12 default mainframe job postings with external portals.');
          }
        });
      }
    });

    console.log('Database tables successfully initialized.');
  });
}

module.exports = db;
