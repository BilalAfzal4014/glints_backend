import BaseRepo from "./base";
import CollectionModel from "../models/collection";

export default class CollectionRepo extends BaseRepo {

    static save(collection: any, transaction: any = null) {
        if (!collection.id) {
            return CollectionModel.query(transaction).insertAndFetch(collection);
        } else {
            return CollectionModel.query(transaction).updateAndFetchById(collection.id, collection);
        }
    }

    static findByUserId(userId: number) {
        return CollectionModel.query().where("user_id", userId);
    }

    static findByUserAndCollectionId(userId: number, collectionId: number | string) {
        return CollectionModel.query().where("user_id", userId).where("id", collectionId).first();
    }
}
