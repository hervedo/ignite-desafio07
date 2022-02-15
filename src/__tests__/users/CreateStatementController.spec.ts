import { hash } from "bcryptjs"
import { v4 as uuidV4 } from "uuid"
import request from "supertest"
import { app } from "../../app"
import createConnection from "../../database"
import { Connection } from "typeorm"

let connection: Connection;
let token: string;

describe("Create Statement Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
        const result = await request(app)
            .post("/api/v1/users")
            .send({
                name: "user supertest",
                email: "superteste@email.com",
                password: "1123"
            });
        const login = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "superteste@email.com",
                password: "1123"
            })
        token = login.body.token as string;
    })
    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })
    it("Should be able to create a deposit statement", async () => {
        const deposit = await request(app)
            .post("/api/v1/statements/deposit")
            .send({
                amount: 100,
                description: "deposit TEST"
            })
            .auth(token, { type: "bearer" });
        expect(deposit.status).toBe(201)
    })
    it("Should be able to create a withdraw statement", async () => {
        const withdraw = await request(app)
            .post("/api/v1/statements/withdraw")
            .send({
                amount: 50,
                description: "withdraw"
            })
            .auth(token, { type: "bearer" });
        expect(withdraw.status).toBe(201)
    })
    it("Should be able to get balance", async () => {
        const balance = await request(app)
            .get("/api/v1/statements/balance")
            .auth(token, { type: "bearer" });
        expect(balance.body).toHaveProperty("balance")
    })
})