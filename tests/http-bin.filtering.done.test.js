const nock = require("nock");
const fetch = require("node-fetch");

describe("httpbin.org", () => {
    afterAll(() => {
        nock.restore();
    });

    beforeAll(() => {

    });
    it("/get should return a response", (done) => {
        const scope = nock("http://httpbin.org")
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
        console.log(`--------------- /get ---------------------`);
        console.log(`nock.activeMocks: ${nock.activeMocks()}`);

        // if comment out fetch, scope.done() will throw the exception
        fetch("http://httpbin.org/get/users/1", {
            headers: { 'User-agent': '/Mozilla/324234' } // will match, headers' key is case insensitive
        }); // match
        console.log(`it: nock.pendingMocks(): ${nock.pendingMocks()}`);
        console.log(`it: nock isDone: ${nock.isDone()}`);
        // expect(nock.isDone()).toBe(true);
        setTimeout(() => {
            scope.done(); // throw exception if nock.mock has not been statisfied
            done();
        }, 3000);
    });

});