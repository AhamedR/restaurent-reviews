
// #01
import express from 'express'

import RestaurantController from './restaurants.controller.js'
import ReviewsController from './reviews.controller.js'

const router = express.Router()

/**
 * Here comes the all routes
 * and We call relevant Controllers according to our routes
 */
router.route('/').get(RestaurantController.apiGetRestaurants)
router.route('/id/:id').get(RestaurantController.apiGetRestaurantById)
router.route('/cuisines').get(RestaurantController.apiGetRestaurantCuisines)

router.route('/review')
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview)

export default router
