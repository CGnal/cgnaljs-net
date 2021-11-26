jest.mock("superagent");

import HttpTransport from "../HttpTransport";

describe("HttpTransport", () => {
    const httpOptions = {
        baseURL: "http://example.com",
        commonHeaders: {
            "Accept": "application/json",
            "Accept-Charset": "utf-8"
        },
        transformer: x => x,
        withCredentials: false
    };
    const authParams = ["user", "pwd"];

    describe("constructor", () => {
        it("should build a HttpTransport instance with the given options", () => {
            const newTransport = new HttpTransport({
                ...httpOptions,
                authParams
            });

            expect(newTransport.authParams).toEqual(authParams);
            expect(newTransport.authParams).not.toBe(authParams);

            expect(newTransport.baseURL).toBe(httpOptions.baseURL);

            expect(newTransport.commonHeaders).toEqual(httpOptions.commonHeaders);
            expect(newTransport.commonHeaders).not.toBe(httpOptions.commonHeaders);

            expect(newTransport.transformer).toBe(httpOptions.transformer);

            expect(newTransport.withCredentials).toBe(httpOptions.withCredentials);
        });

        it("should remove the trailing slash from the `baseURL` option", () => {
            const options = {
                ...httpOptions,
                baseURL: `${httpOptions.baseURL}/`
            };

            expect(new HttpTransport(options).baseURL).toBe(httpOptions.baseURL);
        });

        it("should build a HttpTransport instance with the default options if none is given", () => {
            const value = {};
            const newTransport = new HttpTransport();

            expect(newTransport.authParams).toEqual([]);
            expect(newTransport.baseURL).toBe("");
            expect(newTransport.commonHeaders).toEqual({});
            expect(newTransport.withCredentials).toBe(false);

            expect(newTransport.transformer(value)).toBe(value);
        });
    });

    describe("header management", () => {
        let transport;

        beforeEach(() => {
            transport = new HttpTransport(httpOptions);
        });

        it("should expose a method to add (or replace) a HTTP header", () => {
            const headersA = transport.addHeader("Accept", "text/plain");
            const headersB = transport.addHeader("X-Foo", "bar");

            expect(headersA).toEqual({
                ...httpOptions.commonHeaders,
                Accept: "text/plain"
            });
            expect(headersB).toEqual({
                ...headersA,
                "X-Foo": "bar"
            });
            expect(transport.commonHeaders).toBe(headersB);
        });

        it("should expose a method to remove a HTTP header", () => {
            const headersA = transport.removeHeader("X-Foo");
            const headersB = transport.removeHeader("Accept");

            expect(headersA).toEqual(httpOptions.commonHeaders);
            expect(headersB).toEqual({ "Accept-Charset": "utf-8" });
            expect(transport.commonHeaders).toBe(headersB);
        });
    });

    describe("HTTP verbs methods", () => {
        const transport = new HttpTransport(httpOptions);

        ["DELETE", "GET", "HEAD", "PATCH", "POST", "PUT"].forEach(verb => {
            const acceptsBody = verb[0] === "P";
            const basicAuth = `Basic ${Buffer.from(authParams.join(":")).toString("base64")}`;
            const method = verb.toLowerCase();

            describe(method, () => {
                let req;

                afterEach(() => {
                    req.withCredentials.mockReset();
                    req.send.mockReset();
                });

                it(`should build a ${verb} request`, () => {
                    req = transport[method]("/foo");

                    expect(req.url).toBe(`${httpOptions.baseURL}/foo`);
                    expect(req.method).toBe(verb);
                    expect(req.header).toEqual(expect.objectContaining(httpOptions.commonHeaders));
                    expect(req.withCredentials).not.toHaveBeenCalled();
                });

                it("should accept endpoints without the leading slash", () => {
                    req = transport[method]("foo");

                    expect(req.url).toBe(`${httpOptions.baseURL}/foo`);
                });

                it("should transform the request with the given transformer", () => {
                    const transformerSpy = jest.spyOn(transport, "transformer");

                    req = transport[method]("foo");

                    expect(transformerSpy).toHaveBeenCalledTimes(1);
                    expect(transformerSpy).toHaveBeenCalledWith(req);

                    transformerSpy.mockRestore();
                });

                it("should be able to use Basic Auth", () => {
                    transport.authParams = ["user", "pwd"];
                    req = transport[method]("/foo");

                    expect(req.header).toEqual(expect.objectContaining({
                        ...httpOptions.commonHeaders,
                        Authorization: basicAuth
                    }));

                    transport.authParams = [];
                });

                it("should respect the \"withCredentials\" option", () => {
                    transport.withCredentials = true;
                    req = transport[method]("/foo");

                    expect(req.withCredentials).toHaveBeenCalledTimes(1);

                    transport.withCredentials = false;
                });

                it("should accept querystring parameters", () => {
                    const params = { a: "foo bar", b: 2 };

                    req = transport[method]("/foo", params);

                    expect(req.url).toBe(`${httpOptions.baseURL}/foo`);
                    expect(req.qs).toEqual(params);
                });

                it("should accept additional headers and overwrite the default ones", () => {
                    const headers = {
                        "Accept": "text/plain",
                        "Accept-Language": "en-US"
                    };

                    req = acceptsBody
                        ? transport[method]("/foo", {}, {}, headers)
                        : transport[method]("/foo", {}, headers);

                    expect(req.header).toEqual(expect.objectContaining({
                        ...httpOptions.commonHeaders,
                        ...headers
                    }));
                });

                if (acceptsBody) {
                    it("should accept a request body", () => {
                        const body = {
                            a: "foo bar",
                            b: 2
                        };

                        req = transport[method]("/foo", {}, body);

                        expect(req.send).toHaveBeenCalledTimes(1);
                        expect(req.send).toHaveBeenCalledWith(body);
                    });
                }
            });
        });
    });
});
