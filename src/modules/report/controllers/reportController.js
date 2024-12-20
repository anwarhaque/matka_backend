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
exports.getClientReport = async (req, res) => {

    try {

        const { startDate, endDate, drowId, clientId } = req.query;


        const startOfDay = new Date(startDate);
        const endOfDay = new Date(endDate);
        endOfDay.setDate(endOfDay.getDate() + 1);


        const filterData = {
            clientId: new mongoose.Types.ObjectId(clientId),
            status: { $ne: 'PENDING' },
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
exports.getAgentReport = async (req, res) => {

    try {

        const { startDate, endDate, drowId, agentId, clientId } = req.query;
        const { _id } = req.profile;

        const startOfDay = new Date(startDate);
        const endOfDay = new Date(endDate);
        endOfDay.setDate(endOfDay.getDate() + 1);


        const filterData = {
            agentId: new mongoose.Types.ObjectId(agentId),
            createdAt: {
                $gte: startOfDay, // Start of the day
                $lt: endOfDay     // Start of the next day (exclusive)
            },
            ...(clientId && { clientId: new mongoose.Types.ObjectId(clientId) }),
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
                        clientId: "$clientId",
                        day: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt",
                            },
                        },
                        gameType: "$gameType",
                        roundType: "$roundType",
                    },
                    passTotalAmount: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: ["$status", "PASS"],
                                },
                                "$amount",
                                0,
                            ],
                        },
                    },
                    totalAmount: {
                        $sum: "$amount",
                    },
                    totalResultAmount: {
                        $sum: "$resultAmount",
                    },
                    totalClientCommAmount: {
                        $sum: "$clientCommAmount",
                    },
                    totalAgentCommAmount: {
                        $sum: "$agentCommAmount",
                    },
                },
            },
            {
                $group: {
                    _id: {
                        clientId: "$_id.clientId",
                        drowId: "$_id.drowId",
                        day: "$_id.day",
                    },
                    gameTotals: {
                        $push: {
                            gameType: "$_id.gameType",
                            roundType: "$_id.roundType",
                            totalAmount: "$totalAmount",
                            totalResultAmount: "$totalResultAmount",
                            totalClientCommAmount:
                                "$totalClientCommAmount",
                            totalAgentCommAmount:
                                "$totalAgentCommAmount",
                            passTotalAmount: "$passTotalAmount",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: {
                        clientId: "$_id.clientId",
                        drowId: "$_id.drowId",
                    },
                    days: {
                        $push: {
                            day: "$_id.day",
                            totals: "$gameTotals",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: {
                        clientId: "$_id.clientId",
                    },
                    drows: {
                        $push: {
                            drow: "$_id.drowId",
                            days: "$days",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    clientId: "$_id.clientId",
                    groupedData: {
                        $map: {
                            input: "$drows", // Iterate over `drows`
                            as: "drowData",
                            in: {
                                drowId: "$$drowData.drow", // Include drowId,

                                days: {
                                    $map: {
                                        input: "$$drowData.days", // Iterate over days
                                        as: "dayData",
                                        in: {
                                            day: "$$dayData.day", // Include day
                                            totals: {
                                                $arrayToObject: {
                                                    $map: {
                                                        input: "$$dayData.totals", // Iterate over totals
                                                        as: "total",
                                                        in: {
                                                            k: {
                                                                $concat: [
                                                                    "$$total.gameType",
                                                                    "_",
                                                                    "$$total.roundType",
                                                                ],
                                                            },
                                                            v: {
                                                                totalAmount: "$$total.totalAmount",
                                                                totalResultAmount: "$$total.totalResultAmount",
                                                                totalClientCommAmount: "$$total.totalClientCommAmount",
                                                                totalAgentCommAmount: "$$total.totalAgentCommAmount",
                                                                passTotalAmount: "$$total.passTotalAmount",
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },

            {
                $lookup: {
                    from: "drows", // Collection containing drow details
                    localField: "groupedData.drowId", // Use drowId from groupedData
                    foreignField: "_id",
                    as: "drowDetails", // Add matched drow details
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1, // Include only necessary fields
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    groupedData: {
                        $map: {
                            input: "$groupedData",
                            as: "drowData",
                            in: {
                                drowId: "$$drowData.drowId",
                                drowDetails: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$drowDetails",
                                                as: "detail",
                                                cond: { $eq: ["$$detail._id", "$$drowData.drowId"] },
                                            },
                                        },
                                        0,
                                    ],
                                },
                                days: "$$drowData.days",
                            },
                        },
                    },
                },
            },

            {
                $lookup: {
                    from: "users",
                    localField: "clientId",
                    foreignField: "_id",
                    as: "clientDetails",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                },
            },
            {
                $sort: {
                    clientId: -1,
                },
            },
            {
                $project: {
                    groupedData: 1,
                    clientDetails: {
                        $arrayElemAt: ["$clientDetails", 0],
                    },
                },
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

exports.getAdminReport = async (req, res) => {

    try {

        const { startDate, endDate, drowId } = req.query;
        const { _id } = req.profile;

        const startOfDay = new Date(startDate);
        const endOfDay = new Date(endDate);
        endOfDay.setDate(endOfDay.getDate() + 1);


        const filterData = {
            // clientId: new mongoose.Types.ObjectId(_id),
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
