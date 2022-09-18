# Pass Engine 🚂
A engine for the Pass system.

# Getting Started
## Prerequisites
### Environment Variables
First, you need to create a `.env` file in the root of the project. Check the [.env.example](./.env.example) file for the variables you need to set.

### Prisma
To run the project, you need to have a database running. You can use the [docker-compose.yml](../docker-compose.yml) file to run a database with docker.
Use the following apply all migrations to the database:
```bash
yarn prisma migrate deploy
```
## Starting the API
To start the Engine, run the following command:
```bash
cargo watch -x run
```