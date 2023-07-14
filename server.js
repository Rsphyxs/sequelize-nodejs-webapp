const express = require('express')
const cors = require('cors')

const app = express()

const corOptions = {
    origin: 'https://localhost:8081'
}

// middleware
app.use(cors(corOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routers
const router = require('./routes/userRouter.js')
app.use(router)

app.get('/', (req, res) => {
    res.json({message: "hello, its me you looking for"})
})

//port
const PORT = process.env.PORT || 8081

//server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})