import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host = "localhost"): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions();

    if (defaultOptions) {
        console.log("🚀", defaultOptions.type);
    }
    return createConnection(
        Object.assign(defaultOptions, {
            host:
                process.env.NODE_ENV === "test"
                    ? "localhost"
                    : host,
            database:
                process.env.NODE_ENV === "test"
                    ? "fin_api"
                    : defaultOptions.database
        })
    )
}