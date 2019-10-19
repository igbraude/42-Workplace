const request = require("supertest")
const {expect} = require("chai")
const app = require("../src")

describe("App", () => {
    describe("GET /app", () => {
        it("should return 200", () => request(app.callback())
            .get("/app")
            .then((res) => {
                expect(res.status).equal(200)
            }))
        
        it("should return hello world", () => request(app.callback())
            .get("/app")
            .then((res) => {
                expect(res.text).equal("hello world")
            }))
    })
})
