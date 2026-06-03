const express = require('express')
const {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleGetAllUrls,
    handleGetAdminUrls,
    handleGetUserStats,
    handleDeleteUrl,
} = require('../controllers/url')
const { restrictTo } = require('../middlewares/auth')

const router = express.Router()

router.post('/', handleGenerateNewShortURL)
router.get('/', handleGetAllUrls)
router.get('/admin/all', restrictTo(['ADMIN']), handleGetAdminUrls)
router.get('/admin/stats', restrictTo(['ADMIN']), handleGetUserStats)
router.get('/analytics/:shortId', handleGetAnalytics)
router.delete('/:shortId', handleDeleteUrl)

module.exports = router