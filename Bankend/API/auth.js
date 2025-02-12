const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkConnection = require('../DB');  // นำเข้า checkConnection จาก DB.js
const sql = require("mssql");  // นำเข้า sql จาก mssql

const router = express.Router();
const JWT_SECRET = "your_jwt_secret";  // เก็บ JWT Secret key

//login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ error: "Email and password are required" });
    }

    try {
        // เชื่อมต่อฐานข้อมูลก่อนทำการ query
        const pool = await checkConnection();

        const query = `SELECT * FROM Users WHERE LOWER(Email) = LOWER(@Input)`;
        const requestSql = pool.request();  // ใช้ pool ที่เชื่อมต่อแล้ว
        requestSql.input("Input", sql.NVarChar, email);

        const result = await requestSql.query(query);
        const user = result.recordset[0];

        if (!user) {
            return res.status(401).send({ error: "Invalid email or password" });
        }

        const validPassword = await bcrypt.compare(password, user.password); // เปรียบเทียบรหัสผ่าน
        if (!validPassword) {
            return res.status(401).send({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });  // ใช้ user_id และ role
        res.send({ message: "Login successful", role: user.role ,user_id: user.user_id});
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send({ error: "Internal server error" });
    }
});



// Register route
router.post("/register", async (req, res) => {
    const { email, password, first_name, last_name, nick_name, date_of_birth, phone, gender, id_card_number, address, subdistrict, district, province, postal_code, status } = req.body;

    if (!email || !password || !first_name || !last_name || !nick_name || !date_of_birth || !phone || !gender || !id_card_number || !address || !subdistrict || !district || !province || !postal_code || !status) {
        return res.status(400).send({ error: "All fields are required" });
    }

    try {
        const pool = await checkConnection(); // เชื่อมต่อฐานข้อมูล
        const hashedPassword = await bcrypt.hash(password, 10); // Hash รหัสผ่าน

        // Step 1: Insert into Users table
        const insertUserQuery = `INSERT INTO Users (email, password, Role) 
                                 OUTPUT INSERTED.user_id
                                 VALUES (@Email, @Password, 'User')`;

        const requestUser = pool.request();
        requestUser.input("Email", sql.NVarChar, email);
        requestUser.input("Password", sql.NVarChar, hashedPassword);


        const userResult = await requestUser.query(insertUserQuery);
        const userId = userResult.recordset[0].user_id; // ได้ user_id ที่ถูกสร้างขึ้น

        console.log("New User ID:", userId); // Log user_id เพื่อตรวจสอบ

        // Step 2: Insert into Users_Detail_New table
        const insertDetailQuery = `INSERT INTO Users_Detail (user_id, first_name, last_name, nick_name, date_of_birth, phone, gender, id_card_number, address, subdistrict, district, province, postal_code, status) 
                                   VALUES (@UserId, @FirstName, @LastName, @NickName, @DateOfBirth, @Phone, @Gender, @IdCardNumber, @Address, @Subdistrict, @District, @Province, @PostalCode, @Status)`;

        const requestDetail = pool.request();
        requestDetail.input("UserId", sql.Int, userId);
        requestDetail.input("FirstName", sql.NVarChar, first_name);
        requestDetail.input("LastName", sql.NVarChar, last_name);
        requestDetail.input("NickName", sql.NVarChar, nick_name);
        requestDetail.input("DateOfBirth", sql.Date, date_of_birth);
        requestDetail.input("Phone",sql.VarChar, phone);
        requestDetail.input("Gender", sql.NVarChar, gender);
        requestDetail.input("IdCardNumber", sql.VarChar, id_card_number);
        requestDetail.input("Address", sql.NVarChar, address);
        requestDetail.input("Subdistrict", sql.NVarChar, subdistrict);
        requestDetail.input("District", sql.NVarChar, district);
        requestDetail.input("Province", sql.NVarChar, province);
        requestDetail.input("PostalCode", sql.VarChar, postal_code);
        requestDetail.input("Status", sql.NVarChar, status);

        await requestDetail.query(insertDetailQuery);

        res.send({ message: "User registered successfully", user_id: userId });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).send({ error: "Registration failed. Please try again." });
    }
});


//Reset Password
router.post("/reset-password", async (req, res) => {
    const { email, phone, newPassword } = req.body;

    if ((!email && !phone) || !newPassword) {
        return res.status(400).send({ error: "Email or phone and new password are required" });
    }

    try {
        const pool = await checkConnection(); // ✅ เชื่อมต่อฐานข้อมูล

        console.log("Received data:", req.body); // ✅ ตรวจสอบข้อมูลที่รับมา

        // 🔹 ค้นหาผู้ใช้ใน Users และ Users_Detail
        const query = `
            SELECT U.user_id 
            FROM Users U
            LEFT JOIN Users_Detail D ON U.user_id = D.user_id
            WHERE U.email = @Email OR D.phone = @Phone
        `;

        const requestSql = pool.request();
        requestSql.input("Email", sql.NVarChar, email || null);
        requestSql.input("Phone", sql.VarChar, phone || null);

        const result = await requestSql.query(query);
        const user = result.recordset[0];

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // 🔹 อัปเดตรหัสผ่านใหม่
        const updateQuery = `UPDATE Users SET password = @NewPassword WHERE user_id = @UserId`;
        const updateRequestSql = pool.request();
        updateRequestSql.input("NewPassword", sql.NVarChar, hashedNewPassword);
        updateRequestSql.input("UserId", sql.Int, user.user_id);

        await updateRequestSql.query(updateQuery);

        res.send({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Error during password reset:", err);
        res.status(500).send({ error: "Failed to reset password" });
    }
});



module.exports = router;
