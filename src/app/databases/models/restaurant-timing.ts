import BaseModel from "../models/base";

export default class RestaurantTimingModel extends BaseModel {
    static get tableName() {
        return "restaurant_timing";
    }
}
