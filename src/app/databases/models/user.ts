import BaseModel from "../models/base";


export default class UserModel extends BaseModel {
    id: any;
    static get tableName() {
        return "user";
    }
}
