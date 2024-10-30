const mongoose = require('mongoose');

const limitSchema = new mongoose.Schema({

    oldLimit: { type: Number, default: 0 },
    newLimit: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    remark: String,
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

const Limit = mongoose.model('Limit', limitSchema);
module.exports = Limit;