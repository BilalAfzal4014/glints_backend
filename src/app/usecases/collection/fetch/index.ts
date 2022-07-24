import CollectionRepo from "../../../databases/repository/collection";

export default class FetchCollection {
    static fetch(userId: number) {
        return CollectionRepo.findByUserId(userId);
    }

    static fetchSingle(userId: number, collectionId: number | string){
        return CollectionRepo.findByUserAndCollectionId(userId, collectionId);
    }
}