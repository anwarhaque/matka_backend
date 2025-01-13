const Marquee = require('../model/marqueeModel');

exports.addMarquee = async (req, res) => {
    try {
        const { notification } = req.body;
        if (!notification) {
            return res.status(400).json({
                meta: { msg: "Params required", status: false }
            });
        }
        const marquee = await Marquee.create({ notification })
        return res.status(200).json({
            meta: { msg: "Marquee added successfully", status: true },
            data: marquee
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}
exports.updateMarquee = async (req, res) => {
    try {
        const { marqueeId } = req.params
        const { notification} = req.body;
        if (!notification) {
            return res.status(400).json({
                meta: { msg: "Params required", status: false }
            });
        }
        const marquee = await Marquee.findByIdAndUpdate(marqueeId, { $set: { notification } }, { new: true })
        return res.status(200).json({
            meta: { msg: "Marquee updated successfully", status: true },
            data: marquee
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}

exports.getMarquee = async (req, res) => {
    try {
      
        const marquee = await Marquee.findOne({})
        if (!marquee) {
            return res.status(404).json({
                meta: { msg: "Marquee not found", status: false }
            });
        }

        return res.status(200).json({
            meta: { msg: "Marquee found successfully", status: true },
            data: marquee
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}
