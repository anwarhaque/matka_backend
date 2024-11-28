const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    drowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drow', required: true },
    num: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    roundType: { type: String, enum: ["OPEN", 'CLOSE'] },
    gameType: { type: String, enum: ["SINGLE", 'JODI', 'PATTI'] },
    lockTime: { type: Date, default: Date.now },
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

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;