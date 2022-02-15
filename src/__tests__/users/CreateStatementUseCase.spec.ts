import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { GetStatementOperationUseCase } from "../../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { User } from "../../modules/users/entities/User";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";


let inMemoryStatementRepository: InMemoryStatementsRepository;
let createStatement: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUserCase: AuthenticateUserUseCase;
let createUser: CreateUserUseCase;
let getBalance: GetBalanceUseCase;
let getStatementOperation: GetStatementOperationUseCase;
let token: string;
let user: User;

describe("Create Statement", () => {
    beforeAll(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUserCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUser = new CreateUserUseCase(inMemoryUsersRepository);

        inMemoryStatementRepository = new InMemoryStatementsRepository();
        createStatement = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);

        getBalance = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUsersRepository);

        getStatementOperation = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
        const newUser = {
            name: "User Test",
            email: "user@newuser.com",
            password: "112358"
        }
        user = await createUser.execute(newUser);
    })
    it("Should NOT be able to create a new statement withdraw without founds", async () => {
        const authenticate = await authenticateUserUserCase.execute({
            email: "user@newuser.com",
            password: "112358"
        });
        const { id } = authenticate.user;
        enum OperationType {
            DEPOSIT = 'deposit',
            WITHDRAW = 'withdraw',
        }
        const details = {
            user_id: id as string,
            type: "withdraw" as OperationType,
            amount: 50,
            description: "withdraw test"
        }
        expect(async () => {
            const deposit = await createStatement.execute(details)
        }).rejects;
    })
    it("Should be able to create a new statement deposit", async () => {
        const authenticate = await authenticateUserUserCase.execute({
            email: "user@newuser.com",
            password: "112358"
        });
        const { id } = authenticate.user;
        enum OperationType {
            DEPOSIT = 'deposit',
            WITHDRAW = 'withdraw',
        }
        const details = {
            user_id: id as string,
            type: "deposit" as OperationType,
            amount: 100,
            description: "deposit test"
        }
        const deposit = await createStatement.execute(details)
        expect(deposit).toHaveProperty("amount");
    })
    it("Should be able to create a new statement withdraw", async () => {
        const authenticate = await authenticateUserUserCase.execute({
            email: "user@newuser.com",
            password: "112358"
        });
        const { id } = authenticate.user;
        enum OperationType {
            DEPOSIT = 'deposit',
            WITHDRAW = 'withdraw',
        }
        const details = {
            user_id: id as string,
            type: "withdraw" as OperationType,
            amount: 50,
            description: "withdraw test"
        }
        const withdraw = await createStatement.execute(details)
        expect(withdraw).toHaveProperty("amount");
    })
    it("Should be able to get balance", async () => {
        const authenticate = await authenticateUserUserCase.execute({
            email: "user@newuser.com",
            password: "112358"
        });
        const { id } = authenticate.user;
        let details = {
            user_id: id as string,
            statement_id: ""
        }
        const balance = await getBalance.execute({ ...details })
        details.statement_id = balance.statement[0].id as string;
        const statement = await getStatementOperation.execute({ ...details })
        expect(statement).toHaveProperty("description");
    })
    it("Should be able to get statement details", async () => {
        const authenticate = await authenticateUserUserCase.execute({
            email: "user@newuser.com",
            password: "112358"
        });
        const { id } = authenticate.user;
        enum OperationType {
            DEPOSIT = 'deposit',
            WITHDRAW = 'withdraw',
        }
        const details = {
            user_id: id as string
        }
        const balance = await getBalance.execute({ ...details })
        expect(balance).toHaveProperty("balance");
    })


})