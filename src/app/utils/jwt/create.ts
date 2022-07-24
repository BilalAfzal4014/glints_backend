import jwt from "jsonwebtoken";
import FileHelpers from "../file";

export default class Create {

    static createJwt(payLoad: any) {
        return Create.readPrivateKey()
            .then((privateKEY: any) => {
                return Create.jwtTokenAssignment(payLoad, privateKEY)
            }).then((token) => {
                return token;
            });
    }

    static readPrivateKey() {
        // @ts-ignore
        return FileHelpers.readFileFromGivenPath(process.env.private_key_path_for_jwt);
    }

    static jwtTokenAssignment(payLoad: any, privateKEY: any) {
        return new Promise((resolve, reject) => {
            jwt.sign(payLoad, privateKEY, {expiresIn: 30 * day()}, function (error, token) {
                if (error)
                    return reject(error);

                resolve(token)
            });
        });
    }

}

const day = () => {
    return secondsInADay();
}

const secondsInADay = () => {
    return 24 * 60 * 60;
}