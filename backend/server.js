if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const v8 = require("v8");
const app = express();
app.use(express.json());
cors();

app.post("/", (req, res) => {
    console.log("ACCEPT", req.body);
    res.status(200).json({ muie: true, for: "kelyian yesil" });
});

const indexRoutes = require("./routes/index");
const doctorRoutes = require("./routes/doctor");
const patientRoutes = require("./routes/patient");
const { getIndex } = require("./controllers/index");

app.get("/test", (req, res) => {
    console.log("TEST!");
    res.send("Found route!");
});
app.get("/show", getIndex);
app.use("/index", indexRoutes);
app.use("/doctor", doctorRoutes);
app.use("/patient", patientRoutes);
console.log('PORT', process.env.PORT || 4043);
app.listen(process.env.PORT || 4043, () => console.log("Started on port 4043"));