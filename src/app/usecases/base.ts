import BaseRepo from "../databases/repository/base";
import BusinessError from "../errors/business-error";

export default class BaseUseCase {
    public transactionInstance: any;

    constructor(transaction = null) {
        this.transactionInstance = transaction;
    }

    getTransactionInstance() {
        return BaseRepo.startTransaction()
            .then((transaction) => {
                return this.transactionInstance = transaction;
            });
    }

    commitTransaction() {
        return BaseRepo.commitTransaction(this.transactionInstance);
    }

    rollbackTransaction() {
        return BaseRepo.rollbackTransaction(this.transactionInstance);
    }

    handleErrorIfExist(errorsList: any[], errorType: string, message: string, location: string, data = {}) {
        if (this.hasError(errorsList)) {
            this.handleError(
                errorsList,
                errorType,
                message,
                location,
                data
            );
        }
    }

    hasError(errorsList: any[]) {
        return errorsList.length > 0;
    }

    handleError(errorsList: any[], errorType: string, message: string, location: string, data = {}) {
        throw new BusinessError(
            errorType,
            message,
            errorsList,
            location,
            data
        );
    }
}