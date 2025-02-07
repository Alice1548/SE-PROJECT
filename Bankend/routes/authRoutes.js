const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("../DB");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// **1. Register**
router.post("/register", async (req, res) => {
    const {
        username, password, first_name, last_name, date_of_birth,
        gender, address, city, province, postal_code, id_card_number, role
    } = req.body;

    if (!username || !password || !first_name || !last_name || !date_of_birth ||
        !gender || !address || !city || !province || !postal_code || !id_card_number || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const pool = await poolPromise;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool
            .request()
            .input("username", sql.NVarChar, username)
            .input("passwordHash", sql.NVarChar, hashedPassword)
            .input("first_name", sql.NVarChar, first_name)
            .input("last_name", sql.NVarChar, last_name)
            .input("date_of_birth", sql.Date, date_of_birth)
            .input("gender", sql.NVarChar, gender)
            .input("address", sql.NVarChar, address)
            .input("city", sql.NVarChar, city)
            .input("province", sql.NVarChar, province)
            .input("postal_code", sql.NVarChar, postal_code)
            .input("id_card_number", sql.NVarChar, id_card_number)
            .input("role", sql.NVarChar, role)
            .query(`
                INSERT INTO Users (username, passwordHash, first_name, last_name, date_of_birth, gender,
                                   address, city, province, postal_code, id_card_number, role)
                VALUES (@username, @passwordHash, @first_name, @last_name, @date_of_birth, @gender,
                        @address, @city, @province, @postal_code, @id_card_number, @role)
            `);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// **2. Login**
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "All fields are required" });

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("username", sql.NVarChar, username)
            .query("SELECT * FROM Users WHERE username = @username");

        if (result.recordset.length === 0) return res.status(400).json({ message: "Invalid credentials" });

        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
