db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE)
db.createUser(
    {
        user: process.env.MONGO_INITDB_USERNAME,
        pwd: process.env.MONGO_INITDB_PASSWORD,
        roles: [
            {
                role: 'readWrite',
                db: process.env.MONGO_INITDB_DATABASE,
            },
        ],
    }
)