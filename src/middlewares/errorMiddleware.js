
const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        meta: { msg: err.message || 'Internal Server Error', status: false }
    });
};

module.exports = errorHandler;
