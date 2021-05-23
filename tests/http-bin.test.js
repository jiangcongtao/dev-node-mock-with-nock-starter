const nock = require("nock");
const fetch = require("node-fetch");

describe("httpbin.org", () => {
    afterAll(() => {
        console.log(`afterAll: nock isDone: ${nock.isDone()}`);
        console.log(`afterAll: nock.pendingMocks(): ${nock.pendingMocks()}`)
        nock.done();
        nock.restore();
    });
    // afterEach(nock.cleanAll);

    beforeAll(() => {
        nock("http://httpbin.org")
            .get("/get")
            .reply(
                200, {
                    args: {},
                    headers: {
                        Host: "httpbin.org",
                        Where: "Nock"
                    },
                    url: "http://httpbin.org/get",
                }, [
                    "Content-Type",
                    "application/json"
                ]
            )

        // add another interceptor to the same scope
        nock("http://httpbin.org").get("/get1")
            .reply(
                201, {
                    args: {},
                    headers: {
                        Host: "httpbin.org",
                        Where: "Nock1"
                    },
                    url: "http://httpbin.org/get1",
                }, [
                    "Content-Type",
                    "application/json"
                ]
            );
    });
    it("/get should return a response", async() => {
        console.log(`--------------- /get ---------------------`);
        console.log(`nock.activeMocks: ${nock.activeMocks()}`);
        // nock.recorder.rec();
        ret = await fetch("http://httpbin.org/get");
        expect(ret.status).toEqual(200);
        json = await ret.json();
        console.log(json);
        expect(json.headers.Where).toEqual("Nock");

        console.log(`it: nock.pendingMocks(): ${nock.pendingMocks()}`);
        console.log(`it: nock isDone: ${nock.isDone()}`);
        expect(nock.isDone()).toBe(false);
    });

    it("/get1 should return a response", async() => {
        console.log(`--------------- /get1 ---------------------`);
        expect(nock.isDone()).toBe(false);
        console.log(`it: nock.pendingMocks(): ${nock.pendingMocks()}`);
        console.log(`it: nock isDone: ${nock.isDone()}`);
        // nock.recorder.rec();
        ret = await fetch("http://httpbin.org/get1");
        expect(ret.status).toEqual(201);
        json = await ret.json();
        console.log(json);
        expect(json.headers.Where).toEqual("Nock1");
        expect(nock.isDone()).toBe(true);
    });
});