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
        /*  
            original path                   =>  mapped path in test nock mock
            ------------------------------------------------------------
            /get/users/1?password=XXX       => /get/users/1?password=XXX
            /get/users/1?password=nick      => /get/users/1?password=XXX
            /get/users/1?password=1234      => /get/users/1?password=XXX
            /get/users/1?password=nickjiang => /get/users/1?password=XXX
         */
        nock("http://httpbin.org")
            // .filteringPath(/password=[^&]*/g, 'password=XXX') // use reqex
            .filteringPath(path => '/get/users/1?password=XXX') // use function
            .get("/get/users/1?password=XXX")
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
        ret = await fetch("http://httpbin.org/get/users/1?password=nickjiang"); // match
        expect(ret.status).toEqual(200);
        json = await ret.json();
        console.log(json);
        expect(json.headers.Where).toEqual("Nock");

        console.log(`it: nock.pendingMocks(): ${nock.pendingMocks()}`);
        console.log(`it: nock isDone: ${nock.isDone()}`);
        expect(nock.isDone()).toBe(true);
    });

});