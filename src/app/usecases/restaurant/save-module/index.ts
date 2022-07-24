import BaseUseCase from "../../base";
import {restaurantType} from "../../../common-types/restaurant";
import SaveRestaurant from "../save";
import SaveRestaurantTimingsCollection from "../save-timings/save-restaurant-timings-collection";

export default class SaveRestaurantModule extends BaseUseCase {
    private restaurant: restaurantType;
    private saveRestaurantInteract: SaveRestaurant | null;
    private saveRestaurantTimingCollectionInteract: SaveRestaurantTimingsCollection | null;

    constructor(restaurant: restaurantType, transaction = null) {
        super(transaction);
        this.restaurant = restaurant
        this.saveRestaurantInteract = null;
        this.saveRestaurantTimingCollectionInteract = null;
    }

    save() {
        return this.getTransactionInstance()
            .then(() => {
                this.initializeUseCases();
                return this.performSaveAction();
            }).then(() => {
                return this.commitTransaction();
            }).catch((error) => {
                this.rollbackTransaction();
                throw error;
            });
    }

    saveWithoutTransacting() {
        this.initializeUseCases();
        return this.performSaveAction();
    }

    performSaveAction() {
        // @ts-ignore
        return this.saveRestaurant()
            .then(() => {
                return this.saveRestaurantTimingCollection();
            })
    }

    initializeUseCases() {
        this.saveRestaurantInteract = new SaveRestaurant({
            ...(this.restaurant.id && {id: this.restaurant.id}),
            name: this.restaurant.name
        }, this.transactionInstance);
        this.saveRestaurantTimingCollectionInteract = new SaveRestaurantTimingsCollection(this.restaurant.days, null, this.transactionInstance);
    }

    saveRestaurant() {
        return this.saveRestaurantInteract?.save()
            .then((restaurant) => {
                // @ts-ignore
                this.saveRestaurantTimingCollectionInteract?.RestaurantId = restaurant.id;
            });
    }

    saveRestaurantTimingCollection() {
        return this.saveRestaurantTimingCollectionInteract?.save();
    }

}