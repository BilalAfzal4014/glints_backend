import axios from "axios";

type axiosOptions = {
    method: string,
    url: string,
    responseType?: any
}

export default function httpRequest(options: axiosOptions) {
    return axios({...options})
        .then((response) => {
            return response.data;
        }).catch((error) => {
            return Promise.reject(error.response);
        });
}