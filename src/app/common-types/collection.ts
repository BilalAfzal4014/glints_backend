export type collectionType = {
    id?: string | number,
    name: string,
    user_id: string | number
}

export type collectionRestaurantMappingType = {
    id?: string | number,
    collection_id: string | number,
    restaurant_id: string | number
}