const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // 👈 Workbench username
  password: "Tyujhg456", // 👈 Your password
  database: "suggestion_box",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL");
});

module.exports = db;
