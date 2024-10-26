const getNextUserName = require("../../helper/getNextUserName");
const { generateSalt, generatePassword, generateSignature, validatePassword } = require("../../helper/jwtHelper");
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

        const { name, mobileNumber, password, share, reference } = req.body;

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
            password: 
            hashedPassword, 
            name, 
            salt, 
            userType: 'AGENT',
            share,
            reference 
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

exports.createClient = async (req, res) => {
    try {

        const { name, mobileNumber, password, rate, clientCommission, superAgentCommission, share, reference } = req.body;

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
            name, 
            salt, 
            userType: 'CLIENT',
            rate, 
            clientCommission, 
            superAgentCommission, 
            share, 
            reference 
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

        const user = await User.findOneAndUpdate({ _id }, { $set: { password: hashedPassword, salt } }, { new: true })
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
