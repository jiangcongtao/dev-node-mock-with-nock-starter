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
            original body =>  mapped body in test nock mock
            ------------------------------------------------
            data=ABC&password=nickjiang123123123 => data=ABC&password=XXX
            data=ABC&password=123123123 => data=ABC&password=XXX

            The following will not match 
           original body =>  mapped body in test nock mock
            ------------------------------------------------
            data=ABC1&password=nickjiang123123123 => data=ABC&password=XXX
            data=ABC2&password=123123123 => data=ABC&password=XXX 
         */
        nock("http://httpbin.org")
            .filteringRequestBody(/password=[^&]*/g, 'password=XXX')
            .post("/users", 'data=ABC&password=XXX')
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
        ret = await fetch("http://httpbin.org/users", {
            method: 'post',
            body: 'data=ABC&password=nickjiang123123123',
            headers: { 'Content-Type': 'x-www-form-urlencoded' },
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