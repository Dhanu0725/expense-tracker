const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');
const expenseRoutes = require('./routes/expenses'); 
const budgetRoutes = require('./routes/manageBudgetsRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const insightsRouter = require('./routes/insightsRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes); // Mount userRoutes at /api
app.use('/api', authMiddleware, dashboardRoutes);  // Mount dashboardRoutes for dashboard-related endpoints
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/insights', insightsRouter);

// Error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
