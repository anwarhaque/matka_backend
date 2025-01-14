const Drow = require("../models/drowModel");
const mongoose = require('mongoose');

exports.addDrow = async (req, res) => {
    try {
        const { name, openTime, closeTime } = req.body;
        if (!name || !openTime || !closeTime) {
            return res.status(400).json({
                meta: { msg: "Params required", status: false }
            });
        }
        const drow = await Drow.create({ name, openTime, closeTime })
        return res.status(200).json({
            meta: { msg: "Drow added successfully", status: true },
            data: drow
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}
exports.updateDrow = async (req, res) => {
    try {
        const { drowId } = req.params
        const { name, openTime, closeTime } = req.body;
        if (!name || !openTime || !closeTime) {
            return res.status(400).json({
                meta: { msg: "Params required", status: false }
            });
        }
        const drow = await Drow.findByIdAndUpdate(drowId, { $set: { name, openTime, closeTime } }, { new: true })
        return res.status(200).json({
            meta: { msg: "Drow updated successfully", status: true },
            data: drow
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}
exports.listDrow = async (req, res) => {
    try {

        const { status } = req.query
        const drows = await Drow.aggregate([
            {
                $match: { ...(status && { status }), }
            },
            {
                $lookup: {
                    from: "gameresults", // Name of the game result collection
                    localField: "_id",
                    foreignField: "drowId",
                    as: "gameResults"
                }
            },
            {
                $addFields: {
                    todaysGameResults: {
                        $filter: {
                            input: "$gameResults",
                            as: "result",
                            cond: {
                                $eq: [
                                    { $dateToString: { format: "%Y-%m-%d", date: "$$result.createdAt" } },
                                    { $dateToString: { format: "%Y-%m-%d", date: new Date() } }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    openTime: 1,
                    closeTime: 1,
                    status: 1,
                    todaysGameResults: { $arrayElemAt: ["$todaysGameResults", 0] }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])
        return res.status(200).json({
            meta: { msg: "Drow list found successfully", status: true },
            data: drows
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}
exports.getDrow = async (req, res) => {
    try {
        const { drowId } = req.params

        // Validate the id format
        if (!mongoose.Types.ObjectId.isValid(drowId)) {
            return res.status(400).json({
                meta: { msg: "Invalid ID format", status: false }
            });
        }

        const drow = await Drow.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(drowId)}
            },
            {
                $lookup: {
                    from: "gameresults", // Name of the game result collection
                    localField: "_id",
                    foreignField: "drowId",
                    as: "gameResults"
                }
            },
            {
                $addFields: {
                    todaysGameResults: {
                        $filter: {
                            input: "$gameResults",
                            as: "result",
                            cond: {
                                $eq: [
                                    { $dateToString: { format: "%Y-%m-%d", date: "$$result.createdAt" } },
                                    { $dateToString: { format: "%Y-%m-%d", date: new Date() } }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    openTime: 1,
                    closeTime: 1,
                    status: 1,
                    todaysGameResults: { $arrayElemAt: ["$todaysGameResults", 0] }
                }
            },
        ])
        if (!drow[0]) {
            return res.status(404).json({
                meta: { msg: "Drow not found", status: false }
            });
        }

        return res.status(200).json({
            meta: { msg: "Drow found successfully", status: true },
            data: drow[0]
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}
exports.changeDrowStatus = async (req, res) => {
    try {
        const { drowId } = req.params
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                meta: { msg: "Params required", status: false }
            });
        }
        const drow = await Drow.findByIdAndUpdate(drowId, { $set: { status } }, { new: true })
        return res.status(200).json({
            meta: { msg: "Drow status updated successfully", status: true },
            data: drow
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}
exports.deleteDrow = async (req, res) => {
    try {
        const { drowId } = req.params
        await Drow.findByIdAndDelete(drowId)
        return res.status(200).json({
            meta: { msg: "Drow deleted successfully", status: true }
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}