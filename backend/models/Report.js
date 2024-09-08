// models/Report.js

const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    monthlyReport: { type: String },
    annualReport: { type: String },
    // Add other report fields if necessary
});

module.exports = mongoose.model('Report', ReportSchema);
