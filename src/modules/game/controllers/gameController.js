const User = require("../../user/models/userModel");
const Game = require("../models/gameModel");

exports.addGame = async (req, res) => {
    try {
        const { _id: clientId } = req.profile;

        const { num, amount, roundType } = req.body;
        if (!amount || !roundType) {
            return res.status(400).json({
                meta: { msg: "Params required", status: false }
            });
        }

        const client = await User.findById(clientId)

        if (!client) {
            return res.status(404).json({
                meta: { msg: "Client not found", status: false }
            });
        }

        const game = await Game.create({
            num,
            amount,
            clientId: client._id,
            agentId: client.agentId,
            roundType
        })
        return res.status(200).json({
            meta: { msg: "Game added successfully", status: true },
            data: game
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}

exports.listGame = async (req, res) => {
    try {
        const { _id: clientId } = req.profile;

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Get the end of today
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const filterData = {
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
        const { gameId } = req.params;

        const game = await Game.findByIdAndDelete(gameId)

        return res.status(200).json({
            meta: { msg: "Game removed successfully", status: true },
            data: game
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}