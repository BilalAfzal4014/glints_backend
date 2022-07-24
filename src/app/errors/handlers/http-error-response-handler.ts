import {Response} from "express";
import BusinessError from "../business-error";
import ErrorTypes from "../error-types";

export default class HttpErrorResponseHandler {
    private resp: Response;
    private readonly responseFormat: { data: any; message: string; errors: any[]; status: number | null };

    constructor(resp: Response) {
        this.resp = resp;
        this.responseFormat = {
            status: null,
            data: {},
            message: "",
            errors: [],
        };
    }

    handleError(error: BusinessError | any) {
        if (error instanceof BusinessError) {
            this.handleBusinessError(error);
        } else if (error instanceof Error) {
            this.handleApplicationError(error);
        }
    }

    handleBusinessError(error: BusinessError) {

        switch (error.type) {
            case ErrorTypes.EMAIL_REQUIRED_SOCIAL:
                this.responseFormat.status = 210;
                break;
            case ErrorTypes.NOT_FOUND:
                this.responseFormat.status = 400;
                break;
            case ErrorTypes.FORBIDDEN:
                this.responseFormat.status = 403;
                break;
            case ErrorTypes.DUPLICATE_DATA:
                this.responseFormat.status = 401;
                break;
            case ErrorTypes.MISSING_DATA:
                this.responseFormat.status = 400;
                break;
            case ErrorTypes.MISSING_ATTRIBUTES:
                this.responseFormat.status = 400
                break;
            default:
                this.responseFormat.status = 400;
        }
        console.error("Business Error", error.errorLocation, new Date(), error);
        this.responseFormat.errors = error.extraInfo;
        this.responseDataFillUp(this.responseFormat.status, error.data ? error.data : {}, error.message);
        this.resp.status(this.responseFormat.status).json(this.responseFormat);
    }

    handleApplicationError(error: any) {
        console.error("Application Error", new Date(), error);
        this.responseDataFillUp(500, {}, "Server error occurred");
        this.resp.status(500).json(this.responseFormat)
    }

    responseDataFillUp(status: number, data: BusinessError | any, message: string = "") {
        this.responseFormat.status = status;
        this.responseFormat.data = data;
        this.responseFormat.message = message;
    }

};
