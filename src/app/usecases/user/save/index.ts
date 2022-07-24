import BaseUseCase from "../../base";
import UserRepo from "../../../databases/repository/user";
import {saveUserType} from "../../../common-types/user";
import ErrorTypes from "../../../errors/error-types";
import BcryptHelper from "../../../utils/bcrypt";
import Jwt from "../../../utils/jwt/create";

export default class SaveUser extends BaseUseCase {
    private user: saveUserType;

    constructor(user: saveUserType, transaction = null) {
        super(transaction);
        this.user = user;
    }

    save() {
        return this.validate()
            .then(() => {
                return this.performBeforeSaveActions();
            }).then(() => {
                return this.performSaveAction();
            }).then(() => {
                return this.generateJwtToken();
            });
    }

    validate() {
        return this.validateEmail()
            .then((errorList) => {
                this.handleErrorIfExist(
                    errorList,
                    ErrorTypes.MISSING_ATTRIBUTES,
                    "Save user Validation Failed",
                    "BusinessError from validate function in SaveUser"
                );
            });
    }

    validateEmail() {
        return UserRepo.findByEmail(this.user.email)
            .then((user) => {
                return user ? [{
                    field: "email",
                    error: "email already exist"
                }] : [];
            });
    }

    performBeforeSaveActions() {
        return this.encryptPassword();
    }

    encryptPassword() {
        return BcryptHelper.convertStrIntoBcryptStr(this.user.password)
            .then((encryptedPassword) => {
                this.user.password = encryptedPassword
            });
    }

    performSaveAction() {
        return UserRepo.save(this.user)
            .then((userFromDb) => {
                this.user.id = userFromDb.id;
            });
    }

    generateJwtToken() {
        return Jwt.createJwt({
            id: this.user.id,
            name: this.user.name,
            email: this.user.email
        });
    }
}