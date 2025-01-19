const User = require("../../user/models/userModel");
const Game = require("../models/gameModel");

const checkGameType = (number) => {
    const len = number.length;
    if (len === 1) {
        return "SINGLE";
    } else if (len === 2) {
        return "JODI";
    } else if (len === 3) {
        return "PATTI";
    } else {
        return "";
    }
}
exports.addGame = async (req, res) => {
    try {
        // const { _id: clientId } = req.profile;

        const { drowId, num, amount, roundType, clientId } = req.body;
        if (!drowId || !amount || !roundType || !clientId) {
            return res.status(400).json({
                meta: { msg: "Params required", status: false }
            });
        }

        const client = await User.findById(clientId)

        if (!client) {
            return res.status(400).json({
                meta: { msg: "Client not found", status: false }
            });
        }

        if (client.limit < amount) {
            return res.status(400).json({
                meta: { msg: "You don't have enough limit", status: false }
            });
        }
        if (checkGameType(num) === 'JODI' && roundType.toUpperCase() === 'CLOSE') {
            return res.status(400).json({
                meta: { msg: "Sorry JODI is not allowed in close round", status: false }
            });
        }

        const game = await Game.create({
            drowId,
            num,
            gameType: checkGameType(num),
            amount,
            clientId: client._id,
            agentId: client.agentId,
            roundType: roundType.toUpperCase(),
            clientCommPer: client.clientCommission,
            clientCommAmount: (amount * client.clientCommission) / 100,
            agentCommPer: client.agentCommission,
            agentCommAmount: (amount * client.agentCommission) / 100,
            totalCommPer: client.clientCommission + client.agentCommission,
            totalCommAmount: (client.clientCommission + client.agentCommission) * amount / 100
        })

        client.limit -= amount
        const updatedClient = await client.save()

        return res.status(200).json({
            meta: { msg: "Game added successfully", status: true },
            data: game,
            client: updatedClient
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}

exports.listGame = async (req, res) => {
    try {
        // const { _id } = req.profile;
        const { drowId, roundType, selectedDate, clientId } = req.query
        const startOfToday = selectedDate ? new Date(selectedDate) : new Date()
        startOfToday.setHours(0, 0, 0, 0);

        // Get the end of today

        const endOfToday = selectedDate ? new Date(selectedDate) : new Date()
        endOfToday.setHours(23, 59, 59, 999);

        const filterData = {
            ...(drowId && { drowId }),
            ...(roundType && { roundType: roundType.toUpperCase() }),
            clientId,
            lockTime: {
                $gte: startOfToday,
                $lt: endOfToday,
            },
        }

        const games = await Game.find(filterData).sort({ createdAt: -1 })

        return res.status(200).json({
            meta: { msg: "Game list found successfully", status: true },
            data: games
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}

exports.deleteGame = async (req, res) => {
    try {
        const { gameId, clientId } = req.params;

        // const { _id: clientId } = req.query;

        const game = await Game.findByIdAndDelete(gameId)

        if (!game) {
            return res.status(400).json({
                meta: { msg: "Game not found", status: false },
            });
        }
        const client = await User.findByIdAndUpdate(clientId, { $inc: { limit: game.amount } }, { new: true })

        return res.status(200).json({
            meta: { msg: "Game removed successfully", status: true },
            data: game,
            client
        });


    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}