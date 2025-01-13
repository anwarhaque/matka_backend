const mongoose = require('mongoose');

const marqueeSchema = new mongoose.Schema({
    notification: String,
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

const Marquee = mongoose.model('Marquee', marqueeSchema);
module.exports = Marquee;