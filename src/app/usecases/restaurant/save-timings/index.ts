import BaseUseCase from "../../base";
import {restaurantTimeType} from "../../../common-types/restaurant";
import RestaurantTimingRepo from "../../../databases/repository/restaurant-timing";


export default class SaveRestaurantTiming extends BaseUseCase {
    private day: restaurantTimeType;

    constructor(day: restaurantTimeType, transaction = null) {
        super(transaction);
        this.day = day
    }

    save() {
        return this.performSaveAction();
    }

    performSaveAction() {
        return RestaurantTimingRepo.save({
            ...(this.day.id && {id: this.day.id}),
            restaurant_id: this.day.restaurantId,
            day: this.day.day,
            opening_time: this.day.startTime,
            closing_time: this.day.endTime
        });
    }

}