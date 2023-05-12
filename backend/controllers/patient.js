const generateId = require("../functions/generateId");
const db = require("../db");

exports.createPatient = async (req, res, next) => {
    const { patientName } = req.body;
    try {
        const patientId = generateId(8);
        await db.query("INSERT INTO ?? (patientId, name) VALUES (?, ?)", [`${process.env.DB_PREFIX}tech_for_life.patients`, patientId, patientName]);
        
        let sql = "CREATE TABLE ?? (";
        sql += "timestamp datetime not null, ";
        sql += "value decimal(6, 2) not null )";

        await db.query(sql, [`${process.env.DB_PREFIX}tech_for_life.patient_${patientId}`]);

        res.status(200).json({ success: true });

    } catch (e) {
        console.log(e);
        res.status(404).json({ error: e });
    }
};