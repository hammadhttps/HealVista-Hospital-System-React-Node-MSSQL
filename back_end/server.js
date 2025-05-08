const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db'); // connect DB

const app = express();

app.use(cors());
app.use(express.json());

const pharmacyRoutes = require('./routes/pharmacy_routes');
const labRoutes = require('./routes/lab_routes');

app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/lab', labRoutes);

app.get('/', (req, res) => {
    res.send("🚀 Healvista Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});
