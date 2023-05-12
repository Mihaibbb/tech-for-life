const db = require("../db");

exports.index = async (req, res, next) => {
    const { username, password, year, month, day, hour, minute } = req.body;

    try {
        await db.query("USE ??", [`${process.env.DB_PREFIX}tech_for_life`]);
        const doctorsFound = await db.query("SELECT * FROM ?? WHERE username = ? AND password = ?", ["doctors", username, password]);
        if (!doctorsFound || !doctorsFound.length) return res.status(404).json({ 
            success: false,
            message: "Doctor doesn't exist"
        });

        const doctor = doctorsFound[0];
        const timestamp = new Date(Number(year), Number(month), Number(day), Number(hour), Number(minute)).getTime();
        
        const patientsTablesUnfiltered = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = tech_for_life");
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
    
                let filteredRows = rows.filter(row => new Date(row.timestamp).getTime() >= timestamp - 1000 * 60 * 60 * 24 * 2 && new Date(row.timestamp).getTime() <= timestamp);
                let sortedRows = filteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                let currValue = Number(sortedRows[0].value);
                for (let row of sortedRows) {
                    if (currValue / Number(row.value) >= 3) {
                        patientsDetected.push({
                            type: 'LAR3',
                            patientName: patientName,
                            creatinineLevel: currValue,
                            difference: currValue - Number(row.value),
                            differenceMultiplier: currValue / Number(row.value),
                            differencePercentage: currValue / Number(row.value) * 100,
                            type: "48h",
                            detectionDate: `${currDate.getDate() < 10 ? `0${currDate.getDate()}` : currDate.getDate()}.${currDate.getMonth() + 1 < 10 ? `0${currDate.getMonth() + 1}` : currDate.getMonth() + 1}.${currDate.getFullYear()} ${currDate.getHours() < 10 ? `0${currDate.getHours()}` : currDate.getHours()}:${currDate.getMinutes() < 10 ? `0${currDate.getMinutes()}` : currDate.getMinutes()}:${currDate.getSeconds() < 10 ? `0${currDate.getSeconds()}` : currDate.getSeconds()}`
                        });
    
                        return null;
                    } 
                }
                
                // LAR 2 ***
           
                filteredRows = rows.filter(row => new Date(row.timestamp).getTime() >= timestamp - 1000 * 60 * 60 * 24 * 2 && new Date(row.timestamp).getTime() <= timestamp);
                sortedRows = filteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                currValue = Number(sortedRows[0].value)
                
                for (let row of sortedRows) {
                    if (currValue / Number(row.value) >= 2 && currValue / Number(row.value) <= 2.9) {
                        patientsDetected.push({
                            type: 'LAR2',
                            patientName: patientName,
                            creatinineLevel: currValue,
                            difference: currValue - Number(row.value),
                            differenceMultiplier: currValue / Number(row.value),
                            differencePercentage: currValue / Number(row.value) * 100,
                            type: "48h",
                            detectionDate: `${currDate.getDate() < 10 ? `0${currDate.getDate()}` : currDate.getDate()}.${currDate.getMonth() + 1 < 10 ? `0${currDate.getMonth() + 1}` : currDate.getMonth() + 1}.${currDate.getFullYear()} ${currDate.getHours() < 10 ? `0${currDate.getHours()}` : currDate.getHours()}:${currDate.getMinutes() < 10 ? `0${currDate.getMinutes()}` : currDate.getMinutes()}:${currDate.getSeconds() < 10 ? `0${currDate.getSeconds()}` : currDate.getSeconds()}`
                        });
                        return null;
                    } 
                };
    
                // LAR 1 ****
    
                filteredRows = rows.filter(row => new Date(row.timestamp).getTime() >= timestamp - 1000 * 60 * 60 * 24 * 2 && new Date(row.timestamp).getTime() <= timestamp);
                sortedRows = filteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                currValue = Number(sortedRows[0].value)
                
                for (let row of sortedRows) {
                    if (currValue - Number(row.value) >= 0.3) {
                        patientsDetected.push({
                            type: 'LAR1',
                            patientName: patientName,
                            creatinineLevel: currValue,
                            difference: currValue - Number(row.value),
                            differenceMultiplier: currValue / Number(row.value),
                            differencePercentage: currValue / Number(row.value) * 100,
                            type: "48h",
                            detectionDate: `${currDate.getDate() < 10 ? `0${currDate.getDate()}` : currDate.getDate()}.${currDate.getMonth() + 1 < 10 ? `0${currDate.getMonth() + 1}` : currDate.getMonth() + 1}.${currDate.getFullYear()} ${currDate.getHours() < 10 ? `0${currDate.getHours()}` : currDate.getHours()}:${currDate.getMinutes() < 10 ? `0${currDate.getMinutes()}` : currDate.getMinutes()}:${currDate.getSeconds() < 10 ? `0${currDate.getSeconds()}` : currDate.getSeconds()}`
                        });
                        return null;
                    } 
                };
    
    
                filteredRows = rows.filter(row => new Date(row.timestamp).getTime() >= timestamp - 1000 * 60 * 60 * 24 * 7 && new Date(row.timestamp).getTime() <= timestamp);
                sortedRows = filteredRows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                currValue = Number(sortedRows[0].value);
                
                for (let row of sortedRows) {
                    if (currValue / Number(row.value) >= 1.5){
                        patientsDetected.push({
                            type: 'LAR1',
                            patientName: patientName,
                            creatinineLevel: currValue,
                            difference: currValue - Number(row.value),
                            differenceMultiplier: currValue / Number(row.value),
                            differencePercentage: currValue / Number(row.value) * 100,
                            type: "7d",
                            detectionDate: `${currDate.getDate() < 10 ? `0${currDate.getDate()}` : currDate.getDate()}.${currDate.getMonth() + 1 < 10 ? `0${currDate.getMonth() + 1}` : currDate.getMonth() + 1}.${currDate.getFullYear()} ${currDate.getHours() < 10 ? `0${currDate.getHours()}` : currDate.getHours()}:${currDate.getMinutes() < 10 ? `0${currDate.getMinutes()}` : currDate.getMinutes()}:${currDate.getSeconds() < 10 ? `0${currDate.getSeconds()}` : currDate.getSeconds()}`
                        });
    
                        break;
                    } 
                }
                   
                return null;
            } catch (e) {
                console.log(e.error);
            }
          
        }));

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

