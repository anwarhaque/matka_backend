const { validateSignature } = require('../helper/jwtHelper');

const authAdmin = async (req, res, next) => {
    const authkey = req.header('authkey');
    if (!authkey) {
        return res.status(401).json({ message: 'No authkey, authorization denied' });
    }
    const isAuthorized = await validateSignature(req);

    if (!isAuthorized) {
        return res.status(401).json({
            meta: { msg: "Not Authorized", status: false }
        })
    }


    if (req.profile.userType != 'SUPER') {
        return res.status(401).json({
            meta: { msg: "Not Authorized", status: false }
        })
    }
    if (req.profile.status === 'DEACTIVE') {
        return res.status(401).json({
            meta: { msg: "Your account is inactive", status: false }
        })
    }

    return next();
}
const authAgent = async (req, res, next) => {
    const authkey = req.header('authkey');
    if (!authkey) {
        return res.status(401).json({ message: 'No authkey, authorization denied' });
    }
    const isAuthorized = await validateSignature(req);

    if (!isAuthorized) {
        return res.status(403).json({
            meta: { msg: "Not Authorized", status: false }
        })
    }


    if (req.profile.userType != 'AGENT') {
        return res.status(403).json({
            meta: { msg: "Not Authorized", status: false }
        })
    }
    if (req.profile.status === 'DEACTIVE') {
        return res.status(403).json({
            meta: { msg: "Your account is inactive", status: false }
        })
    }

    return next();
}

const authClient = async (req, res, next) => {
    const authkey = req.header('authkey');
    if (!authkey) {
        return res.status(401).json({ message: 'No authkey, authorization denied' });
    }
    const isAuthorized = await validateSignature(req);

    if (!isAuthorized) {
        return res.status(403).json({
            meta: { msg: "Not Authorized", status: false }
        })
    } 

    if (req.profile.userType != 'CLIENT') {
        return res.status(403).json({
            meta: { msg: "Not Authorized", status: false }
        })
    }
    if (req.profile.status === 'DEACTIVE') {
        return res.status(403).json({
            meta: { msg: "Your account is inactive", status: false }
        })
    }

    console.log('done');
    
    return next();
}

module.exports = { authAdmin, authAgent, authClient };


