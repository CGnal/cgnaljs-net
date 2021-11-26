import * as _ from "lamb";
import request from "superagent";

const defaultOptions = {
    authParams: [],
    baseURL: "",
    commonHeaders: {},
    transformer: _.identity,
    withCredentials: false
};

/**
 * Ensure that a string starts with a leading slash.
 * @private
 * @param {String} s
 * @returns {String}
 */
const ensureLeadingSlash = s => s.replace(/^([^/])/, "/$1");

/**
 * A very naive object cloner. Takes into account arrays of simple values and plain objects only.
 * @private
 * @function
 * @param {Array|Object} source
 * @returns {Array|Object}
 */
const naiveClone = _.adapter([
    _.casus(Array.isArray, _.drop(0)),
    _.casus(_.isType("Object"), obj => _.mapValues(obj, naiveClone)),
    _.identity
]);

/**
 * Simple HTTP transport wrapping [superagent]{@link http://visionmedia.github.io/superagent/}.
 * @memberof module:@cgnal/net/http
 * @since 0.0.1
 */
class HttpTransport {
    /**
     * @param {Object} options
     * @param {Array} [options.authParams=[]] Values to use in {@link http://visionmedia.github.io/superagent/#authentication|authentication}.
     * @param {String} [options.baseURL=""] The base URL of the HTTP transport.
     * @param {Object} [options.commonHeaders={}] The HTTP headers that will be used for all requests.
     * @param {Function} [options.transformer=x => x] A transformer function for the returned requests. Defaults to the {@link https://ascartabelli.github.io/lamb/module-lamb.html#identity|identity} function.
     * @param {Boolean} [options.withCredentials=false] Whether to use the {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials|withCredentials} flag or not.
     */
    constructor (options = {}) {
        options = naiveClone({
            ...defaultOptions,
            ...options
        });

        this.authParams = options.authParams;
        this.baseURL = options.baseURL.replace(/\/$/, "");
        this.commonHeaders = options.commonHeaders;
        this.transformer = options.transformer;
        this.withCredentials = options.withCredentials;
    }

    /**
     * @private
     * @param {String} verb
     * @param {String} endpoint
     * @param {Object} headers
     * @param {Object} params
     * @param {FormData|Object} body
     * @returns {SuperAgentRequest}
     */
    _buildRequest (verb, endpoint, headers, params, body) {
        const req = request(
            verb,
            this.baseURL + ensureLeadingSlash(endpoint)
        ).set({
            ...this.commonHeaders,
            ...headers
        });

        req.query(params);

        if (body) {
            req.send(body);
        }

        if (this.withCredentials) {
            req.withCredentials();
        }

        if (this.authParams.length) {
            req.auth(...this.authParams);
        }

        return this.transformer(req);
    }

    /**
     * Adds (or replaces) a header with the given name and value.
     * @param {String} name
     * @param {String} value
     * @returns {Object} The common headers after the addition.
     */
    addHeader (name, value) {
        this.commonHeaders = _.setIn(this.commonHeaders, name, value);

        return this.commonHeaders;
    }

    /**
     * Builds a DELETE request.
     * @param {String} endpoint
     * @param {Object} [params={}]
     * @param {Object} [headers={}]
     * @returns {SuperAgentRequest}
     */
    delete (endpoint, params = {}, headers = {}) {
        return this._buildRequest("DELETE", endpoint, headers, params);
    }

    /**
     * Builds a GET request.
     * @param {String} endpoint
     * @param {Object} [params={}]
     * @param {Object} [headers={}]
     * @returns {SuperAgentRequest}
     */
    get (endpoint, params = {}, headers = {}) {
        return this._buildRequest("GET", endpoint, headers, params);
    }

    /**
     * Builds a HEAD request.
     * @param {String} endpoint
     * @param {Object} [params={}]
     * @param {Object} [headers={}]
     * @returns {SuperAgentRequest}
     */
    head (endpoint, params = {}, headers = {}) {
        return this._buildRequest("HEAD", endpoint, headers, params);
    }

    /**
     * Builds a PATCH request.
     * @param {String} endpoint
     * @param {Object} [params={}]
     * @param {FormData|Object} [body={}]
     * @param {Object} [headers={}]
     * @returns {SuperAgentRequest}
     */
    patch (endpoint, params = {}, body = {}, headers = {}) {
        return this._buildRequest("PATCH", endpoint, headers, params, body);
    }

    /**
     * Builds a POST request.
     * @param {String} endpoint
     * @param {Object} [params={}]
     * @param {FormData|Object} [body={}]
     * @param {Object} [headers={}]
     * @returns {SuperAgentRequest}
     */
    post (endpoint, params = {}, body = {}, headers = {}) {
        return this._buildRequest("POST", endpoint, headers, params, body);
    }

    /**
     * Builds a PUT request.
     * @param {String} endpoint
     * @param {Object} [params={}]
     * @param {FormData|Object} [body={}]
     * @param {Object} [headers={}]
     * @returns {SuperAgentRequest}
     */
    put (endpoint, params = {}, body = {}, headers = {}) {
        return this._buildRequest("PUT", endpoint, headers, params, body);
    }

    /**
     * Removes a HTTP header.
     * @param {String} name
     * @returns {Object} The common headers after the removal.
     */
    removeHeader (name) {
        this.commonHeaders = _.skipIn(this.commonHeaders, [name]);

        return this.commonHeaders;
    }
}

export default HttpTransport;
