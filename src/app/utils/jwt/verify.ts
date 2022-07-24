import jwt from "jsonwebtoken";
import FileHelpers from "../file";

export default class Verify {

    static verifyTokenGivenPublicKeyPath(token: string, publicKeyPath = process.env.private_key_path_for_jwt) {
        return Verify.readPublicKey(publicKeyPath ? publicKeyPath : "")
            .then((publicKEY) => {
                return Verify.verifyTokenGivenPublicKey(token, publicKEY);
            });
    }

    static readPublicKey(publicKeyPath: string) {
        return FileHelpers.readFileFromGivenPath(publicKeyPath);
    }

    static verifyTokenGivenPublicKey(token: string, publicKEY: any) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, publicKEY, (error: any, payLoad: any) => {
                if (error)
                    return reject(error);
                resolve(payLoad);
            });
        });
    }

}
