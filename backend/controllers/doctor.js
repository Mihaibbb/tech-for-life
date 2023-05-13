const db = require("../db");

exports.createDoctor = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const otherUsers = await db.query("SELECT * FROM ?? WHERE username = ?", [`${process.env.DB_PREFIX}tech_for_life.doctors`, username]);
        if (otherUsers.length) return res.status(300).json({ success: false, message: "Doctor already exists!" });
        await db.query("INSERT INTO ?? (username, password) VALUES (?, ?)", [`${process.env.DB_PREFIX}tech_for_life.doctors`, username, password]);
        res.status(200).json({ success: true });
    } catch (e) {
        console.log(e);
        res.status(404).json({ error: e });
    }
};