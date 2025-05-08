const sql = require('mssql');

const createPatient = async (req, res) => {
    const { full_name, date_of_birth, gender, contact_info } = req.body;
    
    try {
        const request = new sql.Request();
        request.input('full_name', sql.VarChar(100), full_name);
        request.input('date_of_birth', sql.Date, date_of_birth);
        request.input('gender', sql.VarChar(10), gender);
        request.input('contact_info', sql.VarChar(255), contact_info);
        
        const result = await request.query(`
            INSERT INTO Patients (full_name, date_of_birth, gender, contact_info)
            OUTPUT INSERTED.patient_id
            VALUES (@full_name, @date_of_birth, @gender, @contact_info)
        `);
        
        res.status(201).json({ 
            patient_id: result.recordset[0].patient_id 
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Error creating patient', error: err.message });
    }
};

module.exports = { createPatient };