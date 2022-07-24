import {NextFunction, Request, Response} from "express";
import ErrorTypes from "../../errors/error-types";
import BusinessError from "../../errors/business-error";
import Jwt from "../../utils/jwt/verify";

declare global {
    namespace Express {
        interface Request {
            user_info: any
        }
    }
}

const jwtVerification = () => (req: Request, res: Response, next: NextFunction) => {

    const jwtTokenWithBearer = req.headers.authorization;

    if (!hasToken(jwtTokenWithBearer)) {
        next(getJwtTokenNotFoundError());
        return;
    }
    const jwtToken = getJwtTokenWithOutBearer(jwtTokenWithBearer ? jwtTokenWithBearer : "");

    return Jwt.verifyTokenGivenPublicKeyPath(jwtToken ? jwtToken : "")
        .then((decodedToken) => {
            req.user_info = decodedToken;
            next();
        }).catch(() => {
            next(getJwtTokenNotFoundError());
        });
};

function hasToken(token: string | undefined) {
    return !!token;
}

function getJwtTokenNotFoundError() {
    return new BusinessError(
        ErrorTypes.NOT_FOUND,
        "Full authorization is required to access this route",
        [],
        "BusinessError from jwt verification middleware"
    );
}

function getJwtTokenWithOutBearer(jwtTokenWithBearer: string) {
    return jwtTokenWithBearer.split(' ').pop();
}

export default jwtVerification;