import BaseRepo from "./base";
import CollectionRestaurantMappingModel from "../models/collection_restaurant_mapping";

export default class CollectionRestaurantMappingRepo extends BaseRepo {

    static save(collectionRestaurant: any, transaction: any = null) {
        if (!collectionRestaurant.id) {
            return CollectionRestaurantMappingModel.query(transaction).insertAndFetch(collectionRestaurant);
        } else {
            return CollectionRestaurantMappingModel.query(transaction).updateAndFetchById(collectionRestaurant.id, collectionRestaurant);
        }
    }

    static delete(id: number | string, transaction: any = null) {
        return CollectionRestaurantMappingModel.query(transaction).delete().where("id", id);
    }
}
