
// #02
import RestaurantsDAO from '../dao/restaurantsDAO.js'

// Controller
export default class RestaurantController {
  /**
   * Get Restaurants as per Filters
   *
   * @param {object} req Request Object
   * @param {Object} res Response Object
   * @param {object} next
   */
  static async apiGetRestaurants (req, res, next) {
    const restaurantsPerPage = parseInt(req.query.restaurantsPerPage || 20)
    const page = parseInt(req.query.page || 0)

    const filters = {}

    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine
    } else if (req.query.zipcode) {
      filters.zipCode = req.query.zipcode
    } else if (req.query.name) {
      filters.name = req.query.name
    }

    const { restaurantsList, totalNumberOfRestaurants } = await RestaurantsDAO.getRestaurants({
      filters,
      page,
      restaurantsPerPage
    })

    const response = {
      restaurants: restaurantsList,
      page,
      filters,
      entries_per_page: restaurantsPerPage,
      total_result: totalNumberOfRestaurants
    }

    res.json(response)
  }

  /**
   * Get restaurant by id along with the reviews
   *
   * @param {object} req Request Object
   * @param {Object} res Response Object
   * @param {object} next
   */
  static async apiGetRestaurantById (req, res, next) {
    try {
      const id = req.params.id || {}
      const restaurant = await RestaurantsDAO.getRestaurantById(id)

      if (!restaurant) {
        res.status(404).json({ error: 'Restaurant Not Found' })

        return
      }

      res.json(restaurant)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  /**
   * Get all cuisines
   *
   * @param {object} req Request Object
   * @param {Object} res Response Object
   * @param {object} next
   */
  static async apiGetRestaurantCuisines (req, res, next) {
    try {
      const cuisines = await RestaurantsDAO.getCuisines()

      res.json(cuisines)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
