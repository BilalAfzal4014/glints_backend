import BaseUseCase from "../../base";
import {collectionRestaurantMappingType} from "../../../common-types/collection";
import CollectionRestaurantMappingRepo from "../../../databases/repository/collection_restaurant_mapping";

export default class CollectionRestaurantMapping extends BaseUseCase {

    private collectionRestaurantMapping: collectionRestaurantMappingType;

    constructor(collectionRestaurantMapping: collectionRestaurantMappingType, transaction = null) {
        super(transaction);
        this.collectionRestaurantMapping = collectionRestaurantMapping
    }

    toggle() {
        return this.performToggleAction();
    }

    performToggleAction() {
        if (this.collectionRestaurantMapping.id) {
            return this.delete();
        } else {
            return this.save();
        }
    }

    delete() {
        // @ts-ignore
        return CollectionRestaurantMappingRepo.delete(this.collectionRestaurantMapping.id);
    }

    save() {
        return CollectionRestaurantMappingRepo.save(this.collectionRestaurantMapping);
    }
}