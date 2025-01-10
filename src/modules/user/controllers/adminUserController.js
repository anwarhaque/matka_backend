const { default: mongoose } = require("mongoose");
const getNextUserName = require("../../../helper/getNextUserName");
const { generateSalt, generatePassword, generateSignature, validatePassword } = require("../../../helper/jwtHelper");
const User = require("../models/userModel");


exports.superLogin = async (req, res) => {
    try {

        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({
                meta: { msg: "Params required.", status: false }
            });
        }

        const user = await User.findOne({ userName, userType: 'SUPER' });
        if (!user) {
            return res.status(404).json({
                meta: { msg: "Super not exist", status: false }
            });
        }
        if (!user.status == "DEACTIVE") {
            return res.status(401).json({
                meta: { msg: "Your account is inactive", status: false }
            });
        }

        const validPassword = await validatePassword(password, user.password, user.salt);

        if (!validPassword) {
            return res.status(401).json({
                meta: { msg: "Invalid credentials", status: false }
            })
        }


        const payload = { userName: user.userName, _id: user._id, status: user.status, userType: user.userType }
        const token = await generateSignature(payload, '1d');
        return res.status(200).json({
            meta: { msg: "Super login successfully", status: true },
            token,
            data: user
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.createAgent = async (req, res) => {
    try {

        const { name, mobileNumber, password, agentShare } = req.body;

        if (!name || !mobileNumber || !password) {
            return res.status(400).json({
                meta: { msg: "Params required.", status: false }
            });
        }
        const isUser = await User.findOne({ mobileNumber });
        if (isUser) {
            return res.status(400).json({
                meta: { msg: "Mobile number already exist", status: false }
            });
        }

        const salt = await generateSalt();

        const hashedPassword = await generatePassword(password, salt);

        // Get the next available userName
        const userName = await getNextUserName();
        const createData = {
            mobileNumber,
            userName,
            password: hashedPassword,
            plane_password: password,
            name,
            salt,
            userType: 'AGENT',
            agentShare
        }
        const user = await User.create(createData);
        if (!user) {
            return res.status(500).json({
                meta: { msg: "Agent not created", status: false }
            })
        }

        return res.status(200).json({
            meta: { msg: "Agent created successfully", status: true },
            data: user
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.updateAgent = async (req, res) => {
    try {

        const { agentId } = req.params
        const { name, mobileNumber, password, agentShare } = req.body;

        if (!name || !mobileNumber || !password) {
            return res.status(400).json({
                meta: { msg: "Params required.", status: false }
            });
        }


        const salt = await generateSalt();

        const hashedPassword = await generatePassword(password, salt);


        const updateData = {
            mobileNumber,
            password: hashedPassword,
            plane_password: password,
            name,
            salt,
            agentShare
        }
        const user = await User.findByIdAndUpdate({ _id: agentId }, { $set: updateData });
        if (!user) {
            return res.status(500).json({
                meta: { msg: "Agent not updated", status: false }
            })
        }

        return res.status(200).json({
            meta: { msg: "Agent updated successfully", status: true },
            data: user
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.createClient = async (req, res) => {
    try {

        const { agentId, name, mobileNumber, password, agentCommission, clientCommission, clientShare, rate } = req.body;

        if (!agentId || !name || !mobileNumber || !password) {
            return res.status(400).json({
                meta: { msg: "Params required.", status: false }
            });
        }
        const isUser = await User.findOne({ mobileNumber });
        if (isUser) {
            return res.status(400).json({
                meta: { msg: "Mobile number already exist", status: false }
            });
        }

        const salt = await generateSalt();

        const hashedPassword = await generatePassword(password, salt);

        // Get the next available userName
        const userName = await getNextUserName();

        const createData = {
            agentId,
            name,
            mobileNumber,
            userName,
            password: hashedPassword,
            plane_password: password,
            salt,
            userType: 'CLIENT',
            agentCommission,
            clientCommission,
            clientShare,
            rate
        }
        const user = await User.create(createData);
        if (!user) {
            return res.status(500).json({
                meta: { msg: "Client not created", status: false }
            })
        }

        return res.status(200).json({
            meta: { msg: "Client created successfully", status: true },
            data: user
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.updateClient = async (req, res) => {
    try {
        const { clientId } = req.params
        const { agentId, name, mobileNumber, password, agentCommission, clientCommission, clientShare, rate } = req.body;

        if (!agentId || !name || !mobileNumber || !password) {
            return res.status(400).json({
                meta: { msg: "Params required.", status: false }
            });
        }

        const salt = await generateSalt();

        const hashedPassword = await generatePassword(password, salt);

        const createData = {
            name,
            agentId,
            mobileNumber,
            password: hashedPassword,
            plane_password: password,
            salt,
            agentCommission,
            clientCommission,
            clientShare,
            rate
        }
        const user = await User.findOneAndUpdate({ _id: clientId }, createData);
        if (!user) {
            return res.status(500).json({
                meta: { msg: "Client not updated", status: false }
            })
        }

        return res.status(200).json({
            meta: { msg: "Client updated successfully", status: true },
            data: user
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {

        const { _id } = req.profile;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({
                meta: { msg: "Client not exist", status: false }
            });
        }
        return res.status(200).json({
            meta: { msg: "Client found successfully", status: true },
            data: user
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {

        const { _id } = req.profile;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                meta: { msg: "Params required.", status: false }
            });
        }

        // Update the user's password
        const salt = await generateSalt();
        const hashedPassword = await generatePassword(password, salt);

        const user = await User.findOneAndUpdate({ _id }, { $set: { password: hashedPassword, salt, plane_password: password } }, { new: true })
        if (!user) {
            return res.status(500).json({
                meta: { msg: "Password not updated", status: false }
            });
        }
        return res.status(200).json({
            meta: { msg: "Password updated successfully", status: true }
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.getUser = async (req, res) => {
    try {

        const { _id } = req.params
        const user = await User.findOne({ _id });
        if (!user) {
            return res.status(500).json({
                meta: { msg: "User not found", status: false }
            })
        }

        return res.status(200).json({
            meta: { msg: "User found successfully", status: true },
            data: user
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.listUser = async (req, res) => {
    try {

        const { userType, agentId } = req.query
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = { userType, ...(agentId && { agentId: new mongoose.Types.ObjectId(agentId) }) }
        const users = await User.aggregate([
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
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                // Pagination stages
                $skip: skip, // Number of documents to skip
            },
            {
                $limit: limit, // Number of documents to return
            },
        ])

        // if (!users.length) {
        //     return res.status(200).json({
        //         meta: { msg: `${userType} not found`, status: false }
        //     })
        // }


        const totalCount = await User.countDocuments(filter);

        return res.status(200).json({
            meta: { msg: `${userType} found successfully`, status: true },
            data: users,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.changeStatus = async (req, res) => {
    try {

        const { _id } = req.params;
        const { status } = req.body;


        const user = await User.findOneAndUpdate({ _id }, { $set: { status } }, { new: true })
        if (!user) {
            return res.status(500).json({
                meta: { msg: "Status not updated", status: false }
            });
        }
        return res.status(200).json({
            meta: { msg: "Status updated successfully", status: true }
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.deleteUser = async (req, res) => {
    try {

        const { _id } = req.params;

        const user = await User.findOneAndDelete({ _id })
        if (!user) {
            return res.status(500).json({
                meta: { msg: "User not delete", status: false }
            });
        }
        return res.status(200).json({
            meta: { msg: "User deleted successfully", status: true }
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
