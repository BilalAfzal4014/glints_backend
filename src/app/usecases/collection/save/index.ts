import BaseUseCase from "../../base";
import {collectionType} from "../../../common-types/collection";
import CollectionRepo from "../../../databases/repository/collection";

export default class SaveCollection extends BaseUseCase {

    private collection: collectionType;

    constructor(collection: collectionType, transaction = null) {
        super(transaction);
        this.collection = collection
    }

    save() {
        return this.performSaveAction();
    }

    performSaveAction() {
        return CollectionRepo.save(this.collection);
    }
}