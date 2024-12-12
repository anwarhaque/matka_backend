const mongoose = require('mongoose');
const Game = require("../../game/models/gameModel");

exports.getReport = async (req, res) => {

    try {

        const { startDate, endDate, drowId } = req.query;
        const { _id } = req.profile;

        const startOfDay = new Date(startDate);
        const endOfDay = new Date(endDate);
        endOfDay.setDate(endOfDay.getDate() + 1);


        const filterData = {
            clientId: new mongoose.Types.ObjectId(_id),
            createdAt: {
                $gte: startOfDay, // Start of the day
                $lt: endOfDay     // Start of the next day (exclusive)
            },
            ...(drowId && { drowId: new mongoose.Types.ObjectId(drowId) })
        }

        // console.log(filterData)



        const report = await Game.aggregate([
            {
                $match: filterData
            },

            {
                $group: {
                    _id: {
                        drowId: "$drowId",
                        day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        gameType: "$gameType",
                        roundType: "$roundType"
                    },
                    passTotalAmount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "PASS"] }, "$amount", 0]
                        }
                    },
                    totalAmount: { $sum: "$amount" },
                    totalResultAmount: { $sum: "$resultAmount" },
                    totalClientCommAmount: { $sum: "$clientCommAmount" },
                    totalAgentCommAmount: { $sum: "$agentCommAmount" }
                }
            },

            {
                $group: {
                    _id: {
                        drowId: "$_id.drowId",
                        day: "$_id.day"
                    },
                    gameTotals: {
                        $push: {
                            gameType: "$_id.gameType",
                            roundType: "$_id.roundType",
                            totalAmount: "$totalAmount",
                            totalResultAmount: "$totalResultAmount",
                            totalClientCommAmount: "$totalClientCommAmount",
                            totalAgentCommAmount: "$totalAgentCommAmount",
                            passTotalAmount: "$passTotalAmount",
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.drowId",
                    days: {
                        $push: {
                            day: "$_id.day",
                            totals: "$gameTotals"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    drowId: "$_id",
                    groupedData: {
                        $arrayToObject: {
                            $map: {
                                input: "$days",
                                as: "dayData",
                                in: {
                                    k: "$$dayData.day",
                                    v: {
                                        $arrayToObject: {
                                            $map: {
                                                input: "$$dayData.totals",
                                                as: "total",
                                                in: {
                                                    k: {
                                                        $concat: [
                                                            "$$total.gameType",
                                                            "_",
                                                            "$$total.roundType"
                                                        ]
                                                    },
                                                    v: {
                                                        totalAmount: "$$total.totalAmount",
                                                        totalResultAmount: "$$total.totalResultAmount",
                                                        totalClientCommAmount: "$$total.totalClientCommAmount",
                                                        totalAgentCommAmount: "$$total.totalAgentCommAmount",
                                                        passTotalAmount: "$$total.passTotalAmount",
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "drows",
                    localField: "drowId",
                    foreignField: "_id",
                    as: "drow",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            }
                        }
                    ]
                }
            },
            {
                $sort: { drowId: -1 }
            },
            {
                $project: {
                    groupedData: 1,
                    drow: { $arrayElemAt: ["$drow", 0] }
                }
            }
        ])

        return res.status(200).json({
            meta: { msg: `Report found successfully`, status: true },
            data: report
        })

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}
