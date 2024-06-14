const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;

