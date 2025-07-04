# 📬 Suggestly – A Smart Suggestion Box for Colleges

Suggestly is a secure, responsive web application designed for students and staff to anonymously submit suggestions or feedback. It includes a powerful admin dashboard for reviewing, filtering, searching, and exporting submissions, with authentication and email notifications.

🔗 Live Preview: [Coming Soon]

## 🌟 Features

✅ Suggestion Form:

- Simple and user-friendly interface
- Categories: Academics, Faculty, Transport, Canteen, Other
- Anonymous suggestions with optional email field

✅ Admin Panel:

- JWT-protected login
- Dashboard with pie & bar charts using Chart.js
- Filter by category
- Search suggestions
- Pagination (10 per page)
- Export suggestions as CSV
- Logout functionality

✅ Backend Functionality:

- Secure login with bcrypt & JWT
- MySQL integration for persistent storage
- Email alerts for specific categories (like Faculty/Transport)
- RESTful API endpoints

## 🚀 Getting Started

1. Clone the repo:

   ```bash
   git clone https://github.com/ishan2651712/suggestion-box
   cd suggestion-box
   ```

2. Install dependencies:

```bash
npm install
```

3. Setup .env file:
   Create a file named .env in the root with the following:

```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET=your_jwt_secret
```

4. Setup MySQL database:

Create a database named suggestion_box
Run the SQL script:

```bash
CREATE TABLE suggestions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  category VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

5. Create admin user (one-time setup):
   Uncomment the bcrypt block at the bottom of server.js and run the app once to insert an admin.

## 📧 Email Notifications

The app sends email alerts when a suggestion is submitted under "Faculty" or "Transport". It uses Nodemailer and Gmail SMTP. Make sure to generate an App Password for your email if using Gmail.

## 📊 Charts

Charts shown in the admin dashboard:

- Pie Chart: Suggestion category distribution
- Bar Chart: Submissions over the past 7 days

Charts are implemented using Chart.js

## 🖥️ Tech Stack

### 🔹 Frontend

- HTML
- CSS
- JavaScript
- [Chart.js](https://www.chartjs.org/) – for data visualization

### 🔹 Backend

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)

### 🔹 Database

- [MySQL](https://www.mysql.com/)

### 🔹 Authentication

- [bcrypt](https://www.npmjs.com/package/bcrypt) – password hashing
- [JSON Web Tokens (JWT)](https://jwt.io/) – session management

### 🔹 Email Integration

- [Nodemailer](https://nodemailer.com/) – using Gmail SMTP for email alerts

## 💡 Future Improvements

- Mobile-first UI enhancements
- Multi-admin support
- Comment replies by admins
- Notification history
- Graph export options

## 🙌 Acknowledgments

Developed as a part of internship project at CCET, Sec-26, Chandigarh
Inspired by real campus suggestion handling needs

## 📃 License

This project is licensed under the MIT License.
