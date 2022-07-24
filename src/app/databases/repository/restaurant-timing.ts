import BaseRepo from "./base";
import RestaurantTimingModel from "../models/restaurant-timing";

export default class RestaurantTimingRepo extends BaseRepo {

    static save(restaurantTiming: any, transaction: any = null) {
        if (!restaurantTiming.id) {
            return RestaurantTimingModel.query(transaction).insertAndFetch(restaurantTiming);
        } else {
            return RestaurantTimingModel.query(transaction).updateAndFetchById(restaurantTiming.id, restaurantTiming);
        }
    }

}
