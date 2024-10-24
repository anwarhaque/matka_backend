const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/config");

//Helpers functions
module.exports.generateSalt = async () => {
    return await bcrypt.genSalt();
};

module.exports.generatePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
};

module.exports.validatePassword = async (
    enteredPassword,
    savedPassword,
    salt
) => {
    return (await this.generatePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.generateSignature = async (payload, expiresIn='30d') => {
    try {
        return await jwt.sign(payload, JWT_SECRET, { expiresIn });
    } catch (error) {
        console.log(error);
        return error;
    }
};

module.exports.validateSignature = async (req) => {
    const token = req.header('authkey');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.profile = decoded;
        return true
    } catch (error) {
        console.log(error);
        return false
    }
};





