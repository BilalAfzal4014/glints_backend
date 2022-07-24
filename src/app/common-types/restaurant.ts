export type saveRestaurantType = {
    id?: string | number,
    name: string
}

export type dayType = {
    id?: string | number,
    day: string,
    startTime: string,
    endTime: string
}

export type restaurantType = saveRestaurantType & {
    days: Array<dayType>
}

export type restaurantTimeType = dayType & {
    restaurantId: number | null
}

export type restaurantFilterType = {
    pageSize: number,
    pageIndex: number,
    filters: {
        collection?: string | number,
        days?: Array<string>,
        name?: string,
        time?: string,
        userId?: string | number
    }
}
