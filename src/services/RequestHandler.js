import Axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL

class RequestHandler {
    constructor() {
        this.host = BASE_URL;
        this.headers = {
            "Content-Type": "application/json"
        }
    }

    setToken(token) {
        this.token = token;
    }

    setHost(host) {
        this.host = host
    }

    addHeader(key, value) {
        this.headers[key] = value;
    }

    request(method, path, payload) {
        const { token, host } = this;
        const allowedMethods = ["post", "put", "patch", "delete", "get"];
        return new Promise((resolve, reject) => {
            try {
                let config = { headers: this.headers }
                if (token) config["headers"]["Authorization"] = `Bearer ${token}`;
                if (payload) config['data'] = payload
                let op = allowedMethods.splice(0, 3).includes(method) ?
                    Axios[method](`${host}/${path}`, config.data, config)
                    :
                    Axios[method](`${host}/${path}`, config)
                // make the request
                op.then(res => {
                    resolve(res?.data);
                }).catch(error => {
                    reject(new Error(this.NetworkErrorHandler(error)));
                });
            } catch (error) {
                reject(new Error(this.NetworkErrorHandler(error)))
            }
        })
    }

    NetworkErrorHandler = (error) => {
        if (error.response) return (error.response.data.message)
        if (error.request) return (error.request.statusText)
        return (error.message)
    }
}

export default RequestHandler
