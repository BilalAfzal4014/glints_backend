import BaseUseCase from "../../base";
import {dayType} from "../../../common-types/restaurant";
import SaveRestaurantTiming from "./index";


export default class SaveRestaurantTimingsCollection extends BaseUseCase {
    private days: Array<dayType>;
    private restaurantId: number | null;
    private saveRestaurantTimingInteractions: Array<SaveRestaurantTiming>;

    constructor(days: Array<dayType>, restaurantId: number | null, transaction = null) {
        super(transaction);
        this.restaurantId = restaurantId;
        this.days = days
        this.saveRestaurantTimingInteractions = [];
    }

    set RestaurantId(restaurantId: number){
        this.restaurantId = restaurantId
    }

    save() {
        return this.performSaveAction();
    }

    performSaveAction() {
        this.initializeUseCases();
        return this.multipleSave();
    }

    initializeUseCases() {
        for (const day of this.days) {
            const saveRestaurantTimingInteraction = new SaveRestaurantTiming({
                ...day,
                restaurantId: this.restaurantId
            }, this.transactionInstance)
            this.saveRestaurantTimingInteractions.push(saveRestaurantTimingInteraction);
        }
    }

    multipleSave() {
        const savePromises = [];
        for (const saveRestaurantTimingInteraction of this.saveRestaurantTimingInteractions) {
            savePromises.push(saveRestaurantTimingInteraction.save());
        }
        return Promise.all(savePromises);
    }


}