import BaseModel from "../models/base";

export default class CollectionModel extends BaseModel {
    static get tableName() {
        return "collection";
    }
}
