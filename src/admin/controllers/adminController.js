const { generateSalt, generatePassword, generateSignature, validatePassword } = require("../../helper/jwtHelper");
const { Admin } = require("../models/adminModel");

exports.signup = async (req, res) => {
    try {

        const { name, username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                meta: { msg: "Params required.", status: false }
            });
        }
        const isAdmin = await Admin.findOne({ username });
        if (isAdmin) {
            return res.status(400).json({
                meta: { msg: "Email already exist", status: false }
            });
        }

        const salt = await generateSalt();

        const userPassword = await generatePassword(password, salt);


        const admin = await Admin.create({ username, password: userPassword, name, salt, adminType: 'ADMIN' });
        if (!admin) {
            return res.status(500).json({
                meta: { msg: "Admin not created", status: false }
            })
        }

        return res.status(200).json({
            meta: { msg: "Admin created successfully", status: true }
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                meta: { msg: "Params required.", status: false }
            });
        }

        const admin = await Admin.findOne({ username, status: "ACTIVE" });
        if (!admin) {
            return res.status(404).json({
                meta: { msg: "User not exist", status: false }
            });
        }

        const validPassword = await validatePassword(password, admin.password, admin.salt);

        if (!validPassword) {
            return res.status(401).json({
                meta: { msg: "Invalid credentials", status: false }
            })
        }


        const payload = { username: admin.username, _id: admin._id, status: admin.status, adminType: admin.adminType }
        const token = await generateSignature(payload, '30d');
        return res.status(200).json({
            meta: { msg: "Admin login successfully", status: true },
            token,
            data: admin
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.profile = async (req, res) => {
    try {

        const { _id } = req.profile;

        const admin = await Admin.findById(_id);
        if (!admin) {
            return res.status(404).json({
                meta: { msg: "Admin not exist", status: false }
            });
        }
        return res.status(200).json({
            meta: { msg: "Admin found successfully", status: true },
            data: admin
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {

        const { username } = req.profile;
        const { password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                meta: { msg: "Params required.", status: false }
            });
        }

        // Update the user's password
        const salt = await generateSalt();
        const adminPassword = await generatePassword(password, salt);

        const admin = await Admin.findOneAndUpdate({ username }, { $set: { password: adminPassword, salt } }, { new: true })
        if (!admin) {
            return res.status(500).json({
                meta: { msg: "Password not updated", status: false }
            });
        }
        return res.status(200).json({
            meta: { msg: "Password has been updated", status: true }
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

