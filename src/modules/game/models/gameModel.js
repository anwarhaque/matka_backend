const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    drowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drow', required: true },
    num: { type: Number, default: 0 },
    resultNum: { type: Number, default: null },
    amount: { type: Number, default: 0 },
    clientCommPer: { type: Number, default: 0 },
    clientCommAmount: { type: Number, default: 0 },
    agentCommPer: { type: Number, default: 0 },
    agentCommAmount: { type: Number, default: 0 },
    totalCommPer: { type: Number, default: 0 },
    totalCommAmount: { type: Number, default: 0 },
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