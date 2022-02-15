import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUserCase: AuthenticateUserUseCase;
let createUser: CreateUserUseCase;

describe("Verify authenticate", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUserCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUser = new CreateUserUseCase(inMemoryUsersRepository);
    })
    it("Should be able to create a new user and new session", async () => {
        const newUser = {
            name: "User Test",
            email: "user@newuser.com",
            password: "112358"
        }
        await createUser.execute(newUser);
        const authenticate = await authenticateUserUserCase.execute(newUser);
        expect(authenticate).toHaveProperty("token")
    })
})