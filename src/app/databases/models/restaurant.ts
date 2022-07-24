import BaseModel from "../models/base";
import {restaurantFilterType} from "../../common-types/restaurant";
import {knex} from "../sql-connection";


export default class RestaurantModel extends BaseModel {
    static get tableName() {
        return "restaurant";
    }

    static fetchWithPaginationV1({pageSize, pageIndex, filters}: restaurantFilterType) {

        const query = `
            SELECT restaurant.id, restaurant.name,
                concat('[', group_concat(concat('{"id":', restaurant_timing.id, ',"day":"', day, '","opening_time":"', opening_time, '","closing_time":"', closing_time, '"}')), ']') as slots
            FROM restaurant join restaurant_timing on restaurant.id = restaurant_timing.restaurant_id
            where 1 = 1 
            ${(function(){
                let queryString = ``;
                if(filters.time){
                    queryString += ` and (
                        case when closing_time >= opening_time
                        then opening_time <= :time and closing_time >= :time
                        else opening_time <= :time or closing_time >= :time
                        end
                    )`;   
                }
                if(filters.name){
                    queryString += ` and name like '${filters.name}%'`;
                }
                if(filters.days){
                    for(let i = 0; i < filters.days.length; i++){
                        if(i === 0){
                            queryString += ` and ( day = :day_${i}`;
                        }
                        else{
                            queryString += ` or day = :day_${i}`
                        }
                        
                        if(i === filters.days.length - 1){
                            queryString += ` ) `;
                        }
                    }
                }
                return queryString;
            })()}
            group by restaurant.id, restaurant.name
            limit ${pageSize}
            offset ${pageIndex * pageSize}
        `;

        return knex.raw(query, {
            ...(filters.time && {time: filters.time}),
            ...(function () {
                const hash: {
                    [key: string]: any
                } = {};
                if (filters.days) {
                    for (let i = 0; i < filters.days.length; i++) {
                        hash[`day_${i}`] = filters.days[i];
                    }
                }
                return hash;
            }())
        }).then(([result]) => {
            for (const element of result) {
                element.slots = JSON.parse(element.slots);
            }
            return result;
        });
    }

    static fetchWithPagination({pageSize, pageIndex, filters}: restaurantFilterType) {

        const query = `
                select q1.id, q1.name, q1.slots, ifnull(q2.restaurant_collections, '[]') as restaurant_collections
                from (
                    select res1.id, res1.name,
                    concat('[', group_concat(concat('{"id":', res1.restaurant_timing_id, ',"matched":', res1.matched, ',"day":"', res1.day, '","opening_time":"', res1.opening_time, '","closing_time":"', res1.closing_time, '"}')), ']') as slots
                    from (
                        select restaurant.id, restaurant.name, restaurant_timing.id as restaurant_timing_id, restaurant_timing.day, restaurant_timing.opening_time, restaurant_timing.closing_time,
                            case when closing_time >= opening_time
                            then  if(1 = 1 ${filters.time ? " and opening_time <= :time and closing_time >= :time": ""} ${filters.days && filters.days.length && filters.days[0] !== "all" ? " and day in (:days)" : ""}, 1, 0)
                            else if(1 = 1 ${filters.time ? "and (opening_time <= :time or closing_time >= :time)" : ""} ${filters.days && filters.days.length && filters.days[0] !== "all" ? " and day in (:days)" : ""}, 1, 0)
                            end as matched
                        from restaurant join restaurant_timing on restaurant.id = restaurant_timing.restaurant_id
                    ) as res1
                    where exists (
                            select restaurant.id
                            FROM restaurant join restaurant_timing on restaurant.id = restaurant_timing.restaurant_id
                            where restaurant.id = res1.id 
                            ${
                                filters.time ?
                                `and (
                                    case when closing_time >= opening_time
                                    then opening_time <= :time and closing_time >= :time
                                    else opening_time <= :time or closing_time >= :time
                                    end
                                )`: ""
                            }
                            ${filters.days && filters.days.length && filters.days[0] !== "all" ? " and restaurant_timing.day in (:days)": ""}
                        )
                    group by res1.id, res1.name
                ) as q1 left join (
                    select collection_restaurant_mapping.restaurant_id,
                        concat('[', group_concat(concat('{"collection_id":', collection_restaurant_mapping.collection_id, ',"collection_restaurant_mapping_id":', collection_restaurant_mapping.id, ',"collection_name":"', collection.name, '"}')), ']') as restaurant_collections,
                        group_concat(collection.id) as collection_ids
                    from collection join collection_restaurant_mapping on collection.id = collection_restaurant_mapping.collection_id
                    where 1 = 1 ${filters.userId ? " and collection.user_id = :userId": ""}
                    group by collection_restaurant_mapping.restaurant_id
                ) as q2 on q1.id = q2.restaurant_id
                where 1 = 1 ${filters.collection  && filters.collection !== "all" ? " and FIND_IN_SET(:collection, q2.collection_ids) > 0" : ""} ${filters.name ? ` and name like '${filters.name}%'` : ""} 
                
        `;

        const bindings = {
            ...(filters.userId && {userId: filters.userId}),
            ...(filters.collection && filters.collection !== "all" && {collection: filters.collection}),
            ...(filters.time && {time: filters.time}),
            ...(filters.days && filters.days.length && filters.days[0] !== "all" && {days: filters.days}),
        };

        const countQuery = `
            select count(*) as count_of_filtered_rows
            from (${query}) as q3
        `

        const paginatedQuery = query + `
                limit ${pageSize}
                offset ${pageIndex * pageSize}
        `;

        return Promise.all([
            knex.raw(countQuery, bindings),
            knex.raw(paginatedQuery, bindings)
        ]).then((result) => {
            const countOfFilteredRows = result[0][0][0].count_of_filtered_rows;
            const allFilteredRows = result[1][0];
            for (const row of allFilteredRows) {
                row.slots = JSON.parse(row.slots);
                row.restaurant_collections = JSON.parse(row.restaurant_collections);
            }
            return {
                countOfFilteredRows,
                allFilteredRows
            };
        });

    }
}
