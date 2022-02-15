import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase"


let showUserProfile: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Verify information by token", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfile = new ShowUserProfileUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("Should be able to receive user information by token", async () => {
        const newUser = await createUserUseCase.execute({
            name: "User Test",
            email: "user@newuser.com",
            password: "112358"
        })
        const user_id = newUser.id as string;
        const user = await showUserProfile.execute(user_id);
        expect(user).toHaveProperty("name");
    })

})