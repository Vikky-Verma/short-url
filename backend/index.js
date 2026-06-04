require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { connectToMongoDB } = require('./connect')
const { checkForAuthentication, restrictTo } = require('./middlewares/auth')
const URL = require('./models/url')

const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')

const app = express()
const port = process.env.PORT || 8001

// NEW
connectToMongoDB(process.env.MONGO_URI)
.then(() => console.log('MongoDB Atlas Connected ✅'))
.catch(err => console.log('MongoDB Error:', err))

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://short-url-alpha-sage.vercel.app',
    ],
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(checkForAuthentication)

// SHORT URL REDIRECT ROUTE
app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId

    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } }
    )

    if (!entry) {
        return res.status(404).json({
            error: 'Short URL not found'
        })
    }

    return res.redirect(entry.redirectUrl)
})

app.use('/url', restrictTo(['NORMAL', 'ADMIN']), urlRoute)
app.use('/user', userRoute)
app.use('/', staticRoute)



app.listen(port, () => console.log(`Server Started at PORT: ${port}`))