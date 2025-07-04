require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./db");
const authMiddleware = require("./middleware/auth");
const nodemailer = require("nodemailer");
const { Parser } = require("json2csv");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // for index.html
app.use("/admin", express.static("views")); // to serve admin.html & admin_login.html

// Home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Admin login page
app.get("/admin/login", (req, res) => {
  res.sendFile(__dirname + "/views/admin_login.html");
});

// ✅ Serve Admin Dashboard (without auth middleware)
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/views/admin.html");
});

// Submit suggestion
app.post("/submit", (req, res) => {
  const { name, email, category, message } = req.body;

  if (!name || !email || !category || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql =
    "INSERT INTO suggestions (name, email, category, message) VALUES (?, ?, ?, ?)";
  const values = [name, email, category, message];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Failed to insert suggestion:", err);
      return res.status(500).json({ message: "Database error." });
    }

    // ✅ Send email only for important categories
    if (["Faculty", "Transport"].includes(category)) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "📬 New Suggestion Received",
        text: `New suggestion from ${name} (${email}) [${category}]:\n\n${message}`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("❌ Email not sent:", err);
        } else {
          console.log("📨 Email sent:", info.response);
        }
      });
    }

    return res
      .status(200)
      .json({ message: "✅ Suggestion submitted successfully!" });
  });
});

// Admin login
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM admins WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  });
});

// ✅ Protected: Admin suggestions data
app.get("/admin/data", authMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const sql = `SELECT * FROM suggestions ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  db.query(sql, [limit, offset], (err, results) => {
    if (err) {
      console.error("❌ Failed to fetch paginated suggestions:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
});

// ✅ Protected: CSV Export
app.get("/admin/export", (req, res) => {
  db.query("SELECT * FROM suggestions", (err, data) => {
    if (err) return res.status(500).send("Export error");

    const fields = ["name", "email", "category", "message", "created_at"];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("suggestions.csv");
    res.send(csv);
  });
});

// ✅ Protected: Keyword Search
app.get("/admin/search", authMiddleware, (req, res) => {
  const keyword = req.query.q;
  const like = `%${keyword}%`;
  const sql = `SELECT * FROM suggestions WHERE name LIKE ? OR message LIKE ? OR category LIKE ? ORDER BY created_at DESC`;

  db.query(sql, [like, like, like], (err, results) => {
    if (err) return res.status(500).json({ message: "Search error" });
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

/*
// Optional one-time admin user creation:
const username = "admin";
const plainPassword = "admin123";

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  const sql = "INSERT INTO admins (username, password) VALUES (?, ?)";
  db.query(sql, [username, hash], (err, result) => {
    if (err) throw err;
    console.log("✅ Admin user created successfully.");
  });
});
*/
