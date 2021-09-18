// #02
import ReviewsDAO from '../dao/reviewsDAO.js'

export default class ReviewsController {
  // Add a new review
  static async apiPostReview (req, res, next) {
    try {
      // Access request body data
      const restaurantId = req.body.restaurant_id
      const review = req.body.review
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }
      const date = new Date()

      await ReviewsDAO.addReview(
        restaurantId,
        userInfo,
        review,
        date
      )

      res.json({ status: 'success' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  // Update Review
  static async apiUpdateReview (req, res, next) {
    try {
      const reviewId = req.body.review_id
      const review = req.body.review
      const userId = req.body.user_id
      const date = new Date()

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        userId,
        review,
        date
      )

      const {
        error,
        modifiedCount
      } = reviewResponse

      if (error) res.status(400).json({ error })

      if (modifiedCount === 0) {
        throw new Error(
          'unable to update review - User may be not the poser'
        )
      }

      res.json({ status: 'success' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  // Delete a review
  static async apiDeleteReview (req, res, next) {
    try {
      const reviewId = req.query.id
      const userId = req.body.user_id

      await ReviewsDAO.deleteReview(
        reviewId,
        userId
      )

      res.json({ status: 'success' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}
