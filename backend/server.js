const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes
const authRoutes = require("./routes/auth.routes");
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require("./routes/application.routes");

// Load env Variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

//Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://job-portal-snb2.vercel.app/'
  ],
  credentials: true
}));         // Allow Fronted Request
app.use(express.json()) // Lets server read JSON requests body

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

//Test Route
app.get('/', (req, res) => {
    res.json({message: 'Job Portal API is running'})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})