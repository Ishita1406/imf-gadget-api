import bcryptjs from "bcryptjs";
import con from "../database.js";
import jwt from "jsonwebtoken"; 
import { v4 as uuidv4 } from 'uuid';

export const register = (req, res) => {
    const { username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const id = uuidv4();

    bcryptjs.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
            console.error("Error occurred during hash:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const sql = `INSERT INTO user (user_id, username, password, created_at) VALUES (?, ?, ?, ?)`;
        
        con.query(sql, [id, username, hashedPassword, createdAt], (err, result) => {
            if (err) {
                console.error("Error occurred during INSERT:", err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({
                user_id: id,
                username,
                password,
                created_at: createdAt,
            });
        });
    });
};

export const login = (req, res) => {
    const { username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const sql = `SELECT * FROM user WHERE username = ?`;

    con.query(sql, [username], (err, results) => {
        if (err) {
            console.error("Error occurred during query:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const user = results[0];

        bcryptjs.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Error during password comparison:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (!isMatch) {
                return res.status(401).json({ error: "Invalid password" });
            }

            const token = jwt.sign(
                { user_id: user.user_id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' } 
            );

            res.status(200).json({
                user_id: user.user_id,
                username: user.username,
                created_at: user.created_at,
                token
            });
        });
    });
};