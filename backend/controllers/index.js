const db = require("../db");

exports.createIndex = async (req, res, next) => {
    const { patientId, year, month, day, hour, minute, value } = req.body;

    try {
        const timestamp = new Date(Number(year), Number(month), Number(day), Number(hour), Number(minute));
        await db.query("INSERT INTO ?? (timestamp, value) VALUES (?, ?)", [`${process.env.DB_PREFIX}tech_for_life.patient_${patientId}`, new Date(timestamp), value]);
        res.status(200).json({ success: true });
    } catch (e) {
        console.log(e);
        res.status(404).json({ error: e, message: "An error occured!" });
    }
};

exports.index = async (req, res, next) => {
    const { username, password } = req.body;
    
    try {
        await db.query("USE ??", [`${process.env.DB_PREFIX}tech_for_life`]);
        const doctorsFound = await db.query("SELECT * FROM ?? WHERE username = ? AND password = ?", ["doctors", username, password]);
        if (!doctorsFound || !doctorsFound.length) return res.status(404).json({ 
            success: false,
            message: "Doctor doesn't exist"
        });
        await db.query("USE ??", [`${process.env.DB_PREFIX}tech_for_life`]);

        const doctor = doctorsFound[0];
        const timestamp = new Date().getTime();
        const patientsTablesUnfilteredUnmapped = await db.query("SHOW TABLES");
        const patientsTablesUnfiltered = patientsTablesUnfilteredUnmapped.map(table => Object.values(table)[0]);
        const patientsTables = patientsTablesUnfiltered.filter(table => table.includes("patient_"));
        const patientsDetected = [];

        await Promise.all(patientsTables.map(async table => {
            try {
                const patientId = table.slice(process.env.DB_PREFIX.toString().length + 8);
                const patientNameArr = await db.query("SELECT * FROM ?? WHERE patientId = ?", ["patients", patientId]);
                if (!patientNameArr || !patientNameArr.length) return null;
                const patientName = patientNameArr[0].name;
                const rows = await db.query("SELECT * FROM ??", [table]);
                if (!rows.length) return;
                // LAR 3 ***
    
                const currDate = new Date();
                let smFilteredRows = rows.filter(row => new Date(row.timestamp).getTime() <= timestamp);
                smFilteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                let currTimestamp = new Date(smFilteredRows?.[0]?.timestamp).getTime();
                let filteredRows = rows.filter(row => new Date(row.timestamp).getTime() >= currTimestamp - 1000 * 60 * 60 * 24 * 2 && new Date(row.timestamp).getTime() <= currTimestamp);
                let sortedRows = filteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
               
                let currValue = Number(sortedRows[0]?.value);
                for (let row of sortedRows) {
                    if (currValue / Number(row.value) >= 3) {
                        patientsDetected.push({
                            detectionType: 'LAR3',
                            patientName: patientName,
                            creatinineLevel: currValue,
                            difference: parseFloat(currValue - Number(row.value)).toFixed(2),
                            differenceMultiplier: parseFloat(currValue / Number(row.value)).toFixed(2),
                            differencePercentage: parseFloat(currValue / Number(row.value) * 100).toFixed(2),
                            type: "48h",
                            detectionDate: `${currDate.getDate() < 10 ? `0${currDate.getDate()}` : currDate.getDate()}.${currDate.getMonth() + 1 < 10 ? `0${currDate.getMonth() + 1}` : currDate.getMonth() + 1}.${currDate.getFullYear()} ${currDate.getHours() < 10 ? `0${currDate.getHours()}` : currDate.getHours()}:${currDate.getMinutes() < 10 ? `0${currDate.getMinutes()}` : currDate.getMinutes()}:${currDate.getSeconds() < 10 ? `0${currDate.getSeconds()}` : currDate.getSeconds()}`
                        });
    
                        return null;
                    } 
                }
                
                // LAR 2 ***
                
                smFilteredRows = rows.filter(row => new Date(row.timestamp).getTime() <= timestamp);
                smFilteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                currTimestamp = new Date(smFilteredRows?.[0]?.timestamp).getTime();
                filteredRows = rows.filter(row => new Date(row.timestamp).getTime() >= currTimestamp - 1000 * 60 * 60 * 24 * 2 && new Date(row.timestamp).getTime() <= currTimestamp);
                sortedRows = filteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                currValue = Number(sortedRows[0]?.value)
                
                for (let row of sortedRows) {
                    if (currValue / Number(row.value) >= 2 && currValue / Number(row.value) <= 2.9) {
                        patientsDetected.push({
                            detectionType: 'LAR2',
                            patientName: patientName,
                            creatinineLevel: currValue,
                            difference: parseFloat(currValue - Number(row.value)).toFixed(2),
                            differenceMultiplier: parseFloat(currValue / Number(row.value)).toFixed(2),
                            differencePercentage: parseFloat(currValue / Number(row.value) * 100).toFixed(2),
                            type: "48h",
                            detectionDate: `${currDate.getDate() < 10 ? `0${currDate.getDate()}` : currDate.getDate()}.${currDate.getMonth() + 1 < 10 ? `0${currDate.getMonth() + 1}` : currDate.getMonth() + 1}.${currDate.getFullYear()} ${currDate.getHours() < 10 ? `0${currDate.getHours()}` : currDate.getHours()}:${currDate.getMinutes() < 10 ? `0${currDate.getMinutes()}` : currDate.getMinutes()}:${currDate.getSeconds() < 10 ? `0${currDate.getSeconds()}` : currDate.getSeconds()}`
                        });
                        return null;
                    } 
                };
    
                // LAR 1 ****
                smFilteredRows = rows.filter(row => new Date(row.timestamp).getTime() <= timestamp);
                smFilteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                currTimestamp = new Date(smFilteredRows?.[0]?.timestamp).getTime();
                filteredRows = rows.filter(row => new Date(row.timestamp).getTime() >= currTimestamp - 1000 * 60 * 60 * 24 * 2 && new Date(row.timestamp).getTime() <= currTimestamp);
                sortedRows = filteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                currValue = Number(sortedRows[0]?.value)
                
                for (let row of sortedRows) {
                    if (currValue - Number(row.value) >= 0.3) {
                        patientsDetected.push({
                            detectionType: 'LAR1',
                            patientName: patientName,
                            creatinineLevel: currValue,
                            difference: parseFloat(currValue - Number(row.value)).toFixed(2),
                            differenceMultiplier: parseFloat(currValue / Number(row.value)).toFixed(2),
                            differencePercentage: parseFloat(currValue / Number(row.value) * 100).toFixed(2),
                            type: "48h",
                            detectionDate: `${currDate.getDate() < 10 ? `0${currDate.getDate()}` : currDate.getDate()}.${currDate.getMonth() + 1 < 10 ? `0${currDate.getMonth() + 1}` : currDate.getMonth() + 1}.${currDate.getFullYear()} ${currDate.getHours() < 10 ? `0${currDate.getHours()}` : currDate.getHours()}:${currDate.getMinutes() < 10 ? `0${currDate.getMinutes()}` : currDate.getMinutes()}:${currDate.getSeconds() < 10 ? `0${currDate.getSeconds()}` : currDate.getSeconds()}`
                        });
                        return null;
                    } 
                };
    
                smFilteredRows = rows.filter(row => new Date(row.timestamp).getTime() <= timestamp);
                smFilteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                currTimestamp = new Date(smFilteredRows?.[0]?.timestamp).getTime();
                filteredRows = rows.filter(row => new Date(row.timestamp).getTime() >= currTimestamp - 1000 * 60 * 60 * 24 * 7 && new Date(row.timestamp).getTime() <= currTimestamp);
                sortedRows = filteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                currValue = Number(sortedRows[0]?.value);
                
                for (let row of sortedRows) {
                    if (currValue / Number(row.value) >= 1.5){
                        patientsDetected.push({
                            detectionType: 'LAR1',
                            patientName: patientName,
                            creatinineLevel: currValue,
                            difference: parseFloat(currValue - Number(row.value)).toFixed(2),
                            differenceMultiplier: parseFloat(currValue / Number(row.value)).toFixed(2),
                            differencePercentage: parseFloat(currValue / Number(row.value) * 100).toFixed(2),
                            type: "7d",
                            detectionDate: `${currDate.getDate() < 10 ? `0${currDate.getDate()}` : currDate.getDate()}.${currDate.getMonth() + 1 < 10 ? `0${currDate.getMonth() + 1}` : currDate.getMonth() + 1}.${currDate.getFullYear()} ${currDate.getHours() < 10 ? `0${currDate.getHours()}` : currDate.getHours()}:${currDate.getMinutes() < 10 ? `0${currDate.getMinutes()}` : currDate.getMinutes()}:${currDate.getSeconds() < 10 ? `0${currDate.getSeconds()}` : currDate.getSeconds()}`
                        });
    
                        break;
                    } 
                }
                   
                return null;
            } catch (e) {
                console.log(e);
            }
          
        }));

        if (!patientsDetected.length) res.status(251).json({
            success: true
        });

        res.status(200).json({ 
            success: true, 
            patients: patientsDetected,
        });
    } catch (e) {
        console.log(e);
        res.status(404).json({ 
            success: false,
            error: e
         });
    }
};


exports.getIndex = async (req, res, next) => {

    try {
        await db.query("USE ??", [`${process.env.DB_PREFIX}tech_for_life`]);
        const tablesUnmapped = await db.query("SHOW TABLES");
        const tables = tablesUnmapped.map(table => Object.values(table)[0]);
        const tablesObject = {};
        await Promise.all(tables.map(async table => {
            const rows = await db.query("SELECT * FROM ??", [`${process.env.DB_PREFIX}tech_for_life.${table}`]);
            tablesObject[table] = rows;
            return null;
        }));

        res.status(200).json(tablesObject);
    } catch (e) {
        console.log(e);
        res.status(404).json({ error: e, message: "An error occured!" });
    }
};