import express from 'express'
import cors from 'cors'

import restaurants from './api/restaurants.route.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/v1/restaurants', restaurants)
app.use('*', (request, response) => response.status(404).json({ error: 'Not Found' }))

export default app
