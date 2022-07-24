import BaseRepo from "./base";
import UserModel from "../models/user";


export default class UserRepo extends BaseRepo {

    static save(user: any, transaction: any = null) {
        if (!user.id) {
            return UserModel.query(transaction).insertAndFetch(user);
        } else {
            return UserModel.query(transaction).updateAndFetchById(user.id, user);
        }
    }

    static findByEmail(email: string) {
        return UserModel.query().where("email", email).first();
    }
}
