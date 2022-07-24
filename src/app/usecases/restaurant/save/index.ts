import BaseUseCase from "../../base";
import RestaurantRepo from "../../../databases/repository/restaurant";
import {saveRestaurantType} from "../../../common-types/restaurant";

export default class SaveRestaurant extends BaseUseCase{
    private restaurant: saveRestaurantType;
    constructor(restaurant: saveRestaurantType, transaction = null) {
        super(transaction);
        this.restaurant = restaurant
    }

    save(){
        return this.performSaveAction();
    }

    performSaveAction(){
        return RestaurantRepo.save(this.restaurant);
    }
}