import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";

describe("Create User", () => {
    let createUserUseCase: CreateUserUseCase;
    let inMemoryUsersRepository: InMemoryUsersRepository;

    beforeAll(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("Should be able to create a new user", async () => {
        const newUser = await createUserUseCase.execute({
            name: "User Test",
            email: "user@newuser.com",
            password: "112358"
        })
        expect(newUser).toHaveProperty("id");
        expect(newUser).toMatchObject(newUser);
    })
})