const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// ใช้งาน CORS และ express.json
app.use(cors());
app.use(express.json());

// นำเข้าไฟล์ API
const usersApi = require('./API/users'); // ใช้เส้นทางที่ถูกต้อง

// กำหนดให้ API `/api/users` ใช้งาน router จาก `users.js`
app.use('/api/users', usersApi);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});