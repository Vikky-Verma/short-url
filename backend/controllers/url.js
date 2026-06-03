const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required" });

    const shortId = nanoid(8);
    await URL.create({
        shortId,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });

    return res.status(201).json({
        shortId,
        shortUrl: `http://localhost:8001/url/${shortId}`
    });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    if (!result) return res.status(404).json({ error: "URL not found" });

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

async function handleGetAllUrls(req, res) {
    const urls = await URL.find({ createdBy: req.user._id })
        .sort({ createdAt: -1 })
    return res.json(urls)
}

async function handleGetAdminUrls(req, res) {
    const urls = await URL.find({})
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
    return res.json(urls)
}

async function handleGetUserStats(req, res) {
    const stats = await URL.aggregate([
        {
            $group: {
                _id: '$createdBy',
                totalUrls: { $sum: 1 },
                totalClicks: { $sum: { $size: '$visitHistory' } }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                name: '$user.name',
                email: '$user.email',
                totalUrls: 1,
                totalClicks: 1
            }
        },
        { $sort: { totalUrls: -1 } }
    ])
    return res.json(stats)
}


async function handleDeleteUrl(req, res) {
    const { shortId } = req.params

    const url = await URL.findOne({ shortId })

    if (!url) return res.status(404).json({ error: 'URL not found' })

    // Normal user can only delete their own URLs
    // Admin can delete any URL
    if (req.user.role !== 'ADMIN' && url.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' })
    }

    await URL.deleteOne({ shortId })
    return res.status(200).json({ message: 'URL deleted successfully' })
}


module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleGetAllUrls,
    handleGetAdminUrls,
    handleGetUserStats,
    handleDeleteUrl
};