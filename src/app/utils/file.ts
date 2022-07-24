import fs from 'fs';

export default class FileHelpers {
    static readFileFromGivenPath(path: string) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, function (error, fileContent) {
                if (error)
                    return reject(error);

                resolve(fileContent);
            });
        });
    }
}