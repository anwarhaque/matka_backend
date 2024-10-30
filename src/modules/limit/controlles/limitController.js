const User = require("../../user/models/userModel");
const Limit = require("../models/limitModel");
const mongoose = require('mongoose');


exports.updateAgentLimit = async (req, res) => {


    const { agentId, adminId, amount } = req.body;

    try {

        if (amount == 0) {
            return res.status(400).json({
                meta: { msg: "Invalid amount", status: false }
            });
        }

        // Fetch sender and receiver
        const agent = await User.findById(agentId);
        const admin = await User.findById(adminId);

        if (!agent || !admin) {
            return res.status(404).json({
                meta: { msg: "Agent or Admin not found", status: false }
            });

        }

        if (amount > 0) {
            await Limit.create({
                agentId,
                amount,
                oldLimit: agent.limit,
                newLimit: agent.limit + amount,
                userId: adminId,
            })
            agent.limit += amount;

        } else {
            const _amount = Math.abs(amount)
            await Limit.create({
                agentId,
                amount:-_amount,
                oldLimit: agent.limit,
                newLimit: agent.limit - _amount,
                userId: adminId,
            })
            agent.limit -= _amount;
        }

        await agent.save();


        return res.status(200).json({
            meta: { msg: "Limit added successfully", status: true }
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}

exports.updateClientLimit = async (req, res) => {


    const { clientId, agentId, amount } = req.body;

    try {

        if (amount == 0) {
            return res.status(400).json({
                meta: { msg: "Invalid amount", status: false }
            });
        }

        // Fetch sender and receiver
        const client = await User.findById(clientId);
        const agent = await User.findById(agentId);

        if (!client || !agent) {
            return res.status(404).json({
                meta: { msg: "Client or Agent not found", status: false }
            });

        }


        if (amount > 0) {

            if (agent.limit < amount) {
                return res.status(400).json({
                    meta: { msg: "Insufficient limit", status: false }
                });
            }

            await Limit.create({
                agentId,
                oldLimit: agent.limit,
                newLimit: agent.limit - amount,
                amount: -amount,
                userId: clientId
            })
            await Limit.create({
                clientId,
                oldLimit: client.limit,
                newLimit: client.limit + amount,
                amount: amount,
                userId: agentId
            })

            agent.limit -= amount;
            client.limit += amount;



        } else {
            const _amount = Math.abs(amount)
           
            await Limit.create({
                agentId,
                oldLimit: agent.limit,
                newLimit: agent.limit + _amount,
                amount: _amount,
                userId: clientId
            })
            await Limit.create({
                clientId,
                oldLimit: client.limit,
                newLimit: client.limit - _amount,
                amount: -_amount,
                userId: agentId
            })

            agent.limit += _amount;
            client.limit -= _amount;
        }



        // Save the users' new balances
        await agent.save();
        await client.save();


        return res.status(200).json({
            meta: { msg: "Limit added successfully", status: true }
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}

exports.limitHistory = async (req, res) => {



    try {
        const { agentId, clientId } = req.query;


        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;


        const filter = {
            ...(agentId && { agentId: new mongoose.Types.ObjectId(agentId) }),
            ...(clientId && { clientId: new mongoose.Types.ObjectId(clientId) }),
        }
        // Aggregation pipeline
        const pipeline = [
            {

                $match: filter
            },
            {
                $sort: { createdAt: -1 }
            },
            {

                $lookup: {
                    from: 'users',
                    localField: 'agentId',
                    foreignField: '_id',
                    as: 'agent',
                },
            },
            {

                $unwind: {
                    path: '$agent',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'client',
                },
            },
            {

                $unwind: {
                    path: '$client',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {

                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                },
            },
            
            {
                // Pagination stages
                $skip: skip, // Number of documents to skip
            },
            {
                $limit: limit, // Number of documents to return
            },
        ];

        const limits = await Limit.aggregate(pipeline)

        const totalCount = await Limit.countDocuments(filter)
        return res.status(200).json({
            meta: { msg: "List found successfully", status: true },
            data: limits,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        });



    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}