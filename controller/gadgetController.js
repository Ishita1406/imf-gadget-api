import con from "../database.js";
import { generateCodename, generateSuccessProbability } from "../utils/gadgetUtils.js";
import { v4 as uuidv4 } from 'uuid';

export const getGadgets = (req, res) => {
    let sql = 'SELECT * FROM gadgets';
    if (req.query.status) {
        sql += ` WHERE status = '${req.query.status}'`;
    }

    con.query(sql, (err, results) => {
        if (err) throw err;
        
        const gadgetsWithProbability = results.map(gadget => ({
            ...gadget,
            mission_success_probability: generateSuccessProbability()
        }));
        
        res.json(gadgetsWithProbability);
    });
}

export const createGadget = (req, res) => {
    const { name, status } = req.body; 
    const codename = generateCodename();
    const mission_success_probability = generateSuccessProbability();

    const now = new Date();
    const createdAt = now.toISOString().slice(0, 19).replace('T', ' '); 
    const updatedAt = createdAt;

    const id = uuidv4(); 

    const sql = `INSERT INTO gadgets (id, name, codename, status, created_at, updated_at, decommissioned_at, mission_success_probability) 
                 VALUES ('${id}', '${name}', '${codename}', '${status}', '${createdAt}', '${updatedAt}', NULL, '${mission_success_probability}')`;

    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error occurred during INSERT:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({
            id,
            name,
            codename,
            status,
            created_at: createdAt,
            updated_at: updatedAt,
            decommissioned_at: null,
            mission_success_probability
        });
    });
}

export const updateGadget = (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;

    if (!name || !status) {
        return res.status(400).json({ error: "Name and status are required" });
    }

    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = `UPDATE gadgets 
                 SET name = ?, status = ?, updated_at = ?
                 WHERE id = ?`;

    con.query(sql, [name, status, updatedAt, id], (err, result) => {
        if (err) {
            console.error("Error occurred during UPDATE:", err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Gadget not found" });
        }

        res.status(200).json({ message: "Gadget updated successfully" });
    });
}

export const deleteGadget = (req, res) => {
    const { id } = req.params;

    const sql = `UPDATE gadgets SET status = ?, decommissioned_at = NOW() WHERE id = ?`;

    con.query(sql, ['Decommissioned', id], (err, result) => {
        if (err) {
            console.error("Error decommissioning gadget:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Gadget not found" });
        }

        res.status(200).json({ message: "Gadget successfully decommissioned" });
    });
};

export const selfDestruct = (req, res) => {
    const { id } = req.params;
    const confirmationCode = Math.random().toString(36).substring(2, 10); 

    const sql = `UPDATE gadgets SET status = ? WHERE id = ?`;

    con.query(sql, ['Destroyed', id], (err, result) => {
        if (err) {
            console.error("Error initiating self-destruct:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Gadget not found" });
        }

        res.status(200).json({
            message: "Self-destruct initiated",
            confirmationCode
        });
    });
};

