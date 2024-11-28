
const mongoose = require('mongoose');
const Game = require('../../game/models/gameModel');


exports.getOpenStatus = async (req, res) => {


    const { selectedDate, drowId, roundType } = req.query;

    try {

        const startOfDay = new Date(selectedDate);
        const endOfDay = new Date(selectedDate);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const filterData = {
            createdAt: {
                $gte: startOfDay, // Start of the day
                $lt: endOfDay     // Start of the next day (exclusive)
            },
            ...(drowId && { drowId }),
            ...(roundType && { roundType })
        }
        // console.log(filterData);

        const sglNumWiseTotalAmount = await Game.aggregate([
            {
                $match: { ...filterData, gameType: "SINGLE" }
            },
            {
                $group: {
                    _id: "$num",
                    totalAmount: {
                        $sum: "$amount"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ])

        const jodiNumWiseTotalAmount = await Game.aggregate([
            {
                $match: { ...filterData, gameType: "JODI" }
            },
            {
                $group: {
                    _id: "$num",
                    totalAmount: {
                        $sum: "$amount"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ])
        const pattiNumWiseTotalAmount = await Game.aggregate([
            {
                $match: { ...filterData, gameType: "PATTI" }
            },
            {
                $group: {
                    _id: "$num",
                    totalAmount: {
                        $sum: "$amount"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ])

        const gameTypeWiseAmount = await Game.aggregate([
            {
                $match: filterData
            },
            {
                $group: {
                    _id: "$gameType",
                    totalAmount: {
                        $sum: "$amount"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ])
        const currentOpenStatus = await Game.aggregate([
            {
                $match: filterData
            },
            {
                $group: {
                    _id: "$roundType", // Group by roundType
                    singleCount: { $sum: { $cond: [{ $eq: ["$gameType", "SINGLE"] }, 1, 0] } }, // Count SINGLE
                    jodiCount: { $sum: { $cond: [{ $eq: ["$gameType", "JODI"] }, 1, 0] } },   // Count JODI
                    pattiCount: { $sum: { $cond: [{ $eq: ["$gameType", "PATTI"] }, 1, 0] } }   // Count PATTI
                }
            },
            {
                $sort: { "_id.roundType": 1 }
            }

        ])


        // const singleGames = await Game.find({...filterData, gameType:'SINGLE'})
        // const jodiGames = await Game.find({...filterData, gameType:'JODI'})
        // const pattiGames = await Game.find({...filterData, gameType:'PATTI'})

        return res.status(200).json({
            meta: { msg: "Open status fetched successfully", status: true },
            data: {
                sglNumWiseTotalAmount,
                jodiNumWiseTotalAmount,
                pattiNumWiseTotalAmount,
                gameTypeWiseAmount,
                currentOpenStatus
            }
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}