export class Api {
    constructor(baseUrl, options = {}) {
        var _a;
        this.baseUrl = baseUrl;
        this.options = {
            headers: Object.assign({ 'Content-Type': 'application/json' }, ((_a = options.headers) !== null && _a !== void 0 ? _a : {}))
        };
    }
    handleResponse(response) {
        if (response.ok)
            return response.json();
        else
            return response.json()
                .then(data => { var _a; return Promise.reject((_a = data.error) !== null && _a !== void 0 ? _a : response.statusText); });
    }
    get(uri) {
        return fetch(this.baseUrl + uri, Object.assign(Object.assign({}, this.options), { method: 'GET' })).then(this.handleResponse);
    }
    post(uri, data, method = 'POST') {
        return fetch(this.baseUrl + uri, Object.assign(Object.assign({}, this.options), { method, body: JSON.stringify(data) })).then(this.handleResponse);
    }
}
