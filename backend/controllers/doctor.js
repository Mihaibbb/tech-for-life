const bcrypt = require("bcrypt");
const db = require("../db");

exports.createDoctor = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO ?? (username, password) VALUES (?, ?)", [`${process.env.DB_PREFIX}tech_for_life.doctors`, username, hashedPassword]);
        res.status(200).json({ success: true });
    } catch (e) {
        console.log(e);
        res.status(404).json({ error: e });
    }
};