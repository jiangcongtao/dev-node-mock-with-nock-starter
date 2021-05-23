const nock = require("nock");
const fetch = require("node-fetch");

describe("httpbin.org", () => {
    afterAll(() => {
        console.log(`afterAll: nock isDone: ${nock.isDone()}`);
        console.log(`afterAll: nock.pendingMocks(): ${nock.pendingMocks()}`)
        nock.restore();
    });

    beforeAll(() => {
        // filtering : scope , http://api00.httpbin.org will match the scope
        nock("http://httpbin.org", {
                filteringScope: scope => /^http:\/\/api[0-9]*.httpbin.org/.test(scope),
                allowUnmocked: false
            })
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
    });
    it("/get should return a response", async() => {
        console.log(`--------------- /get ---------------------`);
        console.log(`nock.activeMocks: ${nock.activeMocks()}`);
        ret = await fetch("http://api787878.httpbin.org/get"); // match
        // ret = await fetch("http://httpbin.org/get"); // also match
        expect(ret.status).toEqual(200);
        json = await ret.json();
        console.log(json);
        expect(json.headers.Where).toEqual("Nock");

        console.log(`it: nock.pendingMocks(): ${nock.pendingMocks()}`);
        console.log(`it: nock isDone: ${nock.isDone()}`);
        expect(nock.isDone()).toBe(true);
    });

});