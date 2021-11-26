const superagent = jest.requireActual("superagent");

const Response = jest.fn().mockImplementation(function () {
    this.status = 200;
    this.ok = true;
});

Response.prototype = {
    get: jest.fn(),
    toError: jest.fn()
};

superagent.Request.prototype.abort = jest.fn().mockImplementation(function () {
    this.aborted = true;

    if (this.delayTimer) {
        clearTimeout(this.delayTimer);
    }
});

superagent.Request.prototype.end = jest.fn().mockImplementation(function (callback) {
    if (superagent.mockDelay) {
        this.delayTimer = setTimeout(
            callback,
            0,
            superagent.mockError,
            superagent.mockResponse
        );

        return;
    }

    callback(superagent.mockError, superagent.mockResponse);
});

jest.spyOn(superagent.Request.prototype, "withCredentials");
jest.spyOn(superagent.Request.prototype, "send");

superagent.Response = Response;

superagent.mockResponse = new Response();
superagent.mockError = null;
superagent.mockDelay = false;

export default superagent;
