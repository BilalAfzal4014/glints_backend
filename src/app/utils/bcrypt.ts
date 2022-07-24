import bcrypt from 'bcrypt';


export default class BcryptHelper {
    static saltRounds = 10;

    static compareFirstBcryptStrWithSecondNormalStr(bcryptStr: string, normalStr: string) {
        return bcrypt.compare(normalStr, bcryptStr);
    }

    static convertStrIntoBcryptStr(str: string, rounds = null) : Promise<string>{
        return new Promise((resolve, reject) => {
            bcrypt.hash(str, rounds ? rounds : BcryptHelper.saltRounds, function (error: any, hash: string) {
                if (error)
                    return reject(error);
                resolve(hash)
            });
        });
    }
}