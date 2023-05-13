const redis = require('redis');
const JWTR =  require('jwt-redis').default;
const db = require("../db");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const doctorFound = await db.query("SELECT * FROM ?? WHERE username = ?  AND password = ?", [`${process.env.DB_PREFIX}tech_for_life.doctors`, username, password]);
        if (doctorFound?.length !== 1) return res.status(404).json({ 
            success: false
        });

        const token = jwt.sign({ username }, process.env.TOKEN_KEY);
        
        await db.query("UPDATE ?? SET accessToken = ? WHERE username = ?", [`${process.env.DB_PREFIX}tech_for_life.doctors`, token, username]);

        res.status(200).json({
            success: true,
            token
        });

      
    } catch (e) {
        console.log(e);
        res.status(404).json({
            sucess: false, 
            message: "An error occured!"
        });
    }
};

exports.validToken = async (req, res, next) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        console.log(decoded);
        if (decoded?.username) return res.status(200).json({ 
            success: true
        });

        return res.status(200).json({ success: false, message: "Token is invalid!" });
    } catch (e) {
        console.log(e);
        res.status(404).json({
            sucess: false, 
            message: "An error occured!"
        });
    }
};

exports.logOut = async (req, res) => {
    const { token } = req.body;
    try {
        const redisClient = redis.createClient();
        const jwtr = new JWTR(redisClient);
        // redisClient.connect();

        await db.query("UPDATE ?? SET accessToken = ? WHERE accessToken = ?", [`${process.env.DB_PREFIX}tech_for_life.doctors`, null, token]);
        // await jwtr.destroy(token, process.env.TOKEN_KEY);
        res.status(200).json({ success: true });
    } catch (e) {
        console.log(e);
        res.status(404).json({
            sucess: false, 
            message: "An error occured!"
        });
    }
};
