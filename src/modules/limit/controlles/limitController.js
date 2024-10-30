const User = require("../../user/models/userModel");
const Limit = require("../models/limitModel");
const mongoose = require('mongoose');


exports.addLimit = async (req, res) => {


    const { senderId, receiverId, amount, newLimit, oldLimit } = req.body;

    try {
        // Check if amount is positive
        if (amount == 0) {
            return res.status(400).json({
                meta: { msg: "Invalid amount", status: false }
            });
        }

        // Fetch sender and receiver
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({
                meta: { msg: "Sender or receiver not found", status: false }
            });

        }

        // Check if sender has sufficient balance
        if (sender.limit < amount) {
            return res.status(400).json({
                meta: { msg: "Insufficient balance", status: false }
            });
        }

        // Debit from sender and credit to receiver
        sender.limit -= amount;
        receiver.limit += amount;

        // Save the users' new balances
        await sender.save();
        await receiver.save();

        // Create a transaction record
        // const transaction = new Transaction({
        //     sender: sender._id,
        //     receiver: receiver._id,
        //     amount,
        // });
        // await transaction.save();

        await Limit.create({
            senderId, receiverId, amount, newLimit, oldLimit
        })

        return res.status(200).json({
            meta: { msg: "Limit added successfully", status: true }
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}
exports.listLimit = async (req, res) => {


    const { userId } = req.params;
    console.log(userId);


    try {


        const limits = await Limit.aggregate([
            {
                $match: {
                    $or: [{ senderId: new mongoose.Types.ObjectId(userId) }, { receiverId: new mongoose.Types.ObjectId(userId) }],
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'senderId',
                    foreignField: '_id',
                    as: 'sender'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'receiverId',
                    foreignField: '_id',
                    as: 'receiver'
                }
            },
            {
                $unwind: {
                    path: '$sender',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$receiver',
                    preserveNullAndEmptyArrays: true
                }
            },
        ])


        return res.status(200).json({
            meta: { msg: "List found successfully", status: true },
            data: limits
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}