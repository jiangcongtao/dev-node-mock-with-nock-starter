const nock = require("nock");
const fetch = require("node-fetch");

describe("httpbin.org", () => {
    afterAll(() => {
        console.log(`afterAll: nock isDone: ${nock.isDone()}`);
        console.log(`afterAll: nock.pendingMocks(): ${nock.pendingMocks()}`)
        nock.restore();
    });

    beforeAll(() => {
        // filtering :
        // the following will match
        nock("http://httpbin.org")
            .matchHeader('User-Agent', /Mozilla\/.*/)
            .get("/get/users/1")
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
    });
    it("/get should return a response", async() => {
        console.log(`--------------- /get ---------------------`);
        console.log(`nock.activeMocks: ${nock.activeMocks()}`);
        ret = await fetch("http://httpbin.org/get/users/1", {
            headers: { 'User-agent': '/Mozilla/324234' } // will match, headers' key is case insensitive
        }); // match
        expect(ret.status).toEqual(200);
        json = await ret.json();
        console.log(json);
        expect(json.headers.Where).toEqual("Nock");

        console.log(`it: nock.pendingMocks(): ${nock.pendingMocks()}`);
        console.log(`it: nock isDone: ${nock.isDone()}`);
        expect(nock.isDone()).toBe(true);
    });

});