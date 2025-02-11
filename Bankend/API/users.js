const express = require("express");
const router = express.Router();
const checkConnection = require('../DB'); // ใช้เส้นทางที่ถูกต้อง

// Route สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/', async (req, res) => {
    try {
        console.log("Trying to connect to the database...");
        const pool = await checkConnection(); // เชื่อมต่อฐานข้อมูล
        console.log("Connected to database successfully!");
        const result = await pool.request().query('SELECT * FROM Users'); // ดึงข้อมูลจากตาราง Users
        res.json(result.recordset); // ส่งข้อมูลกลับ
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Error fetching data from database");
    }
});

module.exports = router;