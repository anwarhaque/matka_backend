
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    mobileNumber: String,
    userName: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: String,
    reference: String,
    share: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    limit: { type: Number, default: 0 },
    agentShare: { type: Number, default: 0 },
    clientShare: { type: Number, default: 0 },
    agentCommission: { type: Number, default: 0 },
    clientCommission: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    plane_password: String,
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    userType: { type: String, enum: ["SUPER", 'AGENT', 'CLIENT'], default: "CLIENT" },
    status: { type: String, enum: ['ACTIVE', 'DEACTIVE'], default: 'ACTIVE' }
},
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.salt;
                delete ret.__v;
            }
        },
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
