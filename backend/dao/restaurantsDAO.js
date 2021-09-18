// #03
import mongodb from 'mongodb'

const ObjectId = mongodb.ObjectId

let restaurants

/**
 * Data Access Object
 *
 * This is the place where we directly access the Database
 */
export default class RestaurantsDAO {
  // Connect to specific collection
  static async injectDB (conn) {
    if (restaurants) return

    try {
      restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection('restaurants')
    } catch (e) {
      console.error(`Unable to connect to data: ${e}`)
    }
  }

  // Get Restaurant data
  static async getRestaurants ({
    filters = null,
    page = 0,
    restaurantsPerPage = 20
  } = {}) {
    let query

    // Setup filters
    if (filters) {
      if ('name' in filters) {
        query = { $text: { $search: filters.name } }
      } else if ('cuisine' in filters) {
        query = { cuisine: { $eq: filters.cuisine } }
      } else if ('zipCode' in filters) {
        query = { 'address.zipcode': { $eq: filters.zipCode } }
      }
    }

    let cursor

    // Find data as per filters, If there is no filters it will return all data
    try {
      cursor = await restaurants.find(query)
    } catch (e) {
      console.error(`Unable to find data ${e}`)
      return { restaurantsList: [], totalNumberOfRestaurants: 0 }
    }

    // Limit as per page count and items per page
    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

    try {
      // Arrange the data
      const restaurantsList = await displayCursor.toArray()
      const totalNumberOfRestaurants = await restaurants.countDocuments(query)

      return {
        restaurantsList,
        totalNumberOfRestaurants
      }
    } catch (e) {
      console.error(`Unable to convert cursor to array:  ${e}`)
      return { restaurantsList: [], totalNumberOfRestaurants: 0 }
    }
  }

  /**
   * Get Restaurant data along with reviews
   *
   * @param {int} id Restaurant Id
   * @returns Restaurant data
   */
  static async getRestaurantById (id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id)
          }
        }, {
          $lookup: {
            from: 'reviews',
            let: {
              id: '$_id'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$restaurant_id', '$$id']
                  }
                }
              }, {
                $sort: {
                  date: -1
                }
              }
            ],
            as: 'reviews'
          }
        }, {
          $addFields: {
            reviews: '$reviews'
          }
        }
      ]

      return await restaurants.aggregate(pipeline).next()
    } catch (e) {
      console.log(`Something went wrong with pipeline : ${e}`)
      throw e
    }
  }

  /**
   * Get all Cuisines
   * @returns Cuisines
   */
  static async getCuisines () {
    let cuisines = []

    try {
      cuisines = await restaurants.distinct('cuisine')
      return cuisines
    } catch (e) {
      console.log(`Unable to get cuisines : ${e}`)
      throw e
    }
  }
}
