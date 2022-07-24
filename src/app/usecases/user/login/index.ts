import BaseUseCase from "../../base";
import UserRepo from "../../../databases/repository/user";
import {loginType} from "../../../common-types/user";
import ErrorTypes from "../../../errors/error-types";
import BcryptHelper from "../../../utils/bcrypt";
import Jwt from "../../../utils/jwt/create";

export default class Login extends BaseUseCase {
    private user: loginType;
    private userFromDb: any;

    constructor(user: loginType, transaction = null) {
        super(transaction);
        this.user = user;
        this.userFromDb = null;
    }

    login() {
        return this.validate()
            .then(() => {
                return this.performLoginAction();
            }).then(() => {
                return this.generateJwtToken();
            });
    }

    validate() {
        return this.validateUser()
            .then((errorList) => {
                return this.loginFailedError(errorList);
            });
    }

    validateUser() {
        return this.fetchUser()
            .then((user) => {
                return user ? [] : this.getUserLoginFailureMessage();
            });
    }

    fetchUser() {
        return UserRepo.findByEmail(this.user.email)
            .then((user) => {
                return this.userFromDb = user;
            });
    }

    performLoginAction() {
        return this.comparePassword()
            .then((matched) => {
                return matched ? this.userFromDb : this.loginFailedError(this.getUserLoginFailureMessage())
            });
    }

    comparePassword() {
        return BcryptHelper.compareFirstBcryptStrWithSecondNormalStr(this.userFromDb.password, this.user.password)
    }

    loginFailedError(errorList: any[]) {
        this.handleErrorIfExist(
            errorList,
            ErrorTypes.NOT_FOUND,
            "Email or Password is incorrect",
            "BusinessError from validate function in Login"
        );
    }

    getUserLoginFailureMessage() {
        return [{
            field: "unknown",
            error: "Email or Password is incorrect"
        }];
    }

    generateJwtToken() {
        return Jwt.createJwt({
            id: this.userFromDb.id,
            name: this.userFromDb.name,
            email: this.userFromDb.email
        });
    }
}