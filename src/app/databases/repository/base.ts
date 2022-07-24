import BaseModel from "../models/base";
//import Knex from "knex";
//import {knex} from "../sql-connection";

export default class BaseRepo {

    static startTransaction() {
        return BaseModel.startTransaction();
    }

    static commitTransaction(transaction: any) {
        if (transaction) return transaction.commit();
    }

    static rollbackTransaction(transaction: any) {
        if (transaction) return transaction.rollback();
    }


    static findByAttributeWhereIdIsNotAndGivenModel(
        model: any,
        attributes: any,
        id: any,
        extraAttributes: any,
        dontFetchDeleted: any,
        transaction = null
    ) {
        const query = model.query(transaction);

        query.where(function (innerQuery: any) {
            for (let attribute of attributes) {
                innerQuery.orWhere(attribute.key, attribute.value);
            }
        });

        for (let attribute of extraAttributes) {
            query.where(attribute.key, attribute.value);
        }

        if (dontFetchDeleted) {
            query.where("is_deleted", 0);
        }

        if (id) {
            query.whereNot("id", id);
        }
        return query;
    }

};
