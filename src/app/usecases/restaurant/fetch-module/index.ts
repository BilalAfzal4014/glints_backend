import RestaurantRepo from "../../../databases/repository/restaurant";
import {restaurantFilterType} from "../../../common-types/restaurant";

export default class FetchRestaurantModule {

    static fetchModuleWithPagination(params: restaurantFilterType, userId: number) {
        const {pageSize, pageIndex, filters} = params;
        filters.userId = userId;
        return RestaurantRepo.fetchWithPagination({pageSize, pageIndex, filters});
    }
}