const mongoose = require('mongoose');

const drowSchema = new mongoose.Schema({
    name: String,
    openTime: String,
    closeTime: String,
    status: { type: String, enum: ['ACTIVE', 'DEACTIVE'], default: 'ACTIVE' }
},
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            }
        },
        timestamps: true
    }
);

const Drow = mongoose.model('Drow', drowSchema);
module.exports = Drow;