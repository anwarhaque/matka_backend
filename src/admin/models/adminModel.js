const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },

    salt: String,
    otp: String,
    adminType: { type: String, enum: ["ADMIN"], default: "ADMIN" },
    status: { type: String, enum: ['ACTIVE', 'DEACTIVE'], default: 'ACTIVE' }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.otp;
        }
    },
    timestamps: true
});


module.exports = { Admin: mongoose.model('admins', AdminSchema) }