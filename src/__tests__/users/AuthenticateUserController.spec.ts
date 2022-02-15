import { hash } from "bcryptjs"
import { v4 as uuidV4 } from "uuid"
import request from "supertest"
import { app } from "../../app"
import createConnection from "../../database"
import { Connection } from "typeorm"

let connection: Connection;

describe("Create User Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    })
    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })
    it("Should be able to create a session", async () => {
        const result = await request(app)
            .post("/api/v1/users")
            .send({
                name: "user supertest",
                email: "superte@email.com",
                password: "1123"
            });
        const login = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "superte@email.com",
                password: "1123"
            })
        expect(login.body).toHaveProperty("user");
        expect(login.body).toHaveProperty("token");
        expect(result.status).toBe(201);
    })
})