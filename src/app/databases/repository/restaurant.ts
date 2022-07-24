import BaseRepo from "./base";
import RestaurantModel from "../models/restaurant";
import {restaurantFilterType} from "../../common-types/restaurant";


export default class RestaurantRepo extends BaseRepo {

    static save(restaurant: any, transaction: any = null) {
        if (!restaurant.id) {
            return RestaurantModel.query(transaction).insertAndFetch(restaurant);
        } else {
            return RestaurantModel.query(transaction).updateAndFetchById(restaurant.id, restaurant);
        }
    }

    static fetchWithPagination({pageSize, pageIndex, filters}: restaurantFilterType) {
        return RestaurantModel.fetchWithPagination({pageSize, pageIndex, filters});
    }
}
