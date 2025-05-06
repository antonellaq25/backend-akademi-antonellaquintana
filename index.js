const express = require('express');
const app = express();
const connectDB = require('./config/db');
const dotenv = require('dotenv'); 
const doctorsRoutes = require('./routes/doctors')
const patientsRoutes = require('./routes/patients')
const appoinmentRoutes = require('./routes/appoinments')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
dotenv.config();
connectDB();
app.use(express.json());

app.use('/doctors', doctorsRoutes);
app.use('/patients', patientsRoutes);
app.use('/appoinments', appoinmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
