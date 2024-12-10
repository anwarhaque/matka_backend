
const mongoose = require('mongoose');
const Game = require('../../game/models/gameModel');
const GameResult = require('../../game/models/gameResultModel');


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
            ...(drowId && { drowId: new mongoose.Types.ObjectId(drowId) }),
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
                    totalCommAmount: {
                        $sum: "$totalCommAmount"
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ])

        const jodiNumWiseTotalAmount = await Game.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfDay, // Start of the day
                        $lt: endOfDay     // Start of the next day (exclusive)
                    },
                    ...(drowId && { drowId: new mongoose.Types.ObjectId(drowId) }), gameType: "JODI"
                },
            },
            {
                $group: {
                    _id: "$num",
                    totalAmount: {
                        $sum: "$amount"
                    },
                    totalCommAmount: {
                        $sum: "$totalCommAmount"
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: { "_id": 1 }
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
                    totalCommAmount: {
                        $sum: "$totalCommAmount"
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: { "_id": 1 }
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
                    totalCommAmount: {
                        $sum: "$totalCommAmount"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ])
        const currentOpenStatus = await Game.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfDay, // Start of the day
                        $lt: endOfDay     // Start of the next day (exclusive)
                    },
                    ...(drowId && { drowId: new mongoose.Types.ObjectId(drowId) }),
                }
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


        const result = await GameResult.findOne({ drowId: drowId, createdAt: { $gte: startOfDay, $lte: endOfDay } });

        return res.status(200).json({
            meta: { msg: "Open status fetched successfully", status: true },
            data: {
                sglNumWiseTotalAmount,
                jodiNumWiseTotalAmount,
                pattiNumWiseTotalAmount,
                gameTypeWiseAmount,
                currentOpenStatus
            },
            result
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}


const sumOfDigits = (number) => {
    const digits = number.toString().split('');
    const sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0);
    return sum;
}
const getPattiPassAmount = (patti) => {
    // Convert the number to a string for easy character comparison
    const numStr = patti.toString();

    if (numStr.length !== 3) {
        return null;
    }

    // Create a map to count the occurrences of each digit
    const digitCount = {};

    for (const digit of numStr) {
        digitCount[digit] = (digitCount[digit] || 0) + 1;
    }

    const values = Object.values(digitCount);

    if (values.includes(3)) {
        return 840;
    } else if (values.includes(2)) {
        return 280;
    } else {
        return 140;
    }
}
exports.updateResult = async (req, res) => {


    const { selectedDate, drowId, roundType, openPatti, closePatti } = req.body;

    try {


        const startOfDay = new Date(selectedDate);
        const endOfDay = new Date(selectedDate);
        endOfDay.setDate(endOfDay.getDate() + 1);



        const data = {
            drowId,
            resultLockDate: startOfDay,
            ...(roundType === 'OPEN' && {
                openPatti,
                openNum: sumOfDigits(openPatti) % 10
            }),
            ...(roundType === 'CLOSE' && {
                closePatti,
                closeNum: sumOfDigits(closePatti) % 10
            })
        }



        const result = await GameResult.findOneAndUpdate(
            {
                drowId: drowId,
                resultLockDate: { $gte: startOfDay, $lte: endOfDay }
            },
            { $set: data }, // Update with new data
            { upsert: true, new: true } // Create if not found, return the updated document
        );


        const filterData = {
            createdAt: {
                $gte: startOfDay, // Start of the day
                $lt: endOfDay     // Start of the next day (exclusive)
            },
            ...(drowId && { drowId: new mongoose.Types.ObjectId(drowId) }),
            ...(roundType && { roundType })
        }
        // const filter = { roundType: roundType, gameType: 'PATTI' };
        // const update = { $inc: { age: 1 } };

        const pattiResult = roundType === 'OPEN' ? openPatti : closePatti
        const numResult = (sumOfDigits(roundType === 'OPEN' ? openPatti : closePatti) % 10).toString()
        const jodiResult = roundType === 'CLOSE' ? `${sumOfDigits(openPatti) % 10}${sumOfDigits(closePatti) % 10}` : ''
       

        await Game.updateMany({ ...filterData, gameType: 'PATTI', num: pattiResult }, [
            {
                $set: {
                    result: pattiResult,
                    status: "PASS",
                    resultAmount: { $multiply: ["$amount", getPattiPassAmount(pattiResult)] }

                }
            }
        ])
        await Game.updateMany({ ...filterData, gameType: 'PATTI', num: { $ne: pattiResult } }, {
            $set: {
                result: pattiResult,
                status: "FAILED",
            }
        })

        await Game.updateMany({ ...filterData, gameType: 'SINGLE', num: numResult }, [
            {
                $set: {
                    result: numResult,
                    status: "PASS",
                    resultAmount: { $multiply: ["$amount", 9] }
                }
            }
        ])
        await Game.updateMany({ ...filterData, gameType: 'SINGLE', num: { $ne: numResult } }, {
            $set: {
                result: numResult,
                status: "FAILED"
            }
        })

        if (jodiResult) {

            await Game.updateMany({
                createdAt: {
                    $gte: startOfDay, // Start of the day
                    $lt: endOfDay     // Start of the next day (exclusive)
                },
                ...(drowId && { drowId: new mongoose.Types.ObjectId(drowId) }),
                gameType: 'JODI',
                num: jodiResult
            }, [
                {
                    $set: {
                        result: jodiResult,
                        status: "PASS",
                        resultAmount: { $multiply: ["$amount", 90] }
                    }
                }
            ])
            await Game.updateMany({
                createdAt: {
                    $gte: startOfDay, // Start of the day
                    $lt: endOfDay     // Start of the next day (exclusive)
                },
                ...(drowId && { drowId: new mongoose.Types.ObjectId(drowId) }),
                gameType: 'JODI',
                num: { $ne: jodiResult }
            }, {
                $set: {
                    result: jodiResult,
                    status: "FAILED"
                }
            })
        }


        return res.status(200).json({
            meta: { msg: `${roundType} Result updated successfully`, status: true },
            data: result
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}

