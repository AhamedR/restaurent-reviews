
// #01
import express from 'express'

import RestaurantController from './restaurants.controller.js'

const router = express.Router()

/**
 * Here comes the all routes
 * and We call relevant Controllers according to our routes
 */
router.route('/').get(RestaurantController.apiGetRestaurants)

export default router
