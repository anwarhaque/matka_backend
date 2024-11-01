const { generateSignature, validatePassword, generateSalt, generatePassword } = require("../../../helper/jwtHelper");
const User = require("../models/userModel");

exports.clientLogin = async (req, res) => {
    try {

        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({
                meta: { msg: "Params required.", status: false }
            });
        }

        const user = await User.findOne({ userName, userType: 'CLIENT' });
        if (!user) {
            return res.status(404).json({
                meta: { msg: "Client not exist", status: false }
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
        const token = await generateSignature(payload, '30d');
        return res.status(200).json({
            meta: { msg: "Client login successfully", status: true },
            token,
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
