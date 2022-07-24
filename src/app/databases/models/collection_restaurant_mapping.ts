import BaseModel from "../models/base";

export default class CollectionRestaurantMappingModel extends BaseModel {
    static get tableName() {
        return "collection_restaurant_mapping";
    }
}
