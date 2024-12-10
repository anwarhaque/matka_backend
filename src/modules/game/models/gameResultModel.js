const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
    drowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drow', required: true },
    openPatti: String,
    closePatti: String,
    openNum: Number,
    closeNum: Number,
    resultLockDate: Date ,
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

const GameResult = mongoose.model('GameResult', gameResultSchema);
module.exports = GameResult;